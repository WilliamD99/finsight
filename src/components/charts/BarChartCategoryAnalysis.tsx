import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Tables } from "@/types/supabase";

interface CategoryAnalysisProps {
  transactions: Tables<"Transactions">[] | [];
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CategoryAnalysis({
  transactions,
}: CategoryAnalysisProps) {
  // Only consider spending transactions (positive amounts)
  const spendingTransactions = useMemo(
    () => transactions.filter((t) => t.amount! > 0),
    [transactions]
  );

  // Day of week spending patterns
  const dayOfWeekStats = useMemo(() => {
    const stats = new Array(7).fill(0).map((_, i) => ({
      day: DAYS[i],
      total: 0,
      count: 0,
    }));

    spendingTransactions.forEach((t) => {
      const dayIndex = new Date(t.date!).getDay();
      stats[dayIndex].total += t.amount!;
      stats[dayIndex].count += 1;
    });

    return stats.map((s) => ({
      ...s,
      average: s.count ? s.total / s.count : 0,
    }));
  }, [spendingTransactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Day of Week</CardTitle>
        <CardDescription>
          See your average spending patterns across different days of the week
          to identify trends in your spending habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[375px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dayOfWeekStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              angle={-45} // Rotate labels
              textAnchor="end" // Align rotated text
              height={60} // Increase height for rotated labels
              fontSize={12}
            />{" "}
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value.toString())}
            />
            <Bar dataKey="average" fill="#8884d8" name="Average Spending" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
