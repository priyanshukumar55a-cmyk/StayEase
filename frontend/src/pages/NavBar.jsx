import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const active = "bg-blue-600 text-white shadow-lg";

  const normal = "text-slate-700 hover:bg-blue-50 hover:text-blue-600";

  return (
    <header className="bg-slate-100 border-b-2 border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
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
                to="/homes"
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
              onClick={logout}
              className="px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 hover:cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </span>
            </button>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-3">
          <Link to="/" className="block p-3 rounded-xl hover:bg-blue-50">
            Home
          </Link>

          {isLoggedIn && user?.userType === "guest" && (
            <>
              <Link
                to="/homes"
                className="block p-3 rounded-xl hover:bg-blue-50"
              >
                Explore
              </Link>

              <Link
                to="/favourites"
                className="block p-3 rounded-xl hover:bg-blue-50"
              >
                Favourites
              </Link>

              <Link
                to="/bookings"
                className="block p-3 rounded-xl hover:bg-blue-50"
              >
                Bookings
              </Link>
            </>
          )}

          {isLoggedIn && user?.userType === "host" && (
            <>
              <Link
                to="/host"
                className="block p-3 rounded-xl hover:bg-blue-50"
              >
                Host Dashboard
              </Link>

              <Link
                to="/host/add-home"
                className="block bg-blue-600 text-white text-center p-3 rounded-xl"
              >
                Add Home
              </Link>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="block bg-blue-600 text-white text-center p-3 rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="block border border-blue-200 text-center p-3 rounded-xl"
              >
                Create Account
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="w-full bg-red-50 text-red-600 p-3 rounded-xl"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
