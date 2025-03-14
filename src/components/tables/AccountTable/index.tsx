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
import { Loader2, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Account, columns } from "./Column";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AccountBalanceTable(props: { institutionId?: string }) {
  const { toast } = useToast();
  const { data: accountData, isLoading, error } = useAccountBalance(props);
  const totalBalance = accountData
    ? accountData
        .flatMap((institution) => institution.accounts)
        .reduce((sum, account) => sum + (account.balances?.current || 0), 0)
    : 0;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

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
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing balances...",
      description: "Please wait while we refresh the balances",
    });
    try {
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
      } else {
        toast({
          title: "Balances refreshed",
          description: "Balances have been refreshed successfully",
          variant: "success",
        });
      }
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
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Account Balance</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sync Balance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : accountData && accountData.length > 0 ? (
                <React.Fragment>
                  {accountData.map((item, index) => (
                    <React.Fragment key={`${item.name}-${index}`}>
                      {item.accounts.map((account) => (
                        <TableRow key={account.account_id}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{account.name}</TableCell>
                          <TableCell className="capitalize">
                            {account.type}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.balances.current
                              ? formatCurrency(
                                  account.balances.current.toString()
                                )
                              : "$0.00"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No accounts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter className="bg-muted/50">
              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Total Balance
                </TableCell>
                <TableCell className="text-right font-bold">
                  {totalBalance
                    ? formatCurrency(totalBalance?.toString())
                    : "$0.00"}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
