import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccountBalance } from "@/hooks/use-accountBalance";
import { formatCurrency } from "@/utils/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Account, columns } from "./Column";

export default function AccountBalanceTable(props: { institutionId?: string }) {
  const { toast } = useToast();
  const { data: accountData, isLoading, error } = useAccountBalance(props);
  const totalBalance = accountData
    ? accountData
        .flatMap((institution) => institution.accounts) // Extract all accounts
        .reduce((sum, account) => sum + (account.balances?.current || 0), 0)
    : 0; // Sum balances

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<Account>({
    data: (accountData ?? []).map((institution) => ({
      name: institution.name,
      accounts: institution.accounts.map((account) => ({
        name: account.name,
        type: account.type,
        account_id: account.account_id,
        balances: {
          current: account.balances?.current ?? 0,
        },
      })),
    })),
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing balances...",
      description: "Please wait while we refresh the balances",
    });
    try {
      // Fetch fresh data from Plaid
      const plaidRes = await fetch("/api/plaid/get-account", {
        method: "POST",
        body: JSON.stringify(
          props.institutionId ? { institutionId: props.institutionId } : {}
        ),
      });

      if (!plaidRes.ok) {
        toast({
          title: "Error refreshing balances",
          description: "Please try again",
          variant: "destructive",
        });
        // throw new Error("Failed to fetch from Plaid");
      }
      toast({
        title: "Balances refreshed",
        description: "Balances have been refreshed successfully",
        variant: "success",
      });
    } catch (e) {
      console.error("Error refreshing balances:", e);
    } finally {
      setIsRefreshing(false);
      const user = localStorage.getItem("user_profile");
      const userId = user ? JSON.parse(user).id : null;
      queryClient.invalidateQueries({
        queryKey: ["account-balance", userId, props.institutionId],
      });
    }
  };

  return (
    <div className="rounded-md border p-5 space-y-5">
      <p className="text-lg font-medium">Account Balance</p>
      <Table className="">
        <TableHeader className="bg-theme-lightBackground">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : accountData && accountData.length > 0 ? (
            <React.Fragment>
              {accountData.map((item, index) => (
                <React.Fragment key={`${item.name}-${index}`}>
                  {item.accounts.map((account) => (
                    <TableRow key={account.account_id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className="capitalize">
                        {account.type}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.balances.current
                          ? formatCurrency(account.balances.current.toString())
                          : 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {totalBalance ? formatCurrency(totalBalance?.toString()) : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex flex-row justify-between items-center">
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            "Sync Balance"
          )}
        </Button>
      </div>
    </div>
  );
}
