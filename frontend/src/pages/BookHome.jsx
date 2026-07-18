import { useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function BookHome() {
  const { homeId } = useParams();

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log({
        homeId,
        checkin,
        checkout,
      });

      // API call here
      // await bookHome(homeId, { checkin, checkout });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <CalendarDays className="mx-auto mb-4 h-16 w-16 text-blue-600" />

          <h1 className="mb-3 text-4xl font-extrabold tracking-wide text-blue-600 md:text-6xl">
            Book Your Stay
          </h1>

          <p className="text-lg text-slate-600">
            Select your dates and confirm your booking
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-xl"
        >
          <div className="mb-5">
            <label
              htmlFor="checkin"
              className="mb-2 block font-semibold text-slate-700"
            >
              Check-in Date
            </label>

            <input
              id="checkin"
              type="date"
              required
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="checkout"
              className="mb-2 block font-semibold text-slate-700"
            >
              Check-out Date
            </label>

            <input
              id="checkout"
              type="date"
              required
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
