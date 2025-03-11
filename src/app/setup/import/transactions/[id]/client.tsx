"use client";

import React, { useState } from "react";

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
import { useLinkUpdate } from "@/components/plaid-link/update";

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

  const { setOpenModal, setInstitutionId } = useLinkUpdate();

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
      const result = await importTransactionAction(form.getValues()); // Use an actual formData object
      console.log("Import result", result);
      if (result?.success) {
        toast({
          title: "Success",
          description: `Successfully imported ${result.count} transactions.`,
          variant: "success",
        });

        setReady(true);
        // Revalidate any related transactions query
        const user = localStorage.getItem("user_profile");
        const userId = user ? JSON.parse(user).id : null;
        queryClient.invalidateQueries({
          queryKey: ["transactions", userId, item_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["transaction-range", userId],
        });
      } else {
        if (result?.error_code === "ITEM_LOGIN_REQUIRED") {
          // Update the Access Token record to include the expired_at field
          await fetch("/api/supabase/access-token-expired", {
            method: "POST",
            body: JSON.stringify({
              id: item_id,
              expired_at: new Date(),
            }),
          });

          // The access token is invalidate, so need to create a function to open the UpdateLinkModal
          // After the UpdateLink create a new access token, replace the old one and remove the expired_at

          // Currently it's not working because when importing transactions
          // it needs to have some record of the account

          toast({
            title: "Error",
            description: "Please re-connect your account.",
            variant: "destructive",
          });
          setInstitutionId(item_id);
          setOpenModal(true);
        }
        throw new Error(result?.error as string);
      }
    } catch (error) {
      console.log("Import failed", error);
      toast({
        title: "Error",
        description: "Failed to import transactions.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="relative bg-background w-full max-w-lg rounded-lg border shadow-lg p-6">
          <Form {...form}>
            <form action={handleImportAction}>
              <div className="mt-2">
                <h2 className="text-lg font-semibold">
                  Importing transactions data from {name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  To use this app, we'll need to import your transactions data
                  into our app. You can select a custom range to import (default
                  is 30 days).
                </p>
                <input type="hidden" {...register("id")} />
                <input type="hidden" {...register("item_id")} />
                <div className="flex flex-row items-center space-x-2 pt-4">
                  <p>Import Range:</p>
                  <Select
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
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
