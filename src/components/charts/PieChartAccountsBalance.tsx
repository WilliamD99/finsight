import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AccountBase } from "plaid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

// A deterministic function to convert a string to a hex color.
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // Generate a simple hash from the string.
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    // Extract 3 components and convert each to hex.
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

export default function PieChartAccountsBalance({
  accounts,
}: {
  accounts: AccountBase[];
}) {
  const searchParams = useSearchParams();
  const initialRange = searchParams.get("range") || "30";

  const chartConfig: ChartConfig = useMemo(() => {
    return accounts.reduce((config, account) => {
      // Only add a config if it doesn't exist already
      if (!config[account.name]) {
        config[account.name] = {
          color: stringToColor(account.name), // deterministic color based on account name
          label: account.name,
        };
      }
      return config;
    }, {} as ChartConfig);
  }, [accounts]);

  return (
    <Card className="flex flex-col shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Balance</CardTitle>
        <CardDescription>
          Data shown from {initialRange} days period
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={accounts} dataKey="balances.current" nameKey="name">
              {accounts.map((account, index) => {
                // Retrieve the color from our dynamically built chartConfig.
                const fillColor = chartConfig[account.name]?.color || "#FF8042";
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
