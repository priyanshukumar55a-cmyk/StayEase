import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-8xl font-extrabold text-blue-600">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-slate-800">
          Oops! Page Not Found
        </h2>

        <p className="mt-3 text-slate-600">
          The page you're looking for doesn't exist, may have been moved, or the
          URL might be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-blue-700"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>

        <div className="mt-12 text-7xl">🏡</div>
      </div>
    </div>
  );
};

export default NotFound;
