import { useEffect, useState } from "react";
import { getFavouriteHomes, removeFavourite } from "@/api/homeApi";
import { Loader2, HeartOff } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import HomeCardSkeleton from "@/components/skeletons/HomeCardSkeleton";

export default function Favourites() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchFavouriteHomes = async () => {
      try {
        const res = await getFavouriteHomes();
        setHomes(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteHomes();
  }, []);

  const handleRemoveFavourite = async (homeId) => {
    try {
      setRemovingId(homeId);
      const message = await removeFavourite(homeId);

      setHomes((prev) => prev.filter((home) => home._id !== homeId));
      toast.success(message);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to remove from favourite",
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <HomeCardSkeleton/>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-center text-4xl font-extrabold text-blue-600">
        Your Favourites
      </h1>

      <p className="mb-8 text-center text-lg text-slate-700">
        Your collection of amazing places to stay
      </p>

      {homes.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <p className="text-lg text-slate-600">No favourite homes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {homes.map((home) => (
            <div
              key={home._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={
                    home.photo ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={home.homeName}
                  className="h-48 w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="mb-1 truncate text-lg font-bold text-slate-800">
                  {home.homeName}
                </h2>

                <p className="mb-2 text-sm text-slate-700">
                  📍 {home.address || "Location not available"}
                </p>

                <p className="mb-2 text-sm font-semibold text-amber-500">
                  ⭐ {home.rating} / 5
                </p>

                <p className="mb-4 text-lg font-bold text-emerald-600">
                  ₹{home.price}
                  <span className="ml-1 text-sm font-normal text-slate-600">
                    / night
                  </span>
                </p>

                <button
                  disabled={removingId === home._id}
                  onClick={() => handleRemoveFavourite(home._id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 py-2.5 font-semibold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {removingId === home._id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-7 w-7 animate-spin text-white" />
                      <span>Removing from Favourites...</span>
                    </div>
                  ) : (
                    <>
                      <HeartOff size={18} />
                      <span>Remove from Favourites</span>
                    </>
                  )}
                </button>

                <Link to={`/homes/${home._id}/book`}>
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 mt-2 shadow-md hover:cursor-pointer">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
