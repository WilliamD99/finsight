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
      return (
        <div className="text-left font-semibold text-muted-foreground">
          Bank Name
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-foreground">
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "accounts.name",
    header: () => {
      return (
        <div className="text-left font-semibold text-muted-foreground">
          Account Name
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-foreground">
          {row.getValue("accounts.name")}
        </div>
      );
    },
  },
  {
    accessorKey: "accounts.type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium capitalize text-foreground">
          {row.getValue("accounts.type")}
        </div>
      );
    },
  },
  {
    accessorKey: "accounts.balances.current",
    header: ({ column }) => {
      return (
        <div className="text-right font-semibold text-muted-foreground">
          Balance
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("accounts.balances.current"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className="text-right font-semibold text-foreground">
          {formatted}
        </div>
      );
    },
  },
];
