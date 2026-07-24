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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HostDashboard() {
  const stats = {
    listings: 8,
    bookings: 14,
    earnings: 48500,
    rating: 4.8,
    reviews: 96,
    occupancy: "82%",
  };

  const recentBookings = [
    {
      id: 1,
      guest: "Rahul Sharma",
      home: "Lake View Villa",
      checkIn: "25 Jul",
      status: "Pending",
    },
    {
      id: 2,
      guest: "Priya Singh",
      home: "Mountain Cottage",
      checkIn: "29 Jul",
      status: "Confirmed",
    },
    {
      id: 3,
      guest: "Amit Kumar",
      home: "City Apartment",
      checkIn: "3 Aug",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome back 👋</h1>

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
            value={stats.listings}
          />

          <StatCard
            icon={<CalendarDays className="text-purple-600" />}
            title="Active Bookings"
            value={stats.bookings}
          />

          <StatCard
            icon={<IndianRupee className="text-green-600" />}
            title="Total Earnings"
            value={`₹${stats.earnings.toLocaleString()}`}
          />

          <StatCard
            icon={<Star className="text-yellow-500" />}
            title="Average Rating"
            value={stats.rating}
          />

          <StatCard
            icon={<MessageSquare className="text-pink-600" />}
            title="Reviews"
            value={stats.reviews}
          />

          <StatCard
            icon={<TrendingUp className="text-emerald-600" />}
            title="Occupancy"
            value={stats.occupancy}
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
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{booking.guest}</h3>

                        <p className="text-sm text-slate-500">{booking.home}</p>

                        <p className="mt-1 text-xs text-slate-400">
                          Check-in: {booking.checkIn}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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

function StatCard({ icon, title, value }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-xl bg-slate-100 p-4">{icon}</div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-3xl font-bold">{value}</h3>
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
