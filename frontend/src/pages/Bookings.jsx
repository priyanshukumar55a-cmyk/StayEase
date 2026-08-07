import { useEffect, useState } from "react";
import { Loader2, CalendarDays, MapPin, Home } from "lucide-react";
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
import { MyBookingsSkeleton } from "@/components/skeletons/MyBookingsSkeleton";

const statusStyles = {
  pending: {
    icon: <Clock3 className="h-4 w-4" />,
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-200/15 dark:text-yellow-300",
    label: "Pending",
  },
  confirmed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    className:
      "bg-green-100 text-green-700 dark:bg-emerald-200/15 dark:text-emerald-300",
    label: "Confirmed",
  },
  ongoing: {
    icon: <Home className="h-4 w-4" />,
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-200/15 dark:text-blue-300",
    label: "Ongoing",
  },
  cancelled: {
    icon: <Ban className="h-4 w-4" />,
    className:
      "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200",
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
    return <MyBookingsSkeleton />;
  }

  if (bookings.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-5xl font-extrabold text-blue-600">
          My Bookings
        </h1>

        <p className="text-lg text-muted-foreground">
          You haven't booked any stays yet.
        </p>
      </div>
    );
  }

  const cancelBook = async (bookingId) => {
    try {
      setCancellingId(bookingId);

      const updatedBooking = await cancelBooking(bookingId);

      setBookings((prevBookings) =>
        prevBookings.map((item) =>
          item._id === bookingId
            ? {
                ...item,
                ...updatedBooking.booking,
                bookingStage: item.bookingStage,
                canCancel: false,
              }
            : item,
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
    <main className="min-h-screen bg-background py-7 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-2 text-center text-5xl font-extrabold text-blue-600">
          My Bookings
        </h1>

        <p className="mb-10 text-center text-muted-foreground">
          Track your booking requests and upcoming stays
        </p>

        <div className="space-y-8 justify-center">
          {bookings.map((booking) => {
            const normalizedStatus = booking.status || "confirmed";
            const currentStatus =
              booking.bookingStage === "completed"
                ? {
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    className:
                      "bg-green-100 text-green-700 dark:bg-emerald-200/15 dark:text-emerald-300",
                    label: "Completed",
                  }
                : booking.bookingStage === "ongoing"
                  ? statusStyles.ongoing
                  : statusStyles[normalizedStatus] || statusStyles.confirmed;

            return (
              <div
                key={booking._id}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-md transition hover:shadow-xl w-full"
              >
                <div className="grid lg:grid-cols-[400px_1fr] ">
                  <div className="overflow-hidden">
                    <img
                      src={
                        booking.home?.photo ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={booking.home?.homeName}
                      className="h-full min-h-60 w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="p-3 sm:p-6">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        Booking #{booking._id.slice(-8).toUpperCase()}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        Booked on {formatDateTime(booking.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-card-foreground">
                          {booking.home?.homeName}
                        </h2>

                        <p className="my-1 flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {booking.home?.address}
                        </p>
                      </div>
                      <p className="text-md text-slate-500">
                        Hosted by: {booking.host?.firstName}{" "}
                        {booking.host?.lastName}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${currentStatus.className}`}
                    >
                      {currentStatus.icon}
                      {currentStatus.label}
                    </span>

                    {normalizedStatus === "pending" && (
                      <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-200/20 dark:bg-yellow-200/10">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          ⏳ Your booking is under review. It will be confirmed
                          automatically.
                        </p>
                      </div>
                    )}

                    {normalizedStatus === "cancelled" && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-200/20 dark:bg-red-200/10">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          This booking was cancelled by you.
                        </p>
                      </div>
                    )}
                    {booking.bookingStage === "upcoming" && (
                      <div className="mt-5 rounded-xl bg-green-50 border border-green-200 p-4 dark:border-green-200/20 dark:bg-green-200/10">
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          Booking Confirmed 🎉
                        </p>

                        <p className="text-sm text-muted-foreground mt-1">
                          Please arrive on your check-in date.
                        </p>
                      </div>
                    )}
                    {booking.bookingStage === "ongoing" && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5 mt-3 dark:border-blue-200/20 dark:bg-blue-200/10">
                        <p className="font-semibold text-blue-700 dark:text-blue-300">
                          Enjoy your stay! 🏡
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          We hope you're having a wonderful experience.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-muted p-4 transition hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-200/20 dark:hover:bg-blue-200/10">
                        <p className="text-sm text-muted-foreground">
                          Check In
                        </p>

                        <div className="mt-1 flex items-center gap-2 font-semibold">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-muted p-4 transition hover:border-blue-200 hover:bg-blue-50 dark:hover:border-blue-200/20 dark:hover:bg-blue-200/10">
                        <p className="text-sm text-muted-foreground">
                          Check Out
                        </p>

                        <div className="mt-1 flex items-center gap-2 font-semibold">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 gap-2 flex items-center justify-between">
                      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-3 dark:border-emerald-200/20 dark:bg-emerald-200/10">
                        <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                          Total Amount
                        </p>

                        <p className="mt-1 text-3xl font-bold text-emerald-700 dark:text-emerald-200">
                          ₹{booking.totalPrice}
                        </p>
                      </div>

                      {booking.bookingStage === "completed" ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-emerald-200/20 dark:bg-emerald-200/10">
                          <p className="font-semibold text-green-700 dark:text-emerald-300">
                            Stay Completed ✓
                          </p>

                          <p className="text-sm text-muted-foreground">
                            We hope you enjoyed your stay.
                          </p>
                        </div>
                      ) : (
                        booking.canCancel && (
                          <AlertDialog
                            open={selectedBookingId === booking._id}
                            onOpenChange={(isOpen) =>
                              setSelectedBookingId(isOpen ? booking._id : null)
                            }
                          >
                            <AlertDialogTrigger
                              onClick={() => setSelectedBookingId(booking._id)}
                            >
                              {normalizedStatus !== "cancelled" && (
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

                            <AlertDialogContent className="sm:max-w-md rounded-2xl bg-card text-card-foreground">
                              <AlertDialogHeader>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-200/15">
                                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
                                </div>

                                <AlertDialogTitle className="text-center text-2xl text-card-foreground">
                                  Cancel Booking?
                                </AlertDialogTitle>

                                <AlertDialogDescription className="text-center leading-6 text-muted-foreground">
                                  You're about to cancel your reservation for
                                  <span className="mt-2 block font-semibold text-card-foreground">
                                    {booking.home.homeName}
                                  </span>
                                  <span className="mt-3 block text-red-500 dark:text-red-300">
                                    Your booking will be cancelled immediately.
                                  </span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel
                                  className={"hover:cursor-pointer"}
                                >
                                  Keep Booking
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() => {
                                    cancelBook(booking._id);
                                    setSelectedBookingId(null);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 hover:cursor-pointer"
                                >
                                  Yes, Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )
                      )}

                      {normalizedStatus === "cancelled" && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-200/20 dark:bg-red-200/10">
                          <p className="text-sm font-medium text-red-600 dark:text-red-300">
                            Cancelled on {formatDateTime(booking.cancelledAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
