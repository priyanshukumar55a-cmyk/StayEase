import React from "react";
import { Skeleton } from "../ui/skeleton";

export const MyBookingsSkeleton = () => {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Heading */}
        <div className="flex flex-col items-center">
          <Skeleton className="h-12 w-80 rounded-lg" />
          <Skeleton className="mt-4 h-5 w-96 rounded-lg" />
        </div>

        <div className="mt-10 space-y-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="grid lg:grid-cols-[400px_1fr]">
                {/* Image */}
                <Skeleton className="min-h-72 w-full rounded-none" />

                {/* Content */}
                <div className="p-6">
                  {/* Booking ID + Date */}
                  <div className="mb-5 flex items-center justify-between">
                    <Skeleton className="h-7 w-36 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  {/* Home Name */}
                  <Skeleton className="h-8 w-64" />

                  {/* Address */}
                  <Skeleton className="mt-3 h-5 w-80" />

                  {/* Host */}
                  <Skeleton className="mt-4 h-5 w-44" />

                  {/* Status */}
                  <Skeleton className="mt-5 h-9 w-36 rounded-full" />

                  {/* Status Message */}
                  <Skeleton className="mt-5 h-20 w-full rounded-xl" />

                  {/* Check In / Out */}
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border p-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="mt-3 h-5 w-32" />
                    </div>

                    <div className="rounded-2xl border p-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="mt-3 h-5 w-32" />
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="rounded-2xl border p-4">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="mt-3 h-8 w-32" />
                    </div>

                    <Skeleton className="h-14 w-44 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
