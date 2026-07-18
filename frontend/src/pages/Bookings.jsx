import { CalendarDays } from "lucide-react";

export default function Bookings() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6">
      <div className="text-center">
        <CalendarDays className="mx-auto mb-6 h-20 w-20 text-blue-600" />

        <h1 className="mb-4 text-5xl font-extrabold tracking-wide text-blue-600 md:text-7xl">
          My Bookings
        </h1>

        <p className="text-lg text-slate-600 md:text-xl">
          Your upcoming bookings will appear here
        </p>
      </div>
    </div>
  );
}
