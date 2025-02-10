import React from "react";
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

export default function AccountBalanceTable(props: { institutionId?: string }) {
  const { data: accountData, isLoading } = useAccountBalance(props);
  const totalBalance = accountData
    ? accountData
        .flatMap((institution) => institution.accounts) // Extract all accounts
        .reduce((sum, account) => sum + (account.balances?.current || 0), 0)
    : 0; // Sum balances

  return (
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
                    <TableCell className="capitalize">{account.type}</TableCell>
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
  );
}
