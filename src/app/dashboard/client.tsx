"use client";

import React, { useMemo, useCallback } from "react";
import { useTransactionData } from "@/hooks/use-transactionData";
import { useSearchParams, useRouter } from "next/navigation";
import RangeSelect from "@/components/ui/range-select";
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
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { TransactionTableSkeleton } from "@/components/skeletons/TransactionTableSkeleton";
import useImportedBankAccounts from "@/hooks/use-importedBankAccounts";
import BankAccountSelect from "@/components/ui/bank-account-select";

export default function DashboardClient({}: {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRange = decodeURIComponent(searchParams.get("range") || "30");
  const selectedAccount = searchParams.get("account");

  const { data: bankAccounts = [], isLoading: bankAccountsLoading } =
    useImportedBankAccounts();

  const { data: transactionData = [], isLoading: transactionDataLoading } =
    useTransactionData({
      range: JSON.parse(initialRange),
    });

  const handleAccountChange = useCallback(
    (accountId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (accountId) {
        params.set("account", accountId);
      } else {
        params.delete("account");
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [searchParams, router]
  );

  const filteredTransactions = useMemo(() => {
    if (!selectedAccount) return transactionData;
    return transactionData.filter(
      (transaction) => transaction.account_id === selectedAccount
    );
  }, [transactionData, selectedAccount]);

  const { data: transactionRange, isLoading: transactionRangeLoading } =
    useTransactionDateRange();

  const showTransactionRange = useMemo(() => {
    if (!transactionRange) return null;
    return (
      <div className="flex flex-row items-center space-x-1">
        <p className="italic text-xs text-gray-500">
          {filteredTransactions.length > 0 ? (
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
                To add more data, please go to your bank and import more data.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }, [transactionRange, filteredTransactions.length]);

  const renderCharts = useMemo(() => {
    if (transactionDataLoading) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <ChartSkeleton hasSelect titleWidth="w-32" descriptionWidth="w-64" />
          <ChartSkeleton
            hasSelect
            doubleSelect
            titleWidth="w-32"
            descriptionWidth="w-48"
          />
          <ChartSkeleton titleWidth="w-40" descriptionWidth="w-72" />
          <ChartSkeleton titleWidth="w-36" descriptionWidth="w-64" />
        </div>
      );
    }

    if (filteredTransactions.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-3">
        <NetFlowChart data={filteredTransactions} />
        <BarChartTopMerchant data={filteredTransactions} />
        <PieChartSpendingDistribution data={filteredTransactions} />
        <CategoryAnalysis transactions={filteredTransactions} />
      </div>
    );
  }, [transactionDataLoading, filteredTransactions]);

  return (
    <div id="home" className="flex flex-col space-y-2">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between items-center space-x-2">
          <p className="text-lg font-medium">Accounts Summary</p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <div className="flex flex-row space-x-2 items-center">
            <p className="text-sm">
              You can see your accounts overview for this period:
            </p>
            <RangeSelect />
          </div>
          <div className="flex flex-row space-x-2 items-center">
            <p className="text-sm">Filter by account:</p>
            <BankAccountSelect
              accounts={bankAccounts}
              selectedAccount={selectedAccount}
              onAccountChange={handleAccountChange}
              isLoading={bankAccountsLoading}
            />
          </div>
        </div>
        {transactionRangeLoading && <Skeleton className="h-5 w-72" />}
        {showTransactionRange}
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
          {renderCharts}
        </div>
        <div className="flex col-span-1 flex-col space-y-5">
          {transactionDataLoading ? (
            <TransactionTableSkeleton rowCount={5} />
          ) : (
            <TransactionTableComponent data={filteredTransactions} />
          )}
        </div>
      </div>
    </div>
  );
}
