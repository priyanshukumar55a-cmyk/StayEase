import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/api/authApi";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const user = await loginUser({ email, password });
      await login(user);
      toast.success("Login successfull");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen md:h-[93vh] items-center justify-center bg-slate-900 px-4 py-4 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl min-h-[600px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:flex-row">
        <section className="relative flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-400 via-blue-800 to-black px-8 py-16 text-white">
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative z-10 max-w-xs">
            <span className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-200">
              Welcome back
            </span>
            <h1 className="mt-4 text-2xl font-semibold leading-tight text-white">
              Login to StayEase
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
              Manage bookings, favourites, and host controls from one secure
              place.
            </p>
          </div>

          <div className="mt-5 grid gap-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-slate-200 shadow-inner shadow-slate-950/20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Fast access
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Keep your stay plans organized with a clean, simple login
                experience.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Secure session
              </p>
              <p className="mt-2 text-sm text-slate-300">
                We use secure authentication so you can trust your account
                remains safe.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-slate-950 px-8 py-10">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <p className="text-sm uppercase tracking-[0.25em] text-blue-400">
                Sign in
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter your credentials to continue.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 inline-block text-slate-400">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 inline-block text-slate-400">
                  Password
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
              <button
                disabled={loading}
                type="submit"
                className="h-12 w-full rounded-[1.5rem] bg-blue-500 px-5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:cursor-pointer hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Logging...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
              <span>Need an account?</span>
              <Link
                to="/signup"
                className="font-semibold text-white transition hover:text-blue-300"
              >
                Create one
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
