"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type matches the data shape shown in the AccountTable component
export type Account = {
  name: string; // Bank name
  accounts: {
    name: string; // Account name
    type: string;
    account_id: string;
    balances: {
      current: number;
    };
  }[];
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: () => {
      return <p className="text-left text-base text-black p-0">Bank Name</p>;
    },
  },
  {
    accessorKey: "accounts.name",
    header: () => {
      return <p className="text-left text-base text-black p-0">Account Name</p>;
    },
  },
  {
    accessorKey: "accounts.type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="text-right text-base text-black p-0"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("accounts.type")}</div>;
    },
  },
  {
    accessorKey: "accounts.balances.current",
    header: ({ column }) => {
      return <p className="text-right text-base text-black p-0">Balance</p>;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("accounts.balances.current"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
