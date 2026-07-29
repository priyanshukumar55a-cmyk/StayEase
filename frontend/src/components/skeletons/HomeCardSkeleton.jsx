import { Skeleton } from "@/components/ui/skeleton";

export default function HomeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Map Button */}
      <div className="flex gap-2 bg-gray-100 p-2">
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        {/* Home Name */}
        <Skeleton className="h-6 w-3/4" />

        {/* Address */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        {/* Rating */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Buttons */}
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
