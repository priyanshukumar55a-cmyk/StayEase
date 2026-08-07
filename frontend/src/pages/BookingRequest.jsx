import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { getHomeDetails } from "@/api/homeApi";
import { formatDate } from "@/components/dayFormat";
import BookingRequestSkeleton from "@/components/skeletons/BookingRequestSkeleton";
import { createOrder, verifyPayment } from "@/api/paymentApi";
import { loadRazorpay } from "@/utils/loadRazorpay";

export default function BookingRequest() {
  const { homeId } = useParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [home, setHome] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const data = await getHomeDetails(homeId);
      setHome(data);
    } catch (err) {
      toast.error("Failed to load property details");
      console.error(err);
    } finally {
      setHomeLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };
  const calculateTotal = (price, nights) => {
    if (!checkIn || !checkOut) return 0;

    return price * nights;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (new Date(checkOut) <= new Date(checkIn)) {
      return toast.error("Check-out date must be after check-in date");
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Unable to load payment gateway.");
        return;
      }

      const order = await createOrder({
        homeId,
        checkIn,
        checkOut,
      });

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,

        name: "StayEase",

        description: "Home Booking",

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              homeId,
              checkIn,
              checkOut,
            });

            toast.success("Booking confirmed! Check your email for details.");
            navigate("/bookings")
          } catch (error) {
            console.log(error);
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: "Guest",
          email: "",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
          },
        },
      };
      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.log(response.error);
        toast.error("Payment Failed");
      });

      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  if (homeLoading) {
    return <BookingRequestSkeleton />;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-3 py-10 bg-background sm:py-20">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-3 sm:p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mt-2">
            <CalendarDays className="h-7 w-7 text-blue-600 " />
          </div>

          <h1 className="text-3xl font-bold text-card-foreground">
            Book Your Stay
          </h1>

          <p className="mt-2 text-muted-foreground">
            Choose your stay dates and confirm your free booking instantly.
          </p>
        </div>
        {home && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-muted p-2 sm:flex-row sm:items-center">
            <img
              src={home.photo || "/default-home.jpg"}
              alt={home.homeName}
              className="h-48 w-full rounded-xl object-cover sm:h-28 sm:w-36 p-0"
            />

            <div className="flex-1 ml-2">
              <h2 className="text-xl font-bold">{home.homeName}</h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {home.averageRating?.toFixed(1) || "New"}

                <span>({home.reviewCount || 0} reviews)</span>
              </div>

              <p className="mt-2 text-sm text-slate-500">📍 {home.address}</p>

              <p className="mt-2 text-lg font-semibold text-emerald-600">
                ₹{home.price} / night
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Check-in Date
            </label>

            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
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
            <div className="space-y-2 rounded-2xl bg-muted p-4">
              <div className="flex justify-between">
                <span>Check-in</span>
                <span className="font-medium">{formatDate(checkIn)}</span>
              </div>

              <div className="flex justify-between">
                <span>Check-out</span>
                <span className="font-medium">{formatDate(checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per night</span>
                <span>₹{home.price}</span>
              </div>

              <div className="flex justify-between">
                <span>Nights</span>
                <span>{calculateNights()}</span>
              </div>

              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  ₹
                  {calculateTotal(
                    home.price,
                    calculateNights(),
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-700">What happens next?</h3>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm dark:text-muted">
              <li>
                Your stay is booked instantly and confirmed automatically.
              </li>
              <li>The total booking cost is free for guests.</li>
              <li>You can cancel up to 24 hours before check-in.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">
              Cancellation policies may vary depending on the property. Please
              review the listing details before sending your request.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              loading || !checkIn || !checkOut || calculateNights() === 0
            }
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl 
            disabled:cursor-not-allowed disabled:opacity-70 hover:cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Confirming Booking...</span>
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
