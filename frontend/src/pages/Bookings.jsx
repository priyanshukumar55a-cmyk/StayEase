import { useEffect, useState } from "react";
import { Loader2, CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cancelBooking, getBookings } from "@/api/bookingApi";
import { formatDateTime } from "@/components/dayFormat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Clock3, XCircle, Ban } from "lucide-react";

const statusStyles = {
  pending: {
    icon: <Clock3 className="h-4 w-4" />,
    className: "bg-yellow-100 text-yellow-700",
    label: "Pending",
  },
  confirmed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: "bg-green-100 text-green-700",
    label: "Confirmed",
  },
  declined: {
    icon: <XCircle className="h-4 w-4" />,
    className: "bg-red-100 text-red-700",
    label: "Declined",
  },
  cancelled: {
    icon: <Ban className="h-4 w-4" />,
    className: "bg-gray-100 text-gray-700",
    label: "Cancelled",
  },
};


export default function Bookings() {
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  
  const fetchBookings = async () => {
    try {
      const bookings = await getBookings();
      setBookings(bookings);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-2xl">Loading bookings...</span>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-blue-600">
          My Bookings
        </h1>

        <p className="text-lg text-slate-600">
          You haven't booked any stays yet.
        </p>
      </div>
    );
  }
  
  const cancelBook = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      
      const updatedBooking = await cancelBooking(bookingId);
      
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
      ? {
        ...booking,
        status: "cancelled",
        cancelledAt: new Date(),
      }
      : booking,
    ),
  );
  
  toast.success("Booking cancelled");
} catch (error) {
  toast.error(error.response?.data?.message || "Failed to cancel booking");
} finally {
  setCancellingId(null);
}
};

return (
  <main className="mx-auto h-full w-full px-4 py-10 ">
      <h1 className="mb-2 text-center text-5xl font-extrabold text-blue-600">
        My Bookings
      </h1>

      <p className="mb-10 text-center text-slate-600">
        Track your booking requests and upcoming stays
      </p>

      <div className="grid gap-8 justify-center">
        {bookings.map((booking) => (
          // const currentStatus = statusStyles[booking.status];
          <div
            key={booking._id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:shadow-xl"
          >
            <div className="grid lg:grid-cols-[400px_1fr] ">
              <img
                src={
                  booking.home?.photo || "https://via.placeholder.com/400x300"
                }
                alt={booking.home?.homeName}
                className="h-full min-h-55 w-full object-cover"
              />

              <div className="p-6">
                <div className="flex justify-between mb-1">
                  <div className="mt-1 text-sm text-slate-500">
                    Booking ID: #{booking._id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-500">
                    Requested on {formatDateTime(booking.createdAt)}
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {booking.home?.homeName}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      {booking.home?.address}
                    </p>
                  </div>
                  <p className="mt-2 text-md text-slate-500">
                    Host: {booking.host.firstName} {booking.host.lastName}
                  </p>
                  {/* {booking.status === "confirmed" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmed
                    </span>
                  )}
                  {booking.status === "confirmed" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmed
                    </span>
                  )}
                  {booking.status === "confirmed" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmed
                    </span>
                  )}
                  {booking.status === "confirmed" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmed
                    </span>
                  )} */}
                </div>
                {booking.status === "pending" && (
                  <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                    <p className="text-sm text-yellow-700">
                      ⏳ Your booking request has been sent to the host. You'll
                      be notified once they accept or decline it.
                    </p>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <>
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmed
                    </span>
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3">
                      <p className="text-sm text-green-700">
                        ✅ Your booking has been confirmed by the host. We hope
                        you enjoy your stay!
                      </p>
                    </div>
                  </>
                )}

                {booking.status === "declined" && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-700">
                      ❌ Unfortunately the host declined your booking request.
                    </p>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-700">
                      This booking was cancelled by you.
                    </p>
                  </div>
                )}
                {booking.status === "confirmed" && (
                  <div className="mt-5 rounded-xl bg-green-50 border border-green-200 p-4">
                    <p className="font-semibold text-green-700">
                      Booking Confirmed 🎉
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      Please arrive on your check-in date.
                    </p>
                  </div>
                )}

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-sm text-slate-500">Check In</p>

                    <div className="mt-1 flex items-center gap-2 font-semibold">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="text-sm text-slate-500">Check Out</p>

                    <div className="mt-1 flex items-center gap-2 font-semibold">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 gap-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Amount</p>

                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{booking.totalPrice}
                    </p>
                  </div>

                  {(booking.status === "pending" ||
                    booking.status === "confirmed") && (
                    <AlertDialog
                      open={selectedBookingId === booking._id}
                      onOpenChange={(isOpen) =>
                        setSelectedBookingId(isOpen ? booking._id : null)
                      }
                    >
                      <AlertDialogTrigger
                        onClick={() => setSelectedBookingId(booking._id)}
                      >
                        {booking.status !== "cancelled" && (
                          <button
                            disabled={cancellingId === booking._id}
                            className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
                          >
                            {cancellingId === booking._id ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Cancelling...</span>
                              </div>
                            ) : (
                              "Cancel Booking"
                            )}
                          </button>
                        )}
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel this booking?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. Your reservation for{" "}
                            <span className="font-semibold text-green-400">
                              {booking.home?.homeName}
                            </span>{" "}
                            will be cancelled.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:cursor-pointer">
                            Keep Booking
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => {
                              cancelBook(booking._id);
                              setSelectedBookingId(null);
                            }}
                            className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                          >
                            Yes, Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {booking.status === "cancelled" && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-600">
                        Cancelled on {formatDateTime(booking.cancelledAt)}
                      </p>
                    </div>
                  )}
                  {/* {booking.status === "declined" && booking.declinedAt && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-600">
                        Declined on {formatDateTime(booking.declinedAt)}
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
