import { Pencil, Star, Trash2 } from "lucide-react";
import React from "react";

export const ReviewsModal = ({ review, setDeleteReview, setEditingReview }) => {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <img
            src={review.guest.profileImage || "/default-avatar.png"}
            alt={review.guest.firstName}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-blue-300"
          />

          <div>
            <h3 className="font-semibold">
              {review.guest.firstName} {review.guest.lastName}
            </h3>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              ✓ Verified Stay
            </span>

            <div className="mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {review.isOwner && (
          <div className="flex sm:gap-2">
            <button
              onClick={() => setEditingReview(review)}
              className="rounded-lg px-3 p-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={() => setDeleteReview(review)}
              className="rounded-lg px-3 p-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 leading-7 text-slate-600">{review.comment}</p>
    </>
  );
};

export default ReviewsModal;
