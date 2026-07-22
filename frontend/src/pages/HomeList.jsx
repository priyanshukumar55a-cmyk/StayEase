import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeList({ homes }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-2">
        Discover Your Perfect Escape
      </h2>

      <p className="text-center text-slate-700 text-lg mb-8 font-medium">
        Find luxury homes and unique stays in your favorite destinations
      </p>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {homes.map((home) => (
          <div
            key={home._id}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
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

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="line-clamp-1 text-xl font-bold text-slate-900">
                    {home.homeName}
                  </h2>

                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                    📍 {home.address}
                  </p>
                </div>
              </div>

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
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-emerald-600">
                  ₹{home.price}
                </span>

                <span className="ml-1 text-sm text-slate-500">/ night</span>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex gap-3">
                <Link to={`/homes/${home._id}`} className="flex-1">
                  <button className="w-full rounded-xl border border-slate-300 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 hover:cursor-pointer">
                    View Details
                  </button>
                </Link>

                <Link to={`/homes/${home._id}/book`} className="flex-1">
                  <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:cursor-pointer">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
