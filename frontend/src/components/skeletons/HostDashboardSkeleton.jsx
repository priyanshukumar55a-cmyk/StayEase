import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HostDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-10 w-72 bg-white/30" />
              <Skeleton className="h-5 w-96 bg-white/20" />
            </div>

            <Skeleton className="h-11 w-44 rounded-lg bg-white/30" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-6">
                <Skeleton className="h-14 w-14 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <Skeleton className="mb-5 h-8 w-48" />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-5 w-28" />
                  </div>

                  <Skeleton className="h-6 w-6 rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border p-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-3 w-32" />
                      </div>

                      <Skeleton className="h-7 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl border p-4">
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />

                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-64" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>

                      <Skeleton className="h-8 w-14 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-5 h-7 w-36" />

              <Skeleton className="h-64 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
