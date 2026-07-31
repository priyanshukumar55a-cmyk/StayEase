import { Skeleton } from "@/components/ui/skeleton";

export default function HomeCardSkeleton({ count = 6 }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Heading */}
      <div className="mb-8 flex flex-col items-center">
        <Skeleton className="h-10 w-96 max-w-full" />
        <Skeleton className="mt-4 h-5 w-80 max-w-full" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md"
          >
            {/* Image */}
            <div className="relative">
              <Skeleton className="h-60 w-full" />

              {/* Rating Badge */}
              <Skeleton className="absolute right-3 top-3 h-8 w-16 rounded-full" />
            </div>

            {/* Content */}
            <div className="space-y-4 p-5">
              {/* Title */}
              <Skeleton className="h-6 w-3/4" />

              {/* Address */}
              <Skeleton className="h-4 w-full" />

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Price */}
              <Skeleton className="h-8 w-28" />

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 flex-1 rounded-xl" />
                <Skeleton className="h-11 flex-1 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
