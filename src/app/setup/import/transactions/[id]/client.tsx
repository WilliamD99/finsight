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

export default function TransactionsImportPageClient({
  name = "Unknown",
  id,
  item_id,
}: {
  name: string | undefined;
  id: string;
  item_id: string;
}) {
  // To enable the Go To Dashboard button (allow enable when user has finish importing)
  const [isReady, setReady] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<string>("30");

  const router = useRouter();
  const { toast } = useToast();

  const handleImportAction = async () => {
    toast({
      title: "Importing ...",
      description: "Please wait while we importing your data",
    });

    await fetch("/api/plaid/import/transactions", {
      method: "POST",
      body: JSON.stringify({ id, range: selectedRange, item_id }),
    });
    setReady(true);
    toast({
      title: "Import Success!",
      description: "Your data has successfully imported.",
      duration: 2000,
    });
  };

  return (
    <>
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader className="mt-2">
            <DialogTitle>Importing transactions data from {name}</DialogTitle>
            <DialogDescription>
              To use this app, we'll need to import your transactions data into
              our app. You can select a custom range to import (default is 30
              days).
            </DialogDescription>

            <div className="flex flex-row items-center space-x-2 pt-4">
              <p>Import Range:</p>
              <Select
                value={selectedRange}
                onValueChange={(value) => setSelectedRange(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="30 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 flex flex-row space-x-4 justify-end items-center">
              <Button onClick={handleImportAction}>Import</Button>
              <Button
                disabled={!isReady}
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
