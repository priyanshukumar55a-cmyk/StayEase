import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { signupUser } from "@/api/authApi";

export default function Signup() {
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
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    if (!terms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    try {
      const user = await signupUser({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        userType,
        terms: terms ? "on" : "",
      });
      await login(user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to sign up. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:flex-row">
        <aside className="relative flex w-full flex-1 flex-col justify-between bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 px-10 py-12 text-white md:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_28%)]" />
          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              Create account
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
              Join StayEase today
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100/80 sm:text-base">
              Host your space or discover new stays with a beautifully simple
              booking experience.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-7 text-slate-100 shadow-inner shadow-slate-950/10">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-blue-200">
                Flexible plan
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                Choose guest or host mode and get the right experience
                instantly.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-blue-200">
                Safe & trusted
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-100/80">
                We use modern auth to keep your account protected on every
                device.
              </p>
            </div>
          </div>
        </aside>

        <main className="w-full flex-1 bg-slate-950 px-8 py-10 md:px-12 md:py-16">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
              Sign up
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Start browsing homes and managing your bookings in minutes.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 inline-block text-slate-400">
                  First name
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 inline-block text-slate-400">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 inline-block text-slate-400">
                  Confirm password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-400 shadow-inner shadow-slate-950/20">
              <label className="flex items-center gap-3 text-slate-300">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500"
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
                  className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="guest">Guest</option>
                  <option value="host">Host</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-[1.5rem] bg-blue-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              Create account
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
        </main>
      </div>
    </div>
  );
}
