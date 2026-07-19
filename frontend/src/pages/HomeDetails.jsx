import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHomeDetails } from "../api/homeApi";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";

export default function HomeDetails() {
  const { homeId } = useParams();

  const [home, setHome] = useState(null);
  const [activeTab, setActiveTab] = useState("image");

  useEffect(() => {
    fetchHome();
  }, [homeId]);

  const fetchHome = async () => {
    try {
      const res = await getHomeDetails(homeId);
      setHome(res);
    } catch (err) {
      console.log(err);
    }
  };

  if (!home) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-black/80" />
        <span className="text-3xl text-black/80">Loading...</span>
      </div>
    );
  }

  const lat = home?.location?.coordinates?.[1];
  const lng = home?.location?.coordinates?.[0];

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          {home.homeName}
        </h2>

        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden grid md:grid-cols-2 border border-gray-200">
          {/* LEFT SECTION */}
          <div className="h-64 md:h-full flex flex-col">
            {/* Tabs */}
            <div className="flex gap-2 p-2 bg-gray-100">
              <button
                onClick={() => setActiveTab("image")}
                className={`px-4 py-2 rounded font-semibold shadow ${
                  activeTab === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Image
              </button>

              <button
                onClick={() => setActiveTab("map")}
                className={`px-4 py-2 rounded font-semibold shadow ${
                  activeTab === "map"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Map
              </button>
            </div>

            {/* Image */}
            {activeTab === "image" && (
              <div className="flex-1 overflow-hidden">
                <img
                  src={home.photo || "https://via.placeholder.com/400x300"}
                  alt={home.homeName}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            )}

            {/* Map */}
            {activeTab === "map" && (
              <div className="flex-1 h-[400px]">
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
                      <Popup>
                        <strong>{home.homeName}</strong>
                        <br />₹{home.price}/night
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-full flex justify-center items-center text-red-500">
                    Location not available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {home.homeName}
              </h2>

              <p className="text-gray-600 text-sm mb-2">📍 {home.address}</p>

              <p className="text-yellow-500 font-semibold text-sm mb-2">
                ⭐ {home.rating} / 5
              </p>

              <p className="text-2xl font-bold text-gray-900 mb-4">
                ₹{home.price}
                <span className="text-gray-500 text-sm font-normal">
                  {" "}
                  / night
                </span>
              </p>

              <p className="text-gray-600 text-sm">{home.description}</p>
            </div>

            {/* Favourite Button */}
            <div className="mt-4">
              <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
                Add to Favourite
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
