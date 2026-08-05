import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addHomeToFavourites, getHomes } from "@/api/homeApi";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Star } from "lucide-react";
import HomeMap from "./HomeMap";
import { toast } from "sonner";
import HomeCardSkeleton from "@/components/skeletons/HomeCardSkeleton";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function HomesExplore() {
  const [openedMap, setOpenedMap] = useState(null);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHome, setLoadingHome] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");

  const navigate = useNavigate();

  const toggleMap = (id) => {
    setOpenedMap((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchHomes = async () => {
      setLoadingHome(true);
      try {
        const res = await getHomes(currentPage, debouncedSearch, sort);

        setHomes(res.homes);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingHome(false);
      }
    };

    fetchHomes();
  }, [currentPage, debouncedSearch, sort]);

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

  useEffect(() => {
    window.scrollTo({
      top: 30,
      behaviour: "smooth",
    });
  }, [currentPage]);

  if (loading) {
    return <HomeCardSkeleton />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Explore homes near you
          </h2>
          <p className="text-slate-700 text-sm sm:text-base">
            Search by name, address, or description to find the perfect stay.
          </p>
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search homes by name or location"
            className="pl-11 dark:*:bg-slate-800 dark:text-white dark:border-slate-700"
          />
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-56 hover:cursor-pointer dark:text-white dark:border-slate-700">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent className="p-1.5 dark:bg-slate-800 dark:text-white dark:border-slate-700">
            <SelectItem className="p-1.5" value="newest">
              Newest
            </SelectItem>
            <SelectItem className="p-1.5" value="price_asc">
              Price: Low to High
            </SelectItem>
            <SelectItem className="p-1.5" value="price_desc">
              Price: High to Low
            </SelectItem>
            <SelectItem className="p-1.5" value="rating">
              Highest Rated
            </SelectItem>
            <SelectItem className="p-1.5" value="reviews">
              Most Reviewed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Showing {homes.length} home{homes.length !== 1 ? "s" : ""}
          {debouncedSearch.trim() && ` for "${debouncedSearch.trim()}"`}
        </p>
      </div>

      {loadingHome ? (
        <HomeCardSkeleton />
      ) : homes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No homes found.
          {debouncedSearch.trim() ? ` Try another search term.` : ""}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {homes.map((home) => (
            <div
              key={home._id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    home.photo ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={home.homeName}
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* Rating Badge */}
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 shadow">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {home.averageRating?.toFixed(1) || "New"}
                  </span>
                </div>
              </div>

              {/* Map */}
              {openedMap === home._id && (
                <HomeMap
                  lat={home.location.coordinates[1]}
                  lng={home.location.coordinates[0]}
                />
              )}

              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <button
                  onClick={() => toggleMap(home._id)}
                  className="rounded-md bg-blue-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-600 hover:cursor-pointer"
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

                {/* Reviews */}
                <div className="mt-3 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                  <span className="font-medium text-slate-800">
                    {home.averageRating?.toFixed(1) || "0.0"}
                  </span>

                  <span className="text-sm text-slate-500">
                    ({home.reviewCount || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="my-4">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{home.price}
                  </span>

                  <span className="ml-1 text-sm text-slate-500">/ night</span>
                </div>

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
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
