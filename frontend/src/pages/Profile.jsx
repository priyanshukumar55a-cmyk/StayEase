import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Mail,
  User,
  CheckCircle,
  XCircle,
  BookOpen,
  Pencil,
  PencilLine,
  Heart,
} from "lucide-react";
import { getProfile } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@base-ui/react";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-black/80" />
        <span className="text-3xl text-black/80">Loading...</span>
      </div>
    );
  }
  const [stats, setStats] = useState({
    bookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
  });
  const fetchUserData = async () => {
    try {
      const userData = await getProfile();
      setStats(userData.stats);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div>
          <div className="flex gap-4">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <Link to="/profile/edit">
              <Button
                className={
                  "text-black/80 text-md hover:cursor-pointer bg-amber-200 flex py-1 px-1.5 rounded-xl gap-1 hover:bg-amber-300 hover:underline hover:text-blue-600"
                }
              >
                <PencilLine className="h-4 w-4 mt-0.5" /> Edit Profile
              </Button>
            </Link>
          </div>
          <p className="text-zinc-400">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-zinc-800 bg-zinc-800/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-center">
              <Avatar className="h-20 w-20 border-2 border-rose-500">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-rose-500 text-2xl font-bold text-white">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>

                <div className="mt-2 flex items-center justify-center gap-2 text-zinc-400 md:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>

                <div className="mt-2 flex items-center justify-center gap-2 text-zinc-400 md:justify-start">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Badge className="mt-3 md:mr-2 bg-green-500 hover:bg-emerald-500">
                  Active Member
                </Badge>
                <Badge
                  className={`${user.userType === "host" ? "bg-purple-600 mr-2" : "bg-blue-600 mr-2"}`}
                >
                  {user.userType === "host" ? "Host" : "Guest"}
                </Badge>
                <Badge
                  className={user.isVerified ? "bg-green-500" : "bg-red-500"}
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                </Badge>
                {user.bio.trim.length !== 0 ? (
                  <p className="mt-2 max-w-xl text-sm text-zinc-300">
                    {user.bio}
                  </p>
                ) : (
                  <p className="mt-2 text-sm italic text-zinc-500">
                    No bio added yet.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 justify-center ml-5">
          <Card className="border-zinc-800 bg-zinc-800/50 h-35 w-35 sm:h-45 sm:w-45">
            <CardContent className="flex flex-col items-center p-6">
              <BookOpen className="mb-2 h-8 w-8 text-blue-400" />
              <h3 className="text-3xl font-bold text-white">
                {stats.bookings}
              </h3>
              <p className="text-zinc-400">Bookings</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-800/50 h-35 w-35 sm:h-45 sm:w-45">
            <CardContent className="flex flex-col items-center p-6">
              <Heart className="mb-2 h-8 w-8 text-pink-400" />
              <h3 className="text-3xl font-bold text-white">
                {user.favourites.length}
              </h3>
              <p className="text-zinc-400">Wishlist</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-800/50 h-35 w-35 sm:h-45 sm:w-45">
            <CardContent className="flex flex-col items-center p-6">
              <CheckCircle className="mb-2 h-8 w-8 text-emerald-400" />
              <h3 className="text-3xl font-bold text-white">
                {stats.confirmedBookings}
              </h3>
              <p className="text-zinc-400">Confirmed</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-800/50 h-35 w-35 sm:h-45 sm:w-45">
            <CardContent className="flex flex-col items-center p-6">
              <XCircle className="mb-2 h-8 w-8 text-red-400" />
              <h3 className="text-3xl font-bold text-white">
                {stats.cancelledBookings}
              </h3>
              <p className="text-zinc-400">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="space-y-6 p-6">
            <h3 className="text-xl font-semibold text-white">
              Account Information
            </h3>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-rose-400" />
                <div>
                  <p className="text-sm text-zinc-400">Full Name</p>
                  <p className="font-medium text-white">
                    {user.firstName + " " + user.lastName}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-5">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Email</p>
                    <p className="font-medium text-white">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-5">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-zinc-400">Member Since</p>
                    <p className="font-medium text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
