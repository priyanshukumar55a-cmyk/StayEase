import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { getHomeDetails, postReview } from "@/api/homeApi";

export default function ReviewPage() {
  const { homeId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [home, setHome] = useState(null);

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const data = await getHomeDetails(homeId);
      setHome(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      return toast.error("Please select a rating.");
    }

    if (!comment.trim()) {
      return toast.error("Please write your review.");
    }

    try {
      setLoading(true);

      await postReview(homeId, {
        rating,
        comment,
      });

      toast.success("Review submitted successfully!");

      navigate(`/homes/${homeId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-card p-5 shadow-xl sm:p-8">
        <h1 className="mb-2 text-3xl font-bold text-card-foreground">
          Write a Review
        </h1>

        <p className="mb-8 text-slate-500">
          Tell other guests about your experience.
        </p>

        {home && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-muted p-4 sm:flex-row sm:items-center">
            <img
              src={home.photo}
              alt={home.homeName}
              className="h-48 w-full rounded-xl object-cover sm:h-28 sm:w-36"
            />

            <div className="flex-1">
              <h2 className="text-xl font-bold">{home.homeName}</h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {home.averageRating?.toFixed(1) || "New"}

                <span>({home.reviewCount || 0} reviews)</span>
              </div>

              <p className="mt-2 text-sm text-slate-500">📍 {home.address}</p>

              <p className="mt-2 text-lg font-semibold text-emerald-600">
                ₹{home.price} / night
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 font-semibold">Overall Rating</h2>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="hover:cursor-pointer"
              >
                <Star
                  className={`h-10 w-10 transition ${
                    star <= (hover || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-2 block font-semibold">Your Review</label>

          <textarea
            rows={6}
            value={comment}
            maxLength={500}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full rounded-xl border p-4 outline-none focus:border-indigo-500"
          />
          <div className="mt-2 text-right text-sm text-slate-500">
            {comment.length}/500 characters
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border px-5 py-2 hover:bg-slate-100 hover:cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-xl bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 hover:cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
