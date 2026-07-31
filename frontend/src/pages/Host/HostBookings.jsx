import { useCallback, useEffect, useState } from "react";
import { Search, Clock3, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getHostBookings, updateBookingRequest } from "@/api/hostApi";
import BookingsCards from "@/components/BookingsCards";
import BookingCardSkeleton from "@/components/skeletons/BookingCardSkeleton";
import { toast } from "sonner";

const FILTERS = [
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
  {
    value: "declined",
    label: "Declined",
  },
];

export default function HostBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bookings | StayEase";
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchBookings(statusFilter, debouncedSearch);
  }, [statusFilter, debouncedSearch]);

  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    declined: 0,
  });

  const fetchBookings = useCallback(async (status, search) => {
    setLoading(true);
    try {
      const data = await getHostBookings(status, search);

      setBookings(data.bookings);

      setStats(data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterButtons = FILTERS.map((filter) => ({
    ...filter,
    count:
      filter.value === "all"
        ? stats["pending"] +
          stats["confirmed"] +
          stats["cancelled"] +
          stats["declined"]
        : (stats[filter.value] ?? 0),
  }));

  const handleBookingStatus = async (bookingId, status) => {
    setLoading(true);
    try {
      await updateBookingRequest(bookingId, status);

      toast.success(
        status === "confirmed"
          ? "Booking accepted successfully."
          : "Booking rejected successfully.",
      );

      fetchBookings(statusFilter, debouncedSearch);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Hero */}

      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <button
          onClick={() => navigate(-1)}
          className="absolute p-2 text-white sm:text-black sm:bg-white rounded-xl hover:cursor-pointer left-2 md:top-1/6 top-1/12 -translate-y-1/2 "
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

          <StatCard
            title="Declined"
            value={stats.declined}
            icon={<XCircle className="text-red-600" />}
            bg="bg-red-50"
          />
        </div>

        {/* Search + Filters */}

        <div className="mt-8 rounded-2xl bg-white p-5 shadow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/3 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <Input
                placeholder="Search guest name or property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-11"
              />
              {/* Search Result Count */}
              <div className="mt-1.5 flex items-center text-sm text-slate-500">
                Showing {bookings.length} booking{bookings.length !== 1 && "s"}
                {search.trim() && ` for "${search}"`}
              </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto pb-2 justify-start gap-3 lg:justify-end">
              {filterButtons.map((button) => (
                <button
                  key={button.value}
                  disabled={loading}
                  onClick={() => setStatusFilter(button.value)}
                  className={`rounded-full px-4 py-1.5 sm:px-5 sm:py-2 font-heading sm:font-medium transition hover:cursor-pointer
            ${
              statusFilter === button.value
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
                >
                  {button.label} ({button.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Cards */}
        {loading ? (
          <div className="mt-8 space-y-6">
            {[...Array(5)].map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <BookingsCards
            bookings={bookings}
            statusFilter={statusFilter}
            onStatusChange={handleBookingStatus}
          />
        )}
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
