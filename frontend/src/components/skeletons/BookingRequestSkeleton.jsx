import { Skeleton } from "@/components/ui/skeleton";

export default function BookingRequestSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center">
          <Skeleton className="mb-4 h-14 w-14 rounded-full" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-3 h-4 w-80" />
        </div>

        {/* Property Card */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border bg-slate-50 p-4 sm:flex-row sm:items-center">
          <Skeleton className="h-48 w-full rounded-xl sm:h-28 sm:w-36" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-40" />

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-4 w-52" />

            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        {/* Check-in */}
        <div className="mb-5 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Check-out */}
        <div className="mb-5 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Booking Summary */}
        <div className="mb-5 space-y-3 rounded-2xl bg-slate-100 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}

          <div className="flex justify-between border-t pt-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <Skeleton className="mb-3 h-5 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>

        {/* Button */}
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
