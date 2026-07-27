import React from "react";
import { Card, CardContent } from "./ui/card";
import { CalendarDays } from "lucide-react";

const BookingsCards = ({ bookings, statusFilter }) => {
  return (
    <div className="mt-8 space-y-6">
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="mb-4 h-12 w-12 text-slate-400" />

            <h3 className="text-xl font-semibold text-slate-700">
              No booking requests
            </h3>

            <p className="mt-2 text-slate-500">
              There are no {statusFilter !== "all" ? statusFilter : ""} booking
              requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        bookings.map((booking) => (
          <Card
            key={booking._id}
            className="transition hover:-translate-y-1 hover:shadow-xl"
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Property Image */}

                <img
                  src={booking.home.photo}
                  alt={booking.home.homeName}
                  className="h-52 w-full rounded-xl object-cover lg:h-44 lg:w-64"
                />

                {/* Details */}

                <div className="flex-1">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {booking.home.homeName}
                      </h2>

                      <p className="mt-2 text-slate-500">
                        {booking.home.address}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize
                    ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Guest */}

                  <div className="mt-6 flex items-center gap-4">
                    <img
                      src={booking.guest.profileImage || "/default-avatar.png"}
                      className="h-14 w-14 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-semibold">
                        {booking.guest.firstName} {booking.guest.lastName}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {booking.guest.email}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <InfoBox
                      title="Check In"
                      value={new Date(booking.checkIn).toLocaleDateString()}
                    />

                    <InfoBox
                      title="Check Out"
                      value={new Date(booking.checkOut).toLocaleDateString()}
                    />

                    <InfoBox title="Amount" value={`₹${booking.totalPrice}`} />
                  </div>

                  {/* Actions */}

                  {booking.status === "pending" && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-xl bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700">
                        Accept
                      </button>

                      <button className="rounded-xl bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700">
                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === "confirmed" && (
                    <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 font-medium text-green-700">
                      ✓ This booking has been accepted.
                    </div>
                  )}

                  {booking.status === "cancelled" && (
                    <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700">
                      ✕ This booking has been cancelled.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default BookingsCards;

function InfoBox({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-100 p-4">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}