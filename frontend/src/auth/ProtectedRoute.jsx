import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;