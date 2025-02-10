"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
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
import { Tables } from "@/types/supabase";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  total_amount: {
    label: "Amount: ",
    color: "hsl(var(--chart-1))",
  },
  transaction_count: {
    label: "Transaction number: ",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function groupTransactionsByMerchant(transactions: Tables<"Transactions">[]): {
  merchant_name: string;
  total_amount: number;
  transaction_count: number;
}[] {
  const grouped = new Map<
    string,
    { total_amount: number; transaction_count: number }
  >();

  for (const { merchant_name, amount } of transactions) {
    if (!merchant_name || amount === undefined || amount! < 0) continue; // Exclude negative amounts

    if (!grouped.has(merchant_name)) {
      grouped.set(merchant_name, { total_amount: 0, transaction_count: 0 });
    }

    const entry = grouped.get(merchant_name)!;
    entry.total_amount += amount!;
    entry.transaction_count += 1;
  }

  return Array.from(grouped.entries()).map(([merchant_name, data]) => ({
    merchant_name,
    ...data,
  }));
}

export default function BarChartTopMerchant({
  data,
}: {
  data: Tables<"Transactions">[] | [];
}) {
  const [filterOption, setFilterOption] = useState<string>("amount");
  const [range, setRange] = useState<number>(3);

  const grouped = useMemo(() => {
    const groupedData = groupTransactionsByMerchant(data);
    const sortedData =
      filterOption === "amount"
        ? groupedData.sort((a, b) => b.total_amount - a.total_amount)
        : groupedData.sort((a, b) => b.transaction_count - a.transaction_count);
    return sortedData.slice(0, range);
  }, [data, range, filterOption]);

  return (
    <Card id="top-merchants" className="shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <p>Top {range} Merchants</p>
          <div className="flex flex-row items-center space-x-2">
            <Select onValueChange={setFilterOption}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Total Amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value={"amount"}>
                  By total amount
                </SelectItem>
                <SelectItem className="cursor-pointer" value={"transactions"}>
                  By number of transactions
                </SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(e: string) => setRange(parseInt(e))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Top 3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value={"3"}>
                  Top 3
                </SelectItem>
                <SelectItem className="cursor-pointer" value={"5"}>
                  Top 5
                </SelectItem>
                <SelectItem className="cursor-pointer" value={"10"}>
                  Top 10
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        <CardDescription>Where you spend the most on.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={grouped}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <CartesianGrid horizontal={false} />
            {filterOption === "amount" ? (
              <XAxis type="number" dataKey="total_amount" hide />
            ) : (
              <XAxis type="number" dataKey="transaction_count" hide />
            )}
            <YAxis
              dataKey="merchant_name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {filterOption === "amount" ? (
              <Bar
                dataKey="total_amount"
                fill="var(--color-total_amount)"
                radius={3}
              >
                <LabelList
                  dataKey="merchant_name"
                  position="insideLeft"
                  offset={25}
                  className="fill-[--color-label]"
                  fontSize={12}
                  fontWeight={"bold"}
                />
              </Bar>
            ) : (
              <Bar
                dataKey="transaction_count"
                fill="var(--color-total_amount)"
                radius={3}
              >
                <LabelList
                  dataKey="merchant_name"
                  position="insideLeft"
                  offset={25}
                  className="fill-[--color-label]"
                  fontSize={12}
                  fontWeight={"bold"}
                />
              </Bar>
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
