import { Link } from "react-router-dom";
import {
  House,
  CalendarDays,
  IndianRupee,
  Star,
  MessageSquare,
  Plus,
  ArrowRight,
  ClipboardList,
  TrendingUp,
  Loader2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getHostDashboardStats } from "@/api/hostApi";
import { formatDateTime } from "./dayFormat";
import HostDashboardSkeleton from "./skeletons/HostDashboardSkeleton";

export default function HostDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getHostDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <HostDashboardSkeleton/>
    );
  }

  const recentBookings = stats.recentBookings;
  const reviews = stats.reviews;

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    declined: "bg-red-100 text-red-700 border border-red-200",
  };

  if (stats.totalListings === 0) {
    return (
      <div className="flex bg-amber-300 min-h-[91vh] items-center justify-center px-6">
        <Card className="max-w-lg text-center shadow-xl">
          <CardContent className="space-y-5 p-10">
            <House className="mx-auto h-14 w-14 text-blue-600" />

            <h2 className="text-3xl font-bold">Welcome to StayEase Hosting</h2>

            <p className="text-slate-600">
              You haven't listed any properties yet. Create your first listing
              and start receiving booking requests.
            </p>

            <Link to="/host/add-home">
              <Button className="w-full bg-green-400 h-10 hover:cursor-pointer hover:bg-green-500">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, {user.firstName} 👋
              </h1>

              <p className="mt-2 text-blue-100">
                Manage your properties, bookings and earnings from one place.
              </p>
            </div>

            <Link to="/host/add-home">
              <Button className="bg-white text-blue-700 hover:bg-slate-100 hover:cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<House className="text-blue-600" />}
            title="Total Listings"
            value={stats.totalListings}
          />

          <StatCard
            icon={<CalendarDays className="text-purple-600" />}
            title="Total Bookings"
            value={stats.totalBookings}
          />

          <StatCard
            icon={<CalendarDays className="text-purple-600" />}
            title="Pending Requests"
            value={stats.pendingBookings}
            subtitle={
              stats.pendingBookings === 0
                ? "No pending requests"
                : "Waiting for approval"
            }
          />

          <StatCard
            icon={<CalendarDays className="text-purple-600" />}
            title="Cancelled Bookings"
            value={stats.cancelledBookings}
          />

          <StatCard
            icon={<IndianRupee className="text-green-600" />}
            title="Total Earnings"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
          />

          <StatCard
            icon={<Star className="text-yellow-500" />}
            title="Average Rating"
            value={stats.averageRating}
          />

          <StatCard
            icon={<MessageSquare className="text-pink-600" />}
            title="Reviews"
            value={stats.totalReviews}
          />
        </div>

        {/* Quick Actions */}

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold">Quick Actions</h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <QuickCard
              to="/host/add-home"
              icon={<Plus />}
              title="Add Listing"
            />

            <QuickCard to="/host/homes" icon={<House />} title="My Listings" />

            <QuickCard
              to="/host/bookings"
              icon={<ClipboardList />}
              title="Booking Requests"
            />

            <QuickCard
              to="/host/analytics"
              icon={<TrendingUp />}
              title="Analytics"
            />
          </div>
        </div>

        {/* Recent Bookings */}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Booking Requests</h2>

                <Link
                  to="/host/bookings"
                  className="text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="flex h-52 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center">
                    <CalendarDays className="mb-3 h-12 w-12 text-slate-400" />

                    <h3 className="font-semibold text-slate-700">
                      No booking requests yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Booking requests from guests will appear here.
                    </p>
                  </div>
                ) : (
                  recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-xl border p-4 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {booking.home.homeName}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Check-in: {formatDateTime(booking.checkIn)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance */}

          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Reviews</h2>

                <Link
                  to="/host/reviews"
                  className="text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              {reviews.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300">
                  <MessageSquare className="mb-3 h-12 w-12 text-slate-400" />

                  <h3 className="font-semibold">No reviews yet</h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Guest reviews will appear here after completed stays.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-xl border p-4 hover:bg-slate-50 transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex gap-3 items-center">
                            <img
                              src={
                                review.guest.profileImage ||
                                "/default-avatar.png"
                              }
                              alt={review.guest.firstName}
                              className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover border border-blue-300"
                            />
                            <h3 className="font-semibold text-md md:text-xl">
                              {review.guest.firstName} {review.guest.lastName}
                            </h3>
                          </div>

                          <p className="text-sm text-slate-500 mt-2">
                            {review.home.homeName}
                          </p>

                          <p className="mt-2 text-sm text-slate-700 line-clamp-2">
                            "{review.comment}"
                          </p>

                          <p className="mt-2 text-xs text-slate-400">
                            {formatDateTime(review.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold">{review.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Performance */}

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-5 text-xl font-bold">Performance</h2>

              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <TrendingUp className="mx-auto mb-3 h-10 w-10 text-slate-400" />

                  <p className="font-medium text-slate-600">Analytics Chart</p>

                  <p className="text-sm text-slate-400">Add Recharts later</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-xl bg-slate-100 p-4">{icon}</div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickCard({ to, icon, title }) {
  return (
    <Link to={to}>
      <Card className="transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-xl">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <div className="mb-3">{icon}</div>

            <h3 className="font-semibold">{title}</h3>
          </div>

          <ArrowRight />
        </CardContent>
      </Card>
    </Link>
  );
}
