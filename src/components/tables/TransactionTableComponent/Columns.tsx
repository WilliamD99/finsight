"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Transaction } from "plaid";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transactions = {
  amount: number;
  date: string;
  iso_currency_code: string;
  logo_url: string;
  merchant_name: string;
  name: string;
  payment_channel: string;
  category: string;
};

export const columns: ColumnDef<Partial<Transaction>>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="text-right p-0"
        >
          Date
        </Button>
      );
    },
    cell: ({ row }) => {
      let date = new Date(row.getValue("date"));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;

      return <p>{formatted}</p>;
    },
  },
  {
    accessorKey: "merchant_name",
    header: "Merchant",
    cell: ({ row }) => {
      let logoUrl = row.original.logo_url;
      return (
        <div className="flex flex-row items-center space-x-1">
          <div className="relative h-8 w-8 rounded-md overflow-hidden">
            {logoUrl ? (
              <Image fill src={logoUrl} alt={`${row.original.merchant_name}`} />
            ) : (
              <></>
            )}
          </div>
          <p>{row.getValue("merchant_name") ?? "Unknown"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "payment_channel",
    header: "Payment Channel",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      let catogories: string[] = row.getValue("category") ?? [];
      return (
        <div className="flex flex-row items-center">
          {catogories.join(", ")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="text-right p-0"
        >
          Amount
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const isPositive = amount > 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Math.abs(amount));

      return (
        <div
          className={`text-left font-medium ${
            isPositive ? "text-red-400" : "text-green-400"
          }`}
        >
          {formatted}
        </div>
      );
    },
  },
];
