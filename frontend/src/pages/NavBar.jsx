import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  Home,
  Compass,
  Heart,
  Calendar,
  LogIn,
  UserPlus,
  LogOut,
  House,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = "bg-blue-600 text-white shadow-lg";

  const normal = "text-slate-700 hover:bg-blue-50 hover:text-blue-600";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-gray-300 bg-slate-100 shadow-sm">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-blue-600">
          StayEase
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${isActive ? active : normal}
               px-4 py-2 rounded-full text-sm font-medium`
            }
          >
            <span className="flex items-center gap-2">
              <Home size={16} />
              Home
            </span>
          </NavLink>

          {isLoggedIn && user?.userType === "guest" && (
            <>
              <NavLink
                to="/homes-explore"
                className={({ isActive }) =>
                  `${isActive ? active : normal}
                  px-4 py-2 rounded-full text-sm font-medium`
                }
              >
                <span className="flex items-center gap-2">
                  <Compass size={16} />
                  Explore
                </span>
              </NavLink>

              <NavLink
                to="/favourites"
                className={({ isActive }) =>
                  `${isActive ? active : normal}
                  px-4 py-2 rounded-full text-sm font-medium`
                }
              >
                <span className="flex items-center gap-2">
                  <Heart size={16} />
                  Favourites
                </span>
              </NavLink>

              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  `${isActive ? active : normal}
                  px-4 py-2 rounded-full text-sm font-medium`
                }
              >
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Bookings
                </span>
              </NavLink>
            </>
          )}

          {isLoggedIn && user?.userType === "host" && (
            <>
              <NavLink
                to="/host"
                className={({ isActive }) =>
                  `${isActive ? active : normal}
                  px-4 py-2 rounded-full text-sm font-medium`
                }
              >
                <span className="flex items-center gap-2">
                  <House size={16} />
                  Host
                </span>
              </NavLink>

              <Link
                to="/host/add-home"
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition"
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  Add Home
                </span>
              </Link>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${isActive ? active : normal}
                  px-4 py-2 rounded-full text-sm font-medium`
                }
              >
                <span className="flex items-center gap-2">
                  <LogIn size={16} />
                  Login
                </span>
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${isActive ? active : normal}
                  px-4 py-2 rounded-full text-sm font-medium`
                }
              >
                <span className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Sign Up
                </span>
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => handleLogout()}
              className="px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 hover:cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </span>
            </button>
          )}
        </div>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Button */}
        <button
          className="md:hidden rounded-xl p-2 transition hover:bg-slate-200 z-50"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div
            className={`transition-transform duration-200 ${
              mobileOpen ? "rotate-90" : ""
            }`}
          >
            {mobileOpen ? (
              <X size={26} className="text-slate-700" />
            ) : (
              <Menu size={26} className="text-slate-700" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 px-4 pt-3 z-50">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-purple-300 backdrop-blur-xl shadow-2xl">
            {isLoggedIn && (
              <div className="border-b border-slate-200 px-5 py-4">
                <p className="font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            )}

            <div className="p-3 space-y-1">
              <NavLink
                to="/"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `${isActive ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-50 hover:text-blue-600"} flex items-center gap-3 rounded-2xl px-4 py-3 transition`
                }
              >
                <Home size={18} />
                Home
              </NavLink>

              {isLoggedIn && user?.userType === "guest" && (
                <>
                  <NavLink
                    to="/homes-explore"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"} flex items-center gap-3 rounded-2xl px-4 py-3 transition`
                    }
                  >
                    <Compass size={18} />
                    Explore
                  </NavLink>

                  <NavLink
                    to="/favourites"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"} flex items-center gap-3 rounded-2xl px-4 py-3 transition`
                    }
                  >
                    <Heart size={18} />
                    Favourites
                  </NavLink>

                  <NavLink
                    to="/bookings"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"} flex items-center gap-3 rounded-2xl px-4 py-3 transition`
                    }
                  >
                    <Calendar size={18} />
                    Bookings
                  </NavLink>
                </>
              )}

              {isLoggedIn && user?.userType === "host" && (
                <>
                  <NavLink
                    to="/host"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"} flex items-center gap-3 rounded-2xl px-4 py-3 transition`
                    }
                  >
                    <House size={18} />
                    Host Dashboard
                  </NavLink>

                  <Link
                    to="/host/add-home"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white"
                  >
                    <Plus size={18} />
                    Add Home
                  </Link>
                </>
              )}

              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "bg-blue-700 text-white" : "bg-white/70 text-slate-700"} flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium`
                    }
                  >
                    <LogIn size={18} />
                    Login
                  </NavLink>

                  <NavLink
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "bg-blue-600 text-white" : "bg-white/70 text-slate-700 border border-slate-300"} flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium`
                    }
                  >
                    <UserPlus size={18} />
                    Create Account
                  </NavLink>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 font-medium text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
