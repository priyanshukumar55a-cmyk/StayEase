import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ReviewSkeleton = () => {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-3 h-4 w-40" />
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <Skeleton className="h-6 w-16" />
                <Skeleton className="mt-3 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-10 w-full sm:w-96 rounded-md" />

          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <ReviewSke key={i} />
          ))}
        </div>
      </main>
    );
}

function ReviewSke({key}){
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="w-full">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Property */}
            <Skeleton className="mt-4 h-4 w-56" />

            {/* Rating */}
            <div className="mt-4 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}

              <Skeleton className="ml-2 h-4 w-6" />
            </div>

            {/* Review */}
            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[70%]" />
            </div>

            {/* Date */}
            <Skeleton className="mt-5 h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSkeleton;
