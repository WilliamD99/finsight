"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";
import useInstitutions from "@/hooks/use-institutions";
import { Skeleton } from "../ui/skeleton";

export default function MainBreadcrumb() {
  const pathname = usePathname();
  const pathNameSplit = pathname.split("/").filter((e) => e !== "");
  const { data, isLoading } = useInstitutions();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathNameSplit.map((path, index) => (
          <React.Fragment key={path}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                className="capitalize"
                href={path === "dashboard" ? "/dashboard" : path}
              >
                {index === 0 && path}
                {index !== 0 && (
                  <>
                    {isLoading ? (
                      <Skeleton className="h-5 w-20" />
                    ) : (
                      <>
                        {
                          data?.institutions.find(
                            (account) => account.institution_id === path
                          )?.name
                        }
                      </>
                    )}
                  </>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== pathNameSplit.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
