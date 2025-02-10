"use client";

import SummaryCards from "@/components/dashboard-components/SummaryCards";
import { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

import { formatCurrency } from "@/utils/data";
import TransactionTableComponent from "@/components/tables/TransactionTableComponent";
import PieChartAccountsBalance from "@/components/charts/PieChartAccountsBalance";
import NetFlowChart from "@/components/charts/NetFlowChart";
import { useTransactionData } from "@/hooks/use-transactionData";
import BarChartTopMerchant from "@/components/charts/BarChartTopMerchant";
import PieChartSpendingDistribution from "@/components/charts/PieChartSpendingDistribution";
import { ImportIcon } from "lucide-react";
import LineChartSpendingTrend from "@/components/charts/LineChartSpendingTrend";
import RangeSelect from "@/components/ui/range-select";
import AccountBalanceTable from "@/components/tables/AccountTable";

export default function DashboardAccountPageClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRange = searchParams.get("range") || "30";

  const { data: transactionData = [] } = useTransactionData({
    institutionId: id,
    range: initialRange,
  });

  return (
    <>
      <div id="home" className="flex flex-col space-y-5">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row justify-between items-center space-x-2">
            <p className="text-lg font-medium">Accounts Overview</p>

            <Link
              href={`/setup/import/transactions/${id}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Import data <ImportIcon className="size-3 ml-1" />
            </Link>
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <p className="text-sm">
              You can see your accounts overview for this period:
            </p>
            <RangeSelect />
          </div>
        </div>
        <div className="grid grid-cols-1 3xl:grid-cols-3 gap-x-10 gap-y-5 2xl:gap-x-20">
          <div className="flex col-span-1 flex-col space-y-5">
            <div className="flex flex-col space-y-2"></div>
            <AccountBalanceTable institutionId={id} />
            <div className="grid grid-cols-2 gap-3">
              {/* <PieChartAccountsBalance accounts={accounts} /> */}
              <NetFlowChart data={transactionData} />
              <BarChartTopMerchant data={transactionData} />
              <PieChartSpendingDistribution data={transactionData} />
              <LineChartSpendingTrend data={transactionData} />
            </div>
          </div>
          <div className="flex col-span-1 flex-col space-y-5">
            <Table className="bg-sidebar-accent rounded-md">
              <TableBody>
                {transactionData.map((transaction: any) => (
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
      </div>
    </>
  );
}
