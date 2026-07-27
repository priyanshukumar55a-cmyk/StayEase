import { useEffect, useState } from "react";
import {
  CalendarDays,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getHostBookings } from "@/api/hostApi";
import BookingsCards from "@/components/BookingsCards";

export default function HostBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings(statusFilter);
  }, [statusFilter]);

  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  const fetchBookings = async (status) => {
    try {
      const data = await getHostBookings(status);

      setBookings(data.bookings);

      setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const filterButtons = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "confirmed",
      label: "Confirmed",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Hero */}

      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <button
          onClick={() => navigate(-1)}
          className="absolute p-2 bg-white rounded-xl hover:cursor-pointer left-2 md:top-1/6 top-1/12 -translate-y-1/2 "
        >
          <ArrowLeft />
        </button>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Booking Requests
              </h1>

              <p className="mt-2 text-blue-100">
                Review and manage booking requests from your guests.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-6 py-4 text-center backdrop-blur">
              <p className="text-sm text-blue-100">Pending Requests</p>

              <h2 className="text-4xl font-bold text-white">{stats.pending}</h2>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}

        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock3 className="text-yellow-600" />}
            bg="bg-yellow-50"
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon={<CheckCircle2 className="text-green-600" />}
            bg="bg-green-50"
          />

          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={<XCircle className="text-red-600" />}
            bg="bg-red-50"
          />
        </div>

        {/* Search + Filters */}

        <div className="mt-8 rounded-2xl bg-white p-5 shadow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}

            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search guest or property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-11"
              />
            </div>

            {/* Filters */}

            <div className="flex flex-wrap gap-3">
              {filterButtons.map((button) => (
                <button
                  key={button.value}
                  onClick={() => setStatusFilter(button.value)}
                  className={`rounded-full px-5 py-2 font-medium transition hover:cursor-pointer
                    ${
                      statusFilter === button.value
                        ? "bg-blue-600 text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Cards */}
        <BookingsCards bookings={bookings} statusFilter={statusFilter} />
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className={`rounded-xl p-4 ${bg}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}
