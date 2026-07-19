import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bookHome } from "@/api/homeApi";

export default function BookHome() {
  const { homeId } = useParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (new Date(checkOut) <= new Date(checkIn)) {
      return toast.error("Check-out date must be after check-in date");
    }

    try {
      setLoading(true);

      await bookHome(homeId, {
        checkIn,
        checkOut,
      });

      toast.success("Booking confirmed 🎉");

      setTimeout(() => {
        navigate("/bookings");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <CalendarDays className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">Book Your Stay</h1>

          <p className="mt-2 text-slate-500">
            Select your dates and confirm your booking
          </p>
        </div>

        <form onSubmit={handleBooking} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Check-in Date
            </label>

            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Check-out Date
            </label>

            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {checkIn && checkOut && (
            <div className="rounded-2xl bg-slate-100 p-4 text-center">
              <p className="text-sm text-slate-600">Total Nights</p>

              <p className="text-2xl font-bold text-blue-600">
                {calculateNights()}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl 
            disabled:cursor-not-allowed disabled:opacity-70 hover:cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Booking...</span>
              </div>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
