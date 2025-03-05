"use client";

import React from "react";
import { useTransactionData } from "@/hooks/use-transactionData";
import { useSearchParams } from "next/navigation";
import RangeSelect from "@/components/ui/range-select";
import LineChartSpendingTrend from "@/components/charts/LineChartSpendingTrend";
import PieChartSpendingDistribution from "@/components/charts/PieChartSpendingDistribution";
import BarChartTopMerchant from "@/components/charts/BarChartTopMerchant";
import NetFlowChart from "@/components/charts/NetFlowChart";
import AccountBalanceTable from "@/components/tables/AccountTable";
import { useTransactionDateRange } from "@/hooks/use-transactionRange";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import TransactionTableComponent from "@/components/tables/TransactionTableComponent";
import CategoryAnalysis from "@/components/charts/BarChartCategoryAnalysis";
import FinancialHealth from "@/components/charts/FinancialHealthIndicator";

export default function DashboardClient({}: {}) {
  const searchParams = useSearchParams();
  const initialRange = decodeURIComponent(searchParams.get("range") || "30");

  const { data: transactionData = [] } = useTransactionData({
    range: JSON.parse(initialRange),
  });
  const { data: transactionRange, isLoading: transactionRangeLoading } =
    useTransactionDateRange();
  return (
    <div id="home" className="flex flex-col space-y-2">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between items-center space-x-2">
          <p className="text-lg font-medium">Accounts Summary</p>
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
              Your transaction data is from{" "}
              <span className="font-bold">
                {transactionRange.min.toDateString()}
              </span>{" "}
              to{" "}
              <span className="font-bold">
                {transactionRange.max.toDateString()}
              </span>
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
          <div className="flex flex-col space-y-2">
            <FinancialHealth
              isLoading={transactionRangeLoading}
              transactions={transactionData}
            />
          </div>
          <AccountBalanceTable />
          <div className="grid grid-cols-2 gap-3">
            <NetFlowChart data={transactionData} />
            <BarChartTopMerchant data={transactionData} />
            <PieChartSpendingDistribution data={transactionData} />
            <CategoryAnalysis transactions={transactionData} />
          </div>
        </div>
        <div className="flex col-span-1 flex-col space-y-5">
          <TransactionTableComponent data={transactionData} />
        </div>
      </div>
    </div>
  );
}
