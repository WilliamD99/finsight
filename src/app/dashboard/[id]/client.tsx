"use client";

import SummaryCards from "@/components/dashboard-components/SummaryCards";
import { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AccountBase } from "plaid";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/data";
import TransactionTableComponent from "@/components/tables/TransactionTableComponent";
import { columns } from "@/components/tables/TransactionTableComponent/Columns";
import PieChartAccountsBalance from "@/components/charts/PieChartAccountsBalance";

export default function DashboardAccountPageClient({
  data,
  id,
  accounts,
}: {
  data: Tables<"Transactions">[] | [];
  id: string;
  accounts: AccountBase[];
}) {
  console.log(accounts);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRange = searchParams.get("range") || "30";

  const rangeOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    // { value: 'custom', label: 'custom' }
  ];

  const handleUpdateDateRange = (selectedDateRange: string) => {
    // Create a new URLSearchParams object
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    // Set the new category
    current.set("range", selectedDateRange);
    // Convert to string
    const search = current.toString();
    // Create new URL with updated params
    const query = search ? `?${search}` : "";
    // Push the new URL
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <>
      <div id="home" className="flex flex-col space-y-5">
        <div className="flex flex-col space-y-2">
          <p className="text-lg font-medium">Accounts Overview</p>
          <div className="flex flex-row space-x-2 items-center">
            <p className="text-sm">
              You can see your accounts overview for this period:
            </p>
            <Select
              defaultValue={initialRange}
              onValueChange={handleUpdateDateRange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="30 days" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-10 gap-y-5 xl:gap-x-20">
          <div className="flex col-span-1 flex-col space-y-5">
            <div className="flex flex-col space-y-2"></div>
            <div className="grid grid-cols-2 gap-3">
              <Table className="bg-sidebar-accent rounded-md h-full">
                <TableHeader className="bg-sidebar-primary-foreground">
                  <TableRow>
                    <TableHead className="w-1/2">Account Name</TableHead>
                    <TableHead className="">Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow
                      onClick={() =>
                        router.push(`/dashboard/${id}/${account.account_id}`)
                      }
                      key={account.account_id}
                      className="cursor-pointer hover:bg-sidebar-border"
                    >
                      <TableCell className="font-medium">
                        {account.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {account.type}
                      </TableCell>
                      <TableCell className="text-right">
                        {account.balances.current &&
                          formatCurrency(account.balances.current.toString())}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PieChartAccountsBalance accounts={accounts} />
            </div>
          </div>
          <div className="flex col-span-1 flex-col space-y-5">
            <Table className="bg-sidebar-accent rounded-md">
              <TableBody>
                {data.map((transaction) => (
                  <TableRow
                    key={transaction.transaction_id}
                    className="hover:bg-sidebar-border"
                  >
                    <TableCell className="font-medium flex flex-row space-x-1 items-center">
                      <Avatar className="size-8">
                        {transaction.logo_url ? (
                          <AvatarImage src={transaction.logo_url} />
                        ) : (
                          <AvatarFallback>CN</AvatarFallback>
                        )}
                      </Avatar>
                      <span>{transaction.name}</span>
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {transaction.payment_channel}
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* <div className="flex col-span-1 flex-col space-y-5">
            <div className="flex flex-row justify-between items-center">
              <p className="text-lg font-medium">Transactions:</p>
              <Link
                className="flex flex-row items-center"
                href={`/dashboard/${id}/transactions`}
              >
                See all <ChevronRight className="size-4" />
              </Link>
            </div>
            <TransactionTableComponent data={data} />
          </div> */}
        </div>
        {/* <div className="grid grid-cols-3 gap-x-10 gap-y-5 xl:gap-x-20">
          <div className="flex col-span-2 flex-col space-y-5">
            <p className="text-lg font-medium">Analytics & budgeting :</p>
            <Table className="bg-sidebar-accent rounded-md">
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="w-[100px]">Mask</TableHead>
                  <TableHead className="w-[200px]">Type</TableHead>
                  <TableHead className="text-right w-[100px]">
                    Balance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow
                    onClick={() =>
                      router.push(`/dashboard/${id}/${account.account_id}`)
                    }
                    key={account.account_id}
                    className="cursor-pointer hover:bg-sidebar-border"
                  >
                    <TableCell className="font-medium">
                      {account.name}
                    </TableCell>
                    <TableCell>{account.mask}</TableCell>
                    <TableCell className="capitalize">{account.type}</TableCell>
                    <TableCell className="text-right">
                      {account.balances.iso_currency_code}
                      {account.balances.current}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div> */}
      </div>
    </>
  );
}
