import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import FinancialHealthSettingsModal from "../modals/FinancialHealthIndicatorSettingModal";
import { FinancialHealthIndicatorSettingsSchema } from "@/utils/form/schema";
import useAppSettings from "@/hooks/use-appSettings";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CircleHelp } from "lucide-react";

interface FinancialHealthProps {
  transactions: Tables<"Transactions">[] | [];
  isLoading?: boolean;
}

interface FinancialHealthSettings {
  debtToIncomeThreshold: number;
  savingsRateThreshold: number;
  essentialRatioThreshold: number;
  essentialCategories: string[];
}

export default function FinancialHealth({
  transactions,
  isLoading = false,
}: FinancialHealthProps) {
  const { data: appSettings, isLoading: isAppSettingsLoading } =
    useAppSettings();

  const [settings, setSettings] = useState<FinancialHealthSettings | null>(
    null
  );

  useEffect(() => {
    if (appSettings) {
      setSettings(
        appSettings.dashboard
          .indicators as FinancialHealthIndicatorSettingsSchema
      );
    }
  }, [appSettings]);

  return (
    <Card className="shadow-none border-none p-0 mt-5 mr-0 mb-0 ml-0">
      <CardHeader className="p-0 flex flex-row items-center space-x-1 space-y-0">
        <CardTitle>Financial Health Indicators</CardTitle>
        {settings && (
          <FinancialHealthSettingsModal
            onSettingsChange={(settings) => setSettings(settings as any)}
            currentSettings={settings as FinancialHealthIndicatorSettingsSchema}
          />
        )}
      </CardHeader>
      <CardContent className="px-0 pt-5 pb-0">
        {isLoading || isAppSettingsLoading || !settings ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <FinancialHealthContent
            transactions={transactions}
            isLoading={isLoading}
            settings={settings as FinancialHealthIndicatorSettingsSchema}
          />
        )}
      </CardContent>
    </Card>
  );
}

const FinancialHealthContent = ({
  transactions,
  isLoading,
  settings,
}: {
  transactions: Tables<"Transactions">[] | [];
  isLoading: boolean;
  settings: FinancialHealthSettings;
}) => {
  const metrics = useMemo(() => {
    if (transactions.length === 0 || isLoading || !settings)
      return {
        debtToIncome: 0.0,
        savingsRate: 0.0,
        essentialRatio: 0.0,
      };
    const monthlyIncome =
      Math.abs(
        transactions
          .filter((t) => t.amount! < 0)
          .reduce((sum, t) => sum + t.amount!, 0)
      ) / 3;

    const monthlyExpenses =
      transactions
        .filter((t) => t.amount! > 0)
        .reduce((sum, t) => sum + t.amount!, 0) / 3;

    const essentialExpenses =
      transactions
        .filter(
          (t) =>
            t.amount! > 0 &&
            Array.isArray(settings?.essentialCategories) &&
            settings.essentialCategories.includes(t.category_2 || "")
        )
        .reduce((sum, t) => sum + t.amount!, 0) / 3;

    return {
      debtToIncome: (essentialExpenses / monthlyIncome) * 100,
      savingsRate: ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100,
      essentialRatio: (essentialExpenses / monthlyExpenses) * 100,
    };
  }, [transactions, settings, settings?.essentialCategories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded-lg">
        <div className="flex flex-row items-center space-x-1">
          <p className="text-sm text-muted-foreground">Debt-to-Income</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className="size-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  The debt-to-income ratio is a measure of how much of your
                  income is used to pay off debt. It's calculated as: (Essential
                  Expenses / Monthly Income) × 100. A higher ratio means you're
                  spending more of your income on debt.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-2xl font-bold">{metrics.debtToIncome.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">
          <span
            className={
              metrics.debtToIncome < settings.debtToIncomeThreshold
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {metrics.debtToIncome === 0
              ? "No data"
              : metrics.debtToIncome < settings.debtToIncomeThreshold
              ? "Healthy"
              : "Needs Attention"}
          </span>
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="flex flex-row items-center space-x-1">
          <div className="flex flex-row items-center space-x-1">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelp className="size-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Your savings rate shows what percentage of your income
                    you're saving. It's calculated as: (Income - Expenses) /
                    Income × 100. A higher rate means you're saving more of your
                    income.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="text-2xl font-bold">{metrics.savingsRate.toFixed(1)}%</p>
        <p className="text-xs text-muted-foreground">
          <span
            className={
              metrics.savingsRate > settings.savingsRateThreshold
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {metrics.savingsRate === 0
              ? "No data"
              : metrics.savingsRate > settings.savingsRateThreshold
              ? "Excellent"
              : "Could Improve"}
          </span>
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="flex flex-row items-center space-x-1">
          <p className="text-sm text-muted-foreground">
            Essential Expenses Ratio
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className="size-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  The essential expenses ratio is a measure of how much of your
                  income is used to pay for essential expenses. It's calculated
                  as: (Essential Expenses / Monthly Expenses) × 100. A higher
                  ratio means you're spending more of your income on essential
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-2xl font-bold">
          {metrics.essentialRatio.toFixed(1)}%
        </p>
        <p className="text-xs text-muted-foreground">
          <span
            className={
              metrics.essentialRatio < settings.essentialRatioThreshold
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {metrics.essentialRatio === 0
              ? "No data"
              : metrics.essentialRatio < settings.essentialRatioThreshold
              ? "Good Balance"
              : "High Essential Costs"}
          </span>
        </p>
      </div>
    </div>
  );
};
