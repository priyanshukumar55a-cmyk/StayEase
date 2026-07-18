import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { signupUser } from "@/api/authApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("guest");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords must match.");
      return;
    }

    if (!terms) {
      toast.error("You must accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);
      await signupUser({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        userType,
        terms: terms ? "on" : "",
      });
      toast.success("Check your email for verification");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to sign up. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl min-h-[750px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:flex-row">
        <aside className="relative overflow-hidden flex flex-1 flex-col justify-center bg-gradient-to-br from-blue-400 via-blue-800 to-black px-8 py-10 text-white">

          <div className="absolute inset-0 bg-white/5" />
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-100">
              Create account
            </span>
            <h1 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
              Join StayEase today
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100/80 sm:text-base">
              Host your space or discover new stays with a beautifully simple
              booking experience.
            </p>
          </div>

          <div className="relative z-10 mt-6 grid gap-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-slate-100 shadow-inner shadow-slate-950/10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-blue-200">
                Flexible plan
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                Choose guest or host mode and get the right experience
                instantly.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-blue-200">
                Safe & trusted
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                We use modern auth to keep your account protected on every
                device.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center bg-slate-950 px-8 py-10">
          <div className="w-full max-w-xl">
            {" "}
            <div className="mb-4">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
                Sign up
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Start browsing homes and managing bookings in minutes.
              </p>
            </div>
            {error && (
              <div className="mb-5 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 inline-block text-slate-400">
                    First name
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 h-12 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 inline-block text-slate-400">
                    Last name
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 h-12 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </label>
              </div>

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

              <div className="grid gap-4 md:grid-cols-2">
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              </div>

              <div className="grid gap-4 rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400 shadow-inner shadow-slate-950/20">
                <label className="flex items-center gap-3 text-slate-300">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
                    required
                  />
                  <span>I agree to the terms and conditions.</span>
                </label>
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 inline-block text-slate-400">
                    Account type
                  </span>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mt-2 h-12 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="guest">Guest</option>
                    <option value="host">Host</option>
                  </select>
                </label>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="h-12 w-full rounded-[1.5rem] bg-blue-500 px-5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Creating your account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
              <p>Already have an account?</p>
              <Link
                className="font-semibold text-white transition hover:text-blue-300"
                to="/login"
              >
                Login instead
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
