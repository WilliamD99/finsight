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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function DashboardAccountPageClient({
  data,
  id,
  accounts,
}: {
  data: Tables<"Transactions">[] | [];
  id: string;
  accounts: AccountBase[];
}) {
  const router = useRouter();
  console.log(data);
  return (
    <>
      <div id="home" className="flex flex-col space-y-5">
        <div className="grid grid-cols-3 gap-x-10 gap-y-5 xl:gap-x-20">
          <div className="flex col-span-1 flex-col space-y-5">
            <p className="text-lg font-medium">Accounts:</p>
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
          <div className="flex col-span-1 flex-col space-y-5">
            <div className="flex flex-row justify-between items-center">
              <p className="text-lg font-medium">Transactions:</p>
              <Link
                className="flex flex-row items-center"
                href={`/dashboard/${id}/transactions`}
              >
                See all <ChevronRight className="size-4" />
              </Link>
            </div>
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
        </div>
        <div className="grid grid-cols-3 gap-x-10 gap-y-5 xl:gap-x-20">
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
        </div>
      </div>
    </>
  );
}
