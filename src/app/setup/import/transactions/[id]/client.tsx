"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { SubmitButton } from "@/components/ui/submit-btn";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  transactionImportFormSchema,
  TransactionImportFormSchema,
} from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { importTransactionAction } from "../action";
import { useQueryClient } from "@tanstack/react-query";

import { DateRange } from "react-day-picker";

import CalendarSelector from "@/components/dialogs/CalendarSelector";

export default function TransactionsImportPageClient({
  name = "Unknown",
  id,
  item_id,
}: {
  name: string | undefined;
  id: string;
  item_id: string;
}) {
  const queryClient = useQueryClient();
  // To enable the Go To Dashboard button (allow enable when user has finish importing)
  const [isReady, setReady] = useState<boolean>(false);
  const [selectedRange] = useState<string | DateRange>("30");

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TransactionImportFormSchema>({
    resolver: zodResolver(transactionImportFormSchema),
    defaultValues: {
      id,
      range: selectedRange,
      item_id,
    },
  });

  const { register, watch, setValue } = form;

  const currentRange = watch("range"); // string or { from: Date; to: Date }

  const handleImportAction = async () => {
    try {
      await importTransactionAction(form.getValues()); // Use an actual formData object

      toast({
        title: "Success",
        description: "Transactions imported successfully.",
        variant: "success",
      });

      setReady(true);
      // Revalidate any related transactions query
      queryClient.invalidateQueries({ queryKey: ["transactions", item_id] });
      queryClient.invalidateQueries({ queryKey: ["transaction-range"] });
    } catch (error) {
      console.error("Import failed", error);
      toast({
        title: "Error",
        description: "Failed to import transactions.",
      });
    }
  };

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={() => router.push(`/dashboard/${item_id}`)}
      >
        <DialogContent>
          <Form {...form}>
            <form action={handleImportAction}>
              <DialogHeader className="mt-2">
                <DialogTitle>
                  Importing transactions data from {name}
                </DialogTitle>
                <DialogDescription>
                  To use this app, we'll need to import your transactions data
                  into our app. You can select a custom range to import (default
                  is 30 days).
                </DialogDescription>
                <input type="hidden" {...register("id")} />
                <input type="hidden" {...register("item_id")} />
                <div className="flex flex-row items-center space-x-2 pt-4">
                  <p>Import Range:</p>
                  <Select
                    // If `currentRange` is a string like "30", we can show it directly
                    // If it's an object, let's interpret that as "CUSTOM"
                    value={
                      typeof currentRange === "string" ? currentRange : "CUSTOM"
                    }
                    onValueChange={(value) => {
                      if (value === "30" || value === "60" || value === "90") {
                        setValue("range", value);
                      } else {
                        setValue("range", {
                          from: new Date(),
                          to: new Date(),
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="30">
                        30 days
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="60">
                        60 days
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="90">
                        90 days
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="CUSTOM">
                        Custom range
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {typeof currentRange !== "string" && (
                  <div className="flex flex-row items-center space-x-2 pt-4">
                    <CalendarSelector
                      onSelect={(range) => setValue("range", range)}
                    />
                  </div>
                )}
                <div className="pt-4 flex flex-row space-x-4 justify-end items-center">
                  <SubmitButton>Import</SubmitButton>
                  <Button
                    disabled={!isReady}
                    onClick={() => router.push("/dashboard")}
                    type="button"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </DialogHeader>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
