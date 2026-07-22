import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function HostHomes() {
  const [openedMap, setOpenedMap] = useState(null);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingHomeId, setDeletingHomeId] = useState(null);

  const toggleMap = (id) => {
    setOpenedMap((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      const res = await axios.get(`${API_URL}/host/homes`, {
        withCredentials: true,
      });

      setHomes(res.data.homes);
    } catch (error) {
      toast.error("Failed to fetch homes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (homeId) => {
    try {
      setDeletingHomeId(homeId);
      await axios.delete(`${API_URL}/host/delete-home/${homeId}`, {
        withCredentials: true,
      });

      toast.success("Home deleted");
      setHomes((prev) => prev.filter((h) => h._id !== homeId));
    } catch (error) {
      toast.error("Error Occured! Try again");
    } finally {
      setDeletingHomeId(null);
    }
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
      <h2 className="text-4xl font-extrabold text-blue-600 text-center mb-2">
        Your Listings
      </h2>

      <p className="text-center text-gray-600 text-lg mb-8">
        Manage and update your amazing properties
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {homes.map((home) => {
          const lat = home.location?.coordinates?.[1];
          const lng = home.location?.coordinates?.[0];

          return (
            <div
              key={home._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200"
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

              {/* Map */}
              {openedMap === home._id && (
                <div className="h-48">
                  {lat && lng ? (
                    <MapContainer
                      center={[lat, lng]}
                      zoom={13}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <Marker position={[lat, lng]}>
                        <Popup>📍 Property Location</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-red-500">
                      Location not available
                    </div>
                  )}
                </div>
              )}

              {/* Toggle Map Button */}
              <div className="p-2 bg-gray-100">
                <button
                  onClick={() => toggleMap(home._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition"
                >
                  {openedMap === home._id ? "Close Map" : "View Map"}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">
                  {home.homeName}
                </h2>

                <p className="text-gray-600 text-sm mb-2">
                  📍 {home.address || "Location not available"}
                </p>

                <p className="text-yellow-500 text-sm font-semibold mb-2">
                  ⭐ {home.rating} / 5
                </p>

                <p className="text-gray-900 font-semibold text-lg mb-4">
                  ₹{home.price}
                  <span className="text-gray-500 text-sm font-normal">
                    {" "}
                    / night
                  </span>
                </p>

                {/* Edit */}
                <Link
                  to={`/host/edit-home/${home._id}`}
                  className="block w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                >
                  Edit
                </Link>

                {/* Delete */}
                <button
                  disabled={deletingHomeId === home._id}
                  onClick={() => onDelete(home._id)}
                  className="w-full bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition mt-2 hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {deletingHomeId === home._id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
