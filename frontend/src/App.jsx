import { useAuth } from "./context/AuthContext";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomeDetails from "./pages/HomeDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/NavBar";
import { Toaster } from "sonner";
import AddHome from "./pages/Host/AddHome";
import HostHomes from "./pages/Host/HostHomes";
import VerifyEmail from "./auth/VerifyEmail";
import HomesExplore from "./pages/HomeListExplore";
import Favourites from "./pages/Favourites";
import Bookings from "./pages/Bookings";
import BookingRequest from "./pages/BookingRequest";
import Profile from "./pages/Profile";
import PublicRoute from "./auth/PublicRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import ReviewPage from "./pages/ReviewPage";
import HostDashboard from "./components/HostDashboard";
import HostBookings from "./pages/Host/HostBookings";
import HomeCardSkeleton from "./components/skeletons/HomeCardSkeleton";
import HostReviews from "./pages/Host/HostReviews";

function RootLayout() {
  const { loading } = useAuth();

  if (loading) {
    return <HomeCardSkeleton />;
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
        path: "/host/homes",
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
            <BookingRequest />
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
      {
        path: "/homes/:homeId/review",
        element: (
          <ProtectedRoute>
            <ReviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/host/dashboard",
        element: (
          <ProtectedRoute>
            <HostDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/host/bookings",
        element: (
          <ProtectedRoute>
            <HostBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/host/reviews",
        element: (
          <ProtectedRoute>
            <HostReviews />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
