import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyEmail() {
  const { checkAuth } = useAuth()
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState("pending");
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        const errorMessage = "Verification token is missing from the URL.";
        setMessage(errorMessage);
        setStatus("error");
        toast.error(errorMessage);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/auth/verify-email?token=${token}`,
          { withCredentials: true },
        );

        setMessage(res.data.message || "Email verified successfully.");
        setStatus("success");
        toast.success(res.data.message || "Email verified successfully.");

        // Refresh auth state after cookie is set
        await checkAuth();

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Verification failed.";
        setMessage(errorMessage);
        setStatus("error");
        toast.error(errorMessage);
      }
    };

    verify();
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <p className="text-lg font-semibold text-slate-900">
          {status === "pending"
            ? "Verifying your email..."
            : status === "success"
              ? "Email Verified"
              : "Verification Error"}
        </p>
        <p className="mt-4 text-sm text-slate-600">{message}</p>
        {status === "error" && (
          <button
            type="button"
            className="mt-6 rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-700"
            onClick={() => navigate("/")}
          >
            Return to homepage
          </button>
        )}
      </div>
    </div>
  );
}
