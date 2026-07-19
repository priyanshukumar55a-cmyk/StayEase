import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
      }
    };
    
    const login = async (userData) => {
      setUser(userData);
    };

    const navigate = useNavigate();

    const logout = async () => {
      try {
        await axios.post(
          `${API_URL}/auth/logout`,
          {},
          { withCredentials: true },
        );

        setUser(null);
        toast.success("Logout successful");
        navigate("/login");
      } catch (err) {
        toast.error("Logout failed");
      }
    };

    useEffect(() => {
      checkAuth();
    }, []);

    return (
      <AuthContext.Provider
        value={{
          user,
          isLoggedIn: !!user,
          loading,
          login,
          logout,
          checkAuth,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}
