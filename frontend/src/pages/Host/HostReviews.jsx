import { getHostReviews } from "@/api/hostApi";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDateTime } from "@/components/dayFormat";
import ReviewSkeleton from "@/components/skeletons/ReviewSkeleton";

const HostReviews = () => {
  const [search, setSearch] = useState(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [reviewsStats, setReviewsStats] = useState({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    fiveStarReviews: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const stats = await getHostReviews();
        setReviewsStats(stats);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const reviews = reviewsStats.reviews;
  const filteredReviews = reviews
    .filter((review) => {
      const query = search?.trim().toLowerCase() || "";

      const matchesSearch =
        !query ||
        `${review.guest.firstName} ${review.guest.lastName}`
          .toLowerCase()
          .includes(query) ||
        review.home.homeName.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query);

      const matchesRating =
        ratingFilter === "all" || review.rating >= Number(ratingFilter);

      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);

        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  const averageRating = reviewsStats.averageRating,
    totalReviews = reviewsStats.totalReviews,
    fiveStarReviews = reviewsStats.fiveStarReviews;

  if (loading) {
    return (
      <ReviewSkeleton/>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reviews ({totalReviews})
          </h1>
          <p className="mt-1 text-slate-500">{totalReviews} guest reviews</p>
        </div>

        {/* Stats */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto">
          {/* Average Rating */}
          <div className="flex flex-col justify-center rounded-2xl bg-yellow-50 px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-2xl font-bold">{averageRating}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Average Rating</p>
          </div>

          {/* Total Reviews */}
          <div className="flex flex-col justify-center rounded-2xl bg-blue-50 px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{totalReviews}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Reviews</p>
          </div>

          {/* Five Star Reviews */}
          <div className="flex flex-col justify-center rounded-2xl bg-green-50 px-6 py-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-green-500 text-green-500"
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{fiveStarReviews}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">5-Star Reviews</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
        <div className="relative w-full sm:w-96">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest, property or comment..."
            className="pl-11"
          />
        </div>

        <div className="flex gap-3">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-40 hover:cursor-pointer">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐ (4+)</SelectItem>
              <SelectItem value="3">⭐⭐⭐ (3+)</SelectItem>
              <SelectItem value="2">⭐⭐ (2+)</SelectItem>
              <SelectItem value="1">⭐ (1+)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 hover:cursor-pointer">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-5">
        {totalReviews === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <MessageSquare className="h-8 w-8 text-indigo-500" />
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              No Guest Reviews Yet
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Once guests complete their bookings and leave feedback, their
              reviews and ratings will be displayed here.
            </p>

            <div className="mt-6 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
              ⭐ Great hosting leads to great reviews!
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300">
            <Search className="mb-3 h-10 w-10 text-slate-400" />
            <h3 className="font-semibold text-lg">No matching reviews</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try searching with a different guest or property name.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="rounded-xl border border-slate-200
                shadow-sm
                hover:shadow-lg p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex gap-3 items-center">
                      <img
                        src={review.guest.profileImage || "/default-avatar.png"}
                        alt={review.guest.firstName}
                        className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover border border-blue-300"
                      />
                      <h3 className="font-semibold text-md md:text-xl">
                        {review.guest.firstName} {review.guest.lastName}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      Stayed at : {review.home.homeName}
                    </p>

                    <div className="my-2 w-35 flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.rating}</span>
                    </div>

                    <p className="mt-2 text-base leading-7 text-slate-700">
                      "{review.comment}"
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {formatDateTime(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default HostReviews;
