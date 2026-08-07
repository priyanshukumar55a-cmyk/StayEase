import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addHomeToFavourites,
  deleteMyReview,
  editReview,
  getCanReview,
  getHomeDetails,
  getHomeReviews,
  removeFavourite,
} from "@/api/homeApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { Loader2, Star, Heart, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import ReviewsModal from "@/components/ReviewsModal";
import { Button } from "@base-ui/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import HomeDetailsSkeleton from "@/components/skeletons/HomeDetailsSkeleton";

export default function HomeDetails() {
  const { homeId } = useParams();

  const [home, setHome] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingReview, setLoadingReview] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [deleteReview, setDeleteReview] = useState(null);

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHome();
    fetchReviews();
    fetchCanReview();
  }, [homeId]);

  const fetchHome = async () => {
    try {
      const home = await getHomeDetails(homeId);
      setHome(home);
      setIsFavourite(Boolean(home?.isFavourite));
    } catch (err) {
      console.error(err);
    }
  };
  const fetchReviews = async () => {
    try {
      const data = await getHomeReviews(homeId);
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReview(false);
    }
  };
  const fetchCanReview = async () => {
    try {
      const res = await getCanReview(homeId);
      setCanReview(res.canReview);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavourite = async () => {
    try {
      setLoading(true);
      if (isFavourite) {
        await removeFavourite(homeId);
        setIsFavourite(false);
        toast.success("Removed from wishlist");
      } else {
        await addHomeToFavourites(homeId);
        setIsFavourite(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const data = await deleteMyReview(deleteReview._id);
      toast.success("Review deleted successfully");
      setDeleteReview(null);

      fetchReviews();
      fetchHome();
      fetchCanReview();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleEditReview = async () => {
    try {
      setSaving(true);
      await editReview(editingReview._id, {
        rating: editRating,
        comment: editComment,
      });
      toast.success("Review updated");
      setEditingReview(null);
      fetchReviews();
      fetchHome();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update review");
    } finally {
      setSaving(false);
    }
  };

  if (!home || loadingReview) {
    return <HomeDetailsSkeleton />;
  }

  const lat = home?.location?.coordinates?.[1];
  const lng = home?.location?.coordinates?.[0];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-3 text-4xl font-bold text-card-foreground">
            {home.homeName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {home.averageRating?.toFixed(1) || "New"}
              </span>

              <span className="text-slate-500">
                ({home.reviewCount || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="h-4 w-4" />
              {home.address}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 overflow-hidden rounded-3xl shadow-xl">
          <img
            src={home.photo}
            alt={home.homeName}
            className="h-100 md:h-145 w-full object-cover"
          />

          <button
            onClick={handleFavourite}
            className="absolute right-4 top-4 rounded-full bg-card p-3 shadow-lg transition hover:scale-110 hover:cursor-pointer"
          >
            <Heart
              className={`h-6 w-6 transition-all duration-300 ${
                isFavourite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-slate-500"
              }`}
            />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Left */}
          <div>
            {/* Description */}
            <section className="rounded-2xl bg-card p-5 sm:p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">About this place</h2>

              <p className="leading-8 text-slate-600">{home.description}</p>
            </section>

            {/* Amenities */}
            <section className="mt-8 rounded-2xl bg-card p-3 sm:p-6 shadow-sm">
              <h2 className="mb-5 ml-2 text-2xl font-bold mt-2 sm:mt-0">Amenities</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-muted p-4">🏠 Entire Home</div>

                <div className="rounded-xl bg-muted p-4">📶 Free WiFi</div>

                <div className="rounded-xl bg-muted p-4">
                  🚿 Private Bathroom
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  🚗 Free Parking
                </div>
              </div>
            </section>

            {/* Map */}
            <section className="mt-8 rounded-2xl bg-white p-3 sm:p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold ml-2">Location</h2>

              {lat && lng ? (
                <div className="overflow-hidden rounded-2xl">
                  <MapContainer
                    center={[lat, lng]}
                    zoom={13}
                    className="h-100 w-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[lat, lng]}>
                      <Popup>
                        <strong>{home.homeName}</strong>
                        <br />₹{home.price}/night
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <p className="text-red-500">Location not available</p>
              )}
            </section>

            {/* Reviews */}
            <section className="mt-8 rounded-2xl bg-card p-3 sm:p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold ml-2">
                  Reviews ({reviews.length})
                </h2>

                {canReview && (
                  <Link
                    to={`/homes/${homeId}/review`}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Write Review
                  </Link>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                  No reviews yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews?.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition hover:shadow-lg"
                    >
                      <ReviewsModal
                        review={review}
                        setDeleteReview={setDeleteReview}
                        setEditingReview={setEditingReview}
                      />
                      <AlertDialog
                        open={!!deleteReview}
                        onOpenChange={(open) => {
                          if (!open) setDeleteReview(null);
                        }}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:cursor-pointer">
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={handleDeleteReview}
                              className="bg-red-600 hover:bg-red-700 hover:cursor-pointer"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Dialog
                        open={!!editingReview}
                        onOpenChange={(open) => !open && setEditingReview(null)}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Review</DialogTitle>
                          </DialogHeader>

                          {/* Rating */}
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                onClick={() => setEditRating(star)}
                                className={`cursor-pointer ${
                                  star <= editRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <Textarea
                            value={editComment}
                            maxLength={500}
                            onChange={(e) => setEditComment(e.target.value)}
                          />
                          <div className="text-right text-sm text-slate-500">
                            {editComment.length}/500 characters
                          </div>

                          <Button
                            disabled={saving}
                            onClick={handleEditReview}
                            className="hover:cursor-pointer border border-gray-500 rounded-2xl py-1 bg-green-200 hover:bg-green-300"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                                Saving Changes...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="sticky top-24 rounded-3xl bg-white px-3 py-4 sm:p-6 shadow-xl">
              <div className="mb-5">
                <span className="text-4xl font-extrabold text-emerald-600">
                  ₹{home.price}
                </span>

                <span className="ml-1 text-slate-500">/ night</span>
              </div>

              <button className="mb-3 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white transition hover:scale-[1.02] hover:cursor-pointer">
                <Link to={`/homes/${homeId}/book`}>Book Now</Link>
              </button>

              <button
                disabled={loading}
                onClick={handleFavourite}
                className={`w-full rounded-xl py-3 font-semibold transition hover:cursor-pointer dark:hover:text-black/80 ${
                  isFavourite
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "border hover:bg-slate-100"
                }`}
              >
                {isFavourite
                  ? loading
                    ? "Removing from Wishlist..."
                    : "Remove from Wishlist"
                  : loading
                    ? "Adding to Wishlist..."
                    : "Add to Wishlist"}
              </button>

              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-3">
                  <img
                    src={home.host?.profileImage || "/default-avatar.png"}
                    alt={home.host?.firstName}
                    className="h-8 w-8 sm:h-12 sm:w-12 rounded-full object-cover border border-blue-300"
                  />

                  <div>
                    <p className="font-semibold">
                      Hosted by {home.host?.firstName || "Host"}
                    </p>

                    <p className="text-sm text-slate-500">Verified Host</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                  <span className="font-semibold">
                    {home.averageRating?.toFixed(1) || "New"}
                  </span>

                  <span className="text-slate-500">
                    ({home.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
