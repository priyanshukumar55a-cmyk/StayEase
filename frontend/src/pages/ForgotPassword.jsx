import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/api/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to send reset email.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400">
            Password reset
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we’ll send you a secure link to reset it.
          </p>
        </div>

        {sent ? (
          <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-200">
            If your email is registered, you’ll receive a reset link shortly.
          </div>
        ) : (
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

            <button
              disabled={loading}
              type="submit"
              className="h-12 w-full rounded-[1.5rem] bg-blue-500 px-5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        )}

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
