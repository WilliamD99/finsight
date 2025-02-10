"use client";

import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tables } from "@/types/supabase";

const chartConfig = {
  outflow: {
    color: "hsl(var(--chart-1))",
  },
  inflow: {
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface GroupedTransaction {
  range: string;
  outflow: number;
  inflow: number;
}

function groupTransactionsByDate(
  transactions: Tables<"Transactions">[]
): GroupedTransaction[] {
  const grouped = new Map<string, { outflow: number; inflow: number }>();

  for (const { date, amount } of transactions) {
    if (!date || amount === undefined) continue;
    const formattedDate = date.split("T")[0]; // Extract YYYY-MM-DD

    if (!grouped.has(formattedDate)) {
      grouped.set(formattedDate, { outflow: 0, inflow: 0 });
    }

    const entry = grouped.get(formattedDate)!;
    if (amount! >= 0) {
      entry.outflow += amount!;
    } else {
      entry.inflow += amount!;
    }
  }

  // Convert to sorted array
  return Array.from(grouped.entries())
    .map(([range, { outflow, inflow }]) => ({ range, outflow, inflow }))
    .sort((a, b) => new Date(a.range).getTime() - new Date(b.range).getTime());
}

function aggregateChunks(
  groupedTransactions: GroupedTransaction[],
  days: string
): GroupedTransaction[] {
  let parsedDay = parseInt(days);
  if (parsedDay <= 1) return groupedTransactions; // If parts = 1, return daily aggregation

  const result: GroupedTransaction[] = [];
  let currentChunk: GroupedTransaction | null = null;
  let startDate: Date | null = null;

  for (const transaction of groupedTransactions) {
    const transactionDate = new Date(transaction.range);

    if (
      !currentChunk ||
      !startDate ||
      (transactionDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24) >=
        parsedDay
    ) {
      if (currentChunk) result.push(currentChunk);
      currentChunk = { range: transaction.range, outflow: 0, inflow: 0 };
      startDate = transactionDate;
    }

    currentChunk.outflow += transaction.outflow;
    currentChunk.inflow += transaction.inflow;
  }

  if (currentChunk) result.push(currentChunk); // Push last chunk
  return result;
}

export default function NetFlowChart({
  data,
}: {
  data: Tables<"Transactions">[] | [];
}) {
  const [filterOption, setFilterOption] = useState<string>("1");

  // Memoize computed values to prevent unnecessary renders
  const grouped = useMemo(() => {
    const groupedData = groupTransactionsByDate(data);
    return aggregateChunks(groupedData, filterOption);
  }, [data, filterOption]);

  return (
    <Card id="netflow" className="shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="flex flex-row items-center justify-between">
          <p>Inflow - Outflow</p>
          <Select onValueChange={(e: string) => setFilterOption(e)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Daily" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value={"1"}>
                Daily
              </SelectItem>
              <SelectItem
                className="cursor-pointer"
                disabled={data.length < 7}
                value={"7"}
              >
                7 days period
              </SelectItem>
              <SelectItem
                className="cursor-pointer"
                disabled={data.length < 30}
                value={"30"}
              >
                30 days period
              </SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
        <CardDescription>
          Comparision between your net inflow and outflow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={grouped}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="outflow" fill="var(--color-outflow)" radius={4} />
            <Bar dataKey="inflow" fill="var(--color-inflow)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
