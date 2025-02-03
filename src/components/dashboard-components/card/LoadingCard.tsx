import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingCard() {
  return (
    <Card className="w-full h-36">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-14" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-36" />
        </CardDescription>
        <CardContent className="p-0 pt-5">
          <Skeleton className="h-5 w-14" />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
