import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  hasSelect?: boolean;
  doubleSelect?: boolean;
  titleWidth?: string;
  descriptionWidth?: string;
}

export function ChartSkeleton({
  hasSelect = false,
  doubleSelect = false,
  titleWidth = "w-32",
  descriptionWidth = "w-64",
}: ChartSkeletonProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="space-y-2">
        <div className="flex flex-row items-center justify-between">
          <Skeleton className={`h-6 ${titleWidth}`} />
          {hasSelect &&
            (doubleSelect ? (
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            ) : (
              <Skeleton className="h-9 w-[100px]" />
            ))}
        </div>
        <Skeleton className={`h-4 ${descriptionWidth}`} />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}
