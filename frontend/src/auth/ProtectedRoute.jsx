import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-black/80" />
          <span className="text-3xl text-black/80">Loading...</span>
        </div>
      );
    }

    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;