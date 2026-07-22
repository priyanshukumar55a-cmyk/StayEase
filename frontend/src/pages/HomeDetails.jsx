import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addHomeToFavourites, getHomeDetails, removeFavourite } from "@/api/homeApi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { Loader2, Star, Heart, MapPin, User } from "lucide-react";
import { toast } from "sonner";

export default function HomeDetails() {
  const { homeId } = useParams();

  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    fetchHome();
  }, [homeId]);

  const fetchHome = async () => {
    try {
      const home = await getHomeDetails(homeId);
      setHome(home);
      setIsFavourite(home?.isFavourite)
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavourite = async() => {
    try {
      setLoading(true)
      if (isFavourite) {
        await removeFavourite(homeId);
        setIsFavourite(false)
        toast.success("Removed from wishlist")
      } else {
        await addHomeToFavourites(homeId)
        setIsFavourite(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }
  }

  if (!home) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-2xl">Loading...</span>
      </div>
    );
  }

  const lat = home?.location?.coordinates?.[1];
  const lng = home?.location?.coordinates?.[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">
            {home.homeName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {home.averageRating?.toFixed(1) || "New"}
              </span>

              <span className="text-slate-500">
                ({home.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="h-4 w-4" />
              {home.address}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 overflow-hidden rounded-3xl shadow-xl">
          <img
            src={home.photo}
            alt={home.homeName}
            className="h-[500px] w-full object-cover"
          />

          <button
            onClick={handleFavourite}
            className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-lg transition hover:scale-110 hover:cursor-pointer"
          >
            <Heart
              className={`h-6 w-6 transition-all duration-300 ${
                isFavourite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-slate-500"
              }`}
            />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Left */}
          <div>
            {/* Description */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">About this place</h2>

              <p className="leading-8 text-slate-600">{home.description}</p>
            </section>

            {/* Amenities */}
            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Amenities</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-100 p-4">
                  🏠 Entire Home
                </div>

                <div className="rounded-xl bg-slate-100 p-4">📶 Free WiFi</div>

                <div className="rounded-xl bg-slate-100 p-4">
                  🚿 Private Bathroom
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  🚗 Free Parking
                </div>
              </div>
            </section>

            {/* Map */}
            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Location</h2>

              {lat && lng ? (
                <div className="overflow-hidden rounded-2xl">
                  <MapContainer
                    center={[lat, lng]}
                    zoom={13}
                    className="h-[400px] w-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[lat, lng]}>
                      <Popup>
                        <strong>{home.homeName}</strong>
                        <br />₹{home.price}/night
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <p className="text-red-500">Location not available</p>
              )}
            </section>

            {/* Reviews */}
            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Reviews</h2>

              <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                No reviews yet.
              </div>

              {/* Later replace with reviews.map() */}
            </section>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-xl">
              <div className="mb-5">
                <span className="text-4xl font-extrabold text-emerald-600">
                  ₹{home.price}
                </span>

                <span className="ml-1 text-slate-500">/ night</span>
              </div>

              <button className="mb-3 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white transition hover:scale-[1.02] hover:cursor-pointer">
                <Link to={`/homes/${homeId}/book`}>Book Now</Link>
              </button>

              <button
                disabled={loading}
                onClick={handleFavourite}
                className={`w-full rounded-xl py-3 font-semibold transition hover:cursor-pointer ${
                  isFavourite
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "border hover:bg-slate-100"
                }`}
              >
                {isFavourite
                  ? loading
                    ? "Removing from Wishlist..."
                    : "Remove from Wishlist"
                  : loading
                    ? "Adding to Wishlist..."
                    : "Add to Wishlist"}
              </button>

              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-3">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Hosted by {home.host?.firstName || "Host"}
                    </p>

                    <p className="text-sm text-slate-500">Verified Host</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                  <span className="font-semibold">
                    {home.averageRating?.toFixed(1) || "New"}
                  </span>

                  <span className="text-slate-500">
                    ({home.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
