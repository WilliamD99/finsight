import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

import { ReplaceIcon } from "lucide-react";
export default function Spending({
  id,
  openDialog,
}: {
  id: string;
  openDialog: (id: string) => void;
}) {
  return (
    <Card className="w-full h-36">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle onClick={() => console.log("test")}>Spending</CardTitle>

          <button
            className="hover:bg-sidebar-accent p-2 rounded-md"
            onClick={() => openDialog(id)}
          >
            <ReplaceIcon className="size-5" />
          </button>
        </div>
        <CardDescription className="text-sm">
          What you spend the most on.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="font-medium text-lg">$1,000.00</p>
      </CardContent>
    </Card>
  );
}
