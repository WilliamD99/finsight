"use client";

import React from "react";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

import NetFlowChart from "@/components/charts/NetFlowChart";
import { useTransactionData } from "@/hooks/use-transactionData";
import BarChartTopMerchant from "@/components/charts/BarChartTopMerchant";
import PieChartSpendingDistribution from "@/components/charts/PieChartSpendingDistribution";
import { ImportIcon } from "lucide-react";
import RangeSelect from "@/components/ui/range-select";
import AccountBalanceTable from "@/components/tables/AccountTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import { useTransactionDateRange } from "@/hooks/use-transactionRange";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionTableComponent from "@/components/tables/TransactionTableComponent";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { TransactionTableSkeleton } from "@/components/skeletons/TransactionTableSkeleton";

export default function DashboardAccountPageClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const initialRange = decodeURIComponent(searchParams.get("range") || "30");

  const { data: transactionData = [], isLoading: transactionDataLoading } =
    useTransactionData({
      institutionId: id,
      range: JSON.parse(initialRange),
    });
  const { data: transactionRange, isLoading: transactionRangeLoading } =
    useTransactionDateRange();

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
          {transactionRangeLoading && <Skeleton className="h-5 w-72" />}
          {transactionRange && (
            <div className="flex flex-row items-center space-x-1">
              <p className="italic text-xs text-gray-500">
                {transactionData.length > 0 ? (
                  <>
                    Your transaction data is from{" "}
                    <span className="font-bold">
                      {transactionRange.min.toDateString()}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold">
                      {transactionRange.max.toDateString()}
                    </span>
                  </>
                ) : (
                  "No transaction data available for this period"
                )}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleHelp className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      To add more data, please go to your bank and import more
                      data.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 3xl:grid-cols-3 gap-x-10 gap-y-5 2xl:gap-x-20">
          <div className="flex col-span-1 flex-col space-y-5">
            <div className="flex flex-col space-y-2"></div>
            <AccountBalanceTable institutionId={id} />
            {transactionDataLoading ? (
              <div className="grid grid-cols-2 gap-3">
                <ChartSkeleton
                  hasSelect
                  titleWidth="w-32"
                  descriptionWidth="w-64"
                />
                <ChartSkeleton
                  hasSelect
                  doubleSelect
                  titleWidth="w-32"
                  descriptionWidth="w-48"
                />
                <ChartSkeleton titleWidth="w-40" descriptionWidth="w-72" />
              </div>
            ) : (
              transactionData.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <NetFlowChart data={transactionData} />
                  <BarChartTopMerchant data={transactionData} />
                  <PieChartSpendingDistribution data={transactionData} />
                </div>
              )
            )}
          </div>
          <div className="flex col-span-1 flex-col space-y-5">
            {transactionDataLoading ? (
              <TransactionTableSkeleton rowCount={5} />
            ) : (
              <TransactionTableComponent data={transactionData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
