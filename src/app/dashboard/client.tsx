"use client";

import React from "react";
import LineChartComponent from "@/components/charts/LineChartComponent";
import TransactionTableComponent from "@/components/tables/TransactionTableComponent/index";
import { columns } from "@/components/tables/TransactionTableComponent/Columns";
import { Transaction } from "plaid";
import { filterTransactionsByKeys, formatCurrency } from "@/utils/data";
import BarChartComponent from "@/components/charts/BarChartComponent";
import SummaryCards from "@/components/dashboard-components/SummaryCards";
import { useTransactionData } from "@/hooks/use-transactionData";
import { useSearchParams, useRouter } from "next/navigation";

import RangeSelect from "@/components/ui/range-select";

import LineChartSpendingTrend from "@/components/charts/LineChartSpendingTrend";
import PieChartSpendingDistribution from "@/components/charts/PieChartSpendingDistribution";
import BarChartTopMerchant from "@/components/charts/BarChartTopMerchant";
import NetFlowChart from "@/components/charts/NetFlowChart";
import AccountBalanceTable from "@/components/tables/AccountTable";

export default function DashboardClient({}: {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRange = searchParams.get("range") || "30";

  const { data: transactionData = [] } = useTransactionData({
    range: initialRange,
  });

  return (
    <>
      <div id="home" className="flex flex-col space-y-5">
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
        </div>
        <div className="grid grid-cols-1 3xl:grid-cols-3 gap-x-10 gap-y-5 2xl:gap-x-20">
          <div className="flex col-span-1 flex-col space-y-5">
            <div className="flex flex-col space-y-2"></div>
            <AccountBalanceTable />
            <div className="grid grid-cols-2 gap-3">
              {/* <PieChartAccountsBalance accounts={accounts} /> */}
              <NetFlowChart data={transactionData} />
              <BarChartTopMerchant data={transactionData} />
              <PieChartSpendingDistribution data={transactionData} />
              <LineChartSpendingTrend data={transactionData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
