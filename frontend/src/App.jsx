import { useAuth } from "./context/AuthContext";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomeDetails from "./pages/HomeDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./pages/NavBar";
import { Toaster } from "sonner";
import AddHome from "./pages/Host/AddHome";
import HostHomes from "./pages/Host/HostHomes";
import { Loader2 } from "lucide-react";
import VerifyEmail from "./auth/VerifyEmail";
import HomesExplore from "./pages/HomeListExplore";
import Favourites from "./pages/Favourites";
import Bookings from "./pages/Bookings";
import BookHome from "./pages/BookHome";
import Profile from "./pages/Profile";
import PublicRoute from "./auth/PublicRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import EditProfile from "./pages/EditProfile";

function RootLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-black/80" />
        <span className="text-3xl text-black/80">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/homes/:homeId",
        element: (
          <ProtectedRoute>
            <HomeDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            {" "}
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            {" "}
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "/host/add-home",
        element: (
          <ProtectedRoute>
            <AddHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/host",
        element: (
          <ProtectedRoute>
            <HostHomes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/host/edit-home/:homeId",
        element: (
          <ProtectedRoute>
            <AddHome editing={true} />
          </ProtectedRoute>
        ),
      },
      { path: "auth/verify-email", element: <VerifyEmail /> },
      {
        path: "/homes-explore",
        element: (
          <ProtectedRoute>
            <HomesExplore />
          </ProtectedRoute>
        ),
      },
      {
        path: "/favourites",
        element: (
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bookings",
        element: (
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/homes/:homeId/book",
        element: (
          <ProtectedRoute>
            <BookHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
