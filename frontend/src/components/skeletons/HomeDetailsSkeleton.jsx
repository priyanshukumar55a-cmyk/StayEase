import { Skeleton } from "@/components/ui/skeleton";

export default function HomeDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 space-y-3">
          <Skeleton className="h-10 w-80" />

          <div className="flex gap-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-56" />
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 overflow-hidden rounded-3xl">
          <Skeleton className="h-[400px] md:h-[580px] w-full" />

          <Skeleton className="absolute right-4 top-4 h-12 w-12 rounded-full" />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Description */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-5 h-8 w-48" />

              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </section>

            {/* Amenities */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-5 h-8 w-40" />

              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            </section>

            {/* Map */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <Skeleton className="mb-5 h-8 w-32" />

              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </section>

            {/* Reviews */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>

              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>

                    <div className="mt-3 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} className="h-5 w-5 rounded-full" />
                      ))}
                    </div>

                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-xl">
              <Skeleton className="mb-6 h-10 w-36" />

              <Skeleton className="mb-3 h-12 w-full rounded-xl" />

              <Skeleton className="h-12 w-full rounded-xl" />

              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />

                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
