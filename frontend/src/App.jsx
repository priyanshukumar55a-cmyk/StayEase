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
import VerifyEmail from "./pages/VerifyEmail";
import HomesExplore from "./pages/HomeListExplore";
import Favourites from "./pages/Favourites";
import Bookings from "./pages/Bookings";
import BookHome from "./pages/BookHome";

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
        element: <HomeDetails />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/host/add-home",
        element: <AddHome />,
      },
      {
        path: "/host",
        element: <HostHomes />,
      },
      {
        path: "/host/edit-home/:homeId",
        element: <AddHome editing={true} />,
      },
      { path: "auth/verify-email", element: <VerifyEmail /> },
      { path: "/homes-explore", element: <HomesExplore /> },
      { path: "/favourites", element: <Favourites /> },
      { path: "/bookings", element: <Bookings /> },
      { path: "/homes/:homeId/book", element: <BookHome /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
