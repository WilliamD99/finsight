import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionTableSkeletonProps {
  rowCount?: number;
}

export function TransactionTableSkeleton({
  rowCount = 5,
}: TransactionTableSkeletonProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(rowCount)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
