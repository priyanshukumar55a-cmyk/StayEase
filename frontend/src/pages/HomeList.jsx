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

      <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {homes.map((home) => (
          <div
            key={home._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={
                  home.photo ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={home.homeName}
                className="w-full h-48 object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-1 truncate">
                {home.homeName}
              </h2>

              <p className="text-slate-700 text-sm mb-2">
                📍 {home.address || "Location not available"}
              </p>

              <p className="text-amber-500 text-sm font-bold mb-2">
                ⭐ {home.rating} / 5
              </p>

              <p className="text-emerald-600 font-bold text-lg mb-4">
                ₹{home.price}
                <span className="text-slate-600 text-sm font-normal">
                  {" "}
                  / night
                </span>
              </p>

              <Link to={`/homes/${home._id}`}>
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg hover:cursor-pointer">
                  View Details
                </button>
              </Link>

              <Link to={`/homes/${home._id}/book`}>
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 mt-2 shadow-md hover:cursor-pointer">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
