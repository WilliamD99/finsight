"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-btn";
import {
  accountImportFormSchema,
  AccountImportFormSchema,
} from "@/utils/form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountBase } from "plaid";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { importAccountsAction } from "../action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function ImportAccountsClient({
  name,
  accounts,
  institutionId,
  importTransactionReady,
}: {
  name: string;
  accounts: AccountBase[];
  institutionId: string;
  importTransactionReady: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<AccountImportFormSchema>({
    resolver: zodResolver(accountImportFormSchema),
    defaultValues: {
      accounts: [],
    },
  });

  const { setValue, watch } = form;
  const selectedAccounts = watch("accounts");
  const [isReady, setIsReady] = useState<boolean>(accounts.length === 0);
  const [importedAccountIds, setImportedAccountIds] = useState<string[]>([]);

  const { toast } = useToast();

  const handleAccountSelect = (account: AccountBase, checked: boolean) => {
    // Don't allow selection of already imported accounts
    if (importedAccountIds.includes(account.account_id)) {
      return;
    }

    const currentAccounts = selectedAccounts;
    if (checked) {
      setValue("accounts", [
        ...currentAccounts,
        {
          id: account.account_id,
          item_id: institutionId,
          name: account.name,
          type: account.type,
          subtype: account.subtype ?? "", // Convert null to empty string
          mask: account.mask ?? undefined, // Convert null to undefined
          balance: account.balances?.current ?? undefined, // Convert null to undefined
          currency: account.balances?.iso_currency_code ?? undefined, // Convert null to undefined
        },
      ]);
    } else {
      setValue(
        "accounts",
        currentAccounts.filter((a) => a.id !== account.account_id)
      );
    }
  };

  const handleImportAction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // prevent user from submit if there is no accounts to import
      if (accounts.length === 0) {
        toast({
          title: "Error",
          description: "No accounts to import",
          variant: "destructive",
        });
        return;
      }

      let result = await importAccountsAction(form.getValues());

      if (result?.success) {
        // Add successfully imported accounts to the disabled list
        const newlyImportedIds = selectedAccounts.map((account) => account.id);
        setImportedAccountIds((prev) => [...prev, ...newlyImportedIds]);

        // Clear the selection
        setValue("accounts", []);

        toast({
          title: "Success",
          description: `${selectedAccounts.length} accounts imported successfully"`,
          variant: "success",
        });

        // Only set ready if all accounts are imported
        // const allAccountsImported = accounts.every(
        //   (account) =>
        //     importedAccountIds.includes(account.account_id) ||
        //     newlyImportedIds.includes(account.account_id)
        // );
        setIsReady(true);

        // invalidate bank accounts query
        const user = localStorage.getItem("user_profile");
        const userId = user ? JSON.parse(user).id : null;
        queryClient.invalidateQueries({
          queryKey: ["bank-accounts", userId],
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to import accounts",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative bg-background w-full max-w-lg rounded-lg border shadow-lg p-6">
        <Form {...form}>
          <form onSubmit={handleImportAction}>
            <div className="mt-2">
              <h2 className="text-lg font-semibold">
                Importing accounts data from {name}
              </h2>
              <p className="text-sm text-muted-foreground">
                To use this app, we'll need to import your bank accounts
              </p>
              <div className="flex flex-col space-y-2 pt-4">
                {accounts.length > 0 &&
                  accounts.map((account) => (
                    <div
                      key={account.account_id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={account.account_id}
                        checked={selectedAccounts.some(
                          (a) => a.id === account.account_id
                        )}
                        disabled={importedAccountIds.includes(
                          account.account_id
                        )}
                        onCheckedChange={(checked) =>
                          handleAccountSelect(account, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={account.account_id}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          importedAccountIds.includes(account.account_id)
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {account.name} ({account.type} - {account.subtype})
                        {importedAccountIds.includes(account.account_id) &&
                          " (Imported)"}
                      </label>
                    </div>
                  ))}
                {accounts.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No accounts found, either you have already imported all
                    accounts or there is an error with your account.
                  </div>
                )}
              </div>
              <div className="pt-4 flex flex-row space-x-4 justify-end items-center">
                <SubmitButton
                  disabled={
                    accounts.length === 0 || selectedAccounts.length === 0
                  }
                >
                  Import
                </SubmitButton>
                <Button
                  disabled={!importTransactionReady || !isReady}
                  onClick={() =>
                    router.push(`/setup/import/transactions/${institutionId}`)
                  }
                  type="button"
                >
                  Import Transactions
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
