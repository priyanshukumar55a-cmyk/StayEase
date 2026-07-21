import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/api/authApi";
import { toast } from "sonner";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  if (!user) return null;

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (loading) return;
      setLoading(true);
      const data = new FormData();

      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("bio", formData.bio);

      if (image) {
        data.append("profileImage", image);
      }

      const res = await updateProfile(data);
      setUser(res.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6">
      <div className="mx-auto max-w-2xl">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-8">
            <h1 className="mb-8 text-3xl font-bold text-white">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-28 w-28 border-2 border-rose-500">
                    <AvatarImage src={preview} />
                    <AvatarFallback className="bg-rose-500 text-2xl font-bold text-white">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-400 p-2 text-white"
                  >
                    <Camera className="h-4 w-4" />
                  </label>

                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden bg-amber-200"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-zinc-300">First Name</label>

                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-zinc-300">Last Name</label>

                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-zinc-300">Bio</label>

                <Textarea
                  rows={4}
                  maxLength={250}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full border border-amber-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
