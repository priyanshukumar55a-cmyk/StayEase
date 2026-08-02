import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/api/authApi";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords must match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, password });
      toast.success("Password updated successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
            Set new password
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Choose a new password
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your new password below and sign in with it afterward.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 inline-block text-slate-400">
              New password
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 h-12 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/4 text-white/60"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 inline-block text-slate-400">
              Confirm password
            </span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 h-12 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/4 text-white/60"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </label>

          <button
            disabled={loading}
            type="submit"
            className="h-12 w-full rounded-[1.5rem] bg-blue-500 px-5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
                <span>Updating...</span>
              </div>
            ) : (
              "Update password"
            )}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-400">
          <Link
            to="/login"
            className="font-semibold text-white transition hover:text-blue-300"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
