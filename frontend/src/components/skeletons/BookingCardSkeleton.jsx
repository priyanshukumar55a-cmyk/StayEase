import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const BookingCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Property Image */}
          <Skeleton className="h-62 md:h-76 w-full rounded-xl lg:h-44 lg:w-64" />

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-72" />
              </div>

              <Skeleton className="h-9 w-24 rounded-full" />
            </div>

            {/* Guest */}
            <div className="mt-6 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full md:h-14 md:w-14" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            {/* Dates */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-xl bg-slate-100 p-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-2 h-5 w-24" />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-11 w-28 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCardSkeleton;
