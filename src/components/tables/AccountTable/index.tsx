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
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AccountBalanceTable(props: { institutionId?: string }) {
  const { toast } = useToast();
  const { data: accountData, isLoading, error } = useAccountBalance(props);
  const totalBalance = accountData
    ? accountData
        .flatMap((institution) => institution.accounts) // Extract all accounts
        .reduce((sum, account) => sum + (account.balances?.current || 0), 0)
    : 0; // Sum balances

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
        throw new Error("Failed to fetch from Plaid");
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
      queryClient.invalidateQueries({
        queryKey: ["account-balance", props.institutionId],
      });
    }
  };

  return (
    <>
      <Button onClick={handleRefresh} disabled={isRefreshing}>
        {isRefreshing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refreshing...
          </>
        ) : (
          "Request balance"
        )}
      </Button>
      <Table className="bg-sidebar-accent rounded-md h-full">
        <TableHeader className="bg-sidebar-primary-foreground">
          <TableRow>
            <TableHead className="w-1/3">Bank Name</TableHead>
            <TableHead className="w-1/3">Account Name</TableHead>
            <TableHead className="">Type</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              {Array.from({ length: 3 }).map((i, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
          {accountData && accountData.length > 0 && (
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
    </>
  );
}
