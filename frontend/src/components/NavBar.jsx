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
  User,
  X,
  ChevronDown,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const hostActive = location.pathname.startsWith("/host");
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const active = "bg-blue-600 text-white shadow-lg";
  const normal = "text-slate-700 hover:bg-blue-50 hover:text-blue-600";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getLinkClasses = (isActive, mobile) =>
    mobile
      ? `${isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"} flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200`
      : `${isActive ? active : normal} px-4 py-2 rounded-full text-sm font-medium`;

  const navItems = [
    { to: "/", label: "Home", icon: Home, requiresAuth: false },
    {
      to: "/homes-explore",
      label: "Explore",
      icon: Compass,
      requiresAuth: true,
    },

    { to: "/bookings", label: "Bookings", icon: Calendar, requiresAuth: true },
  ];

  const hostItems = [
    { to: "/host/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/host/homes", label: "My Listings", icon: House },
    { to: "/host/add-home", label: "Add Listing", icon: Plus },
    { to: "/host/bookings", label: "Booking Requests", icon: Calendar },
  ];

  const authItems = [
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/signup", label: "Sign Up", icon: UserPlus },
  ];

  const renderNavLink = (item, mobile = false) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => mobile && setMobileOpen(false)}
        className={({ isActive }) => getLinkClasses(isActive, mobile)}
      >
        <span className={`flex items-center ${mobile ? "gap-3" : "gap-2"}`}>
          <Icon size={mobile ? 18 : 16} />
          {item.label}
        </span>
      </NavLink>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
        <Link
          to="/"
          className="text-xl font-extrabold text-blue-600 md:text-2xl"
        >
          StayEase
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems
            .filter((item) => !item.requiresAuth || isLoggedIn)
            .map((item) => renderNavLink(item))}

          {isLoggedIn && user?.userType === "host" && (
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                type="button"
                className={`flex items-center gap-2 hover:cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition
  ${
    hostActive
      ? "bg-blue-700 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
              >
                <House size={16} />
                Host
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-4 w-68 rounded-xl border shadow-xl animate-in fade-in zoom-in-95"
              >
                {hostItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <DropdownMenuItem
                      key={item.to}
                      asChild
                      className=" text-md"
                    >
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-3 p-1 text-md"
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isLoggedIn && (
            <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm transition hover:bg-slate-50 hover:cursor-pointer">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-full object-cover"
                />

                <span className="max-w-24 truncate text-sm font-medium">
                  {user.firstName}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-4 p-2 w-68 rounded-xl border shadow-xl animate-in fade-in zoom-in-95"
              >
                <DropdownMenuItem>
                  <Link
                    to="/profile"
                    className="flex w-full items-center gap-3 p-1"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    to="/favourites"
                    className="flex w-full items-center gap-3 p-1 text-md"
                  >
                    <Heart className="h-4 w-4 text-pink-500" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem disabled>
                  <div className="flex w-full items-center gap-3 p-1 text-md">
                    <Settings className="h-4 w-4" />
                    Settings
                    <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs">
                      Soon
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:cursor-pointer p-1 text-md"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isLoggedIn && authItems.map((item) => renderNavLink(item))}
        </div>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <button
          className="z-50 rounded-xl p-2 transition hover:bg-slate-200 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <div
            className={`transition-transform duration-200 ${mobileOpen ? "rotate-90" : ""}`}
          >
            {mobileOpen ? (
              <X size={26} className="text-slate-700" />
            ) : (
              <Menu size={26} className="text-slate-700" />
            )}
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 px-4 md:hidden">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/98 shadow-2xl backdrop-blur-xl">
            {isLoggedIn && (
              <div className="border-b border-slate-200 px-5 py-4">
                <p className="font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            )}

            <div className="p-2">
              {navItems
                .filter((item) => !item.requiresAuth || isLoggedIn)
                .map((item) => renderNavLink(item, true))}

              {isLoggedIn && user?.userType === "host" && (
                <div className="mt-3 border-t pt-3">
                  <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Host
                  </p>
                  {hostItems.map((item) => renderNavLink(item, true))}
                </div>
              )}

              {!isLoggedIn ? (
                authItems.map((item) => renderNavLink(item, true))
              ) : (
                <>
                  <div className="mt-3 border-t pt-3">
                    <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Account
                    </p>

                    {renderNavLink(
                      {
                        to: "/profile",
                        label: "Profile",
                        icon: User,
                      },
                      true,
                    )}

                    {renderNavLink(
                      {
                        to: "/favourites",
                        label: "Wishlist",
                        icon: Heart,
                      },
                      true,
                    )}

                    <button
                      disabled
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-400"
                    >
                      <Settings size={18} />
                      Settings (Soon)
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
