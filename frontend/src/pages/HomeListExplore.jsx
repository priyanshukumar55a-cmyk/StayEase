import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addHomeToFavourites, getHomes } from "@/api/homeApi";
import { Loader2, Star } from "lucide-react";
import HomeMap from "./HomeMap";
import { toast } from "sonner";

export default function HomesExplore() {
  const [openedMap, setOpenedMap] = useState(null);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();

  const toggleMap = (id) => {
    setOpenedMap((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await getHomes();

        setHomes(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  const addToFavourite = (homeId) => {
    const postAddToFavourite = async () => {
      try {
        setAddingId(homeId);
        const message = await addHomeToFavourites(homeId);

        if (message === "Home already added to favourites")
          toast.warning(message);
        else toast.success(message);

        navigate("/favourites");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add favourite");
      } finally {
        setAddingId(null);
      }
    };

    postAddToFavourite();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-black/80" />
        <span className="text-3xl text-black/80">Loading...</span>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
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

            {/* Map */}
            {openedMap === home._id && (
              <HomeMap
                lat={home.location.coordinates[1]}
                lng={home.location.coordinates[0]}
              />
            )}

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 p-2 font-semibold">
              <button
                onClick={() => toggleMap(home._id)}
                className="rounded px-3 py-1 font-semibold text-cyan-700 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white"
              >
                {openedMap === home._id ? "Hide Map" : "Map"}
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="mb-1 truncate text-lg font-bold text-slate-800">
                {home.homeName}
              </h2>

              <p className="mb-2 text-sm text-slate-700">
                📍 {home.address || "Location not available"}
              </p>

              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>
                {home.averageRating?.toFixed(1)} ({home.reviewCount} Reviews)
              </span>

              <p className="mb-4 text-lg font-bold text-emerald-600">
                ₹{home.price}
                <span className="ml-1 text-sm font-normal text-slate-600">
                  / night
                </span>
              </p>

              <Link
                to={`/homes/${home._id}`}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 font-semibold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                View Details
              </Link>

              <button
                disabled={addingId === home._id}
                onClick={() => addToFavourite(home._id)}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-2.5 font-semibold tracking-wide text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {addingId === home._id ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-7 w-7 animate-spin text-white" />
                    <span>Adding to favourites...</span>
                  </div>
                ) : (
                  "Add to favourites"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
