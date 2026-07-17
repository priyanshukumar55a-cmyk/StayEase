import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/api/authApi";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const user = await loginUser({ email, password });
        await login(user);
        toast.success("Login successfull")
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to login. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:flex-row">
        <section className="relative w-full flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-8 py-10 text-white md:px-14 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_28%)]" />
          <div className="relative z-10 max-w-md">
            <span className="inline-flex rounded-full bg-blue-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
              Welcome back
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Login to StayEase
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Manage bookings, favourites, and host controls from one secure
              place.
            </p>
          </div>

          <div className="mt-12 grid gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-200 shadow-inner shadow-slate-950/20">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Fast access
              </p>
              <p className="mt-2 text-base text-slate-300">
                Keep your stay plans organized with a clean, simple login
                experience.
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Secure session
              </p>
              <p className="mt-2 text-base text-slate-300">
                We use secure authentication so you can trust your account
                remains safe.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full flex-1 bg-slate-950 px-8 py-10 md:px-12 md:py-16">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
              Sign in
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter your credentials to continue your StayEase experience.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="block text-sm text-slate-300">
              <span className="mb-2 inline-block text-slate-400">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-[1.5rem] border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-[1.5rem] bg-blue-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              Login
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
            <span>Need an account?</span>
            <Link
              to="/signup"
              className="font-semibold text-white transition hover:text-blue-300"
            >
              Create one
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
