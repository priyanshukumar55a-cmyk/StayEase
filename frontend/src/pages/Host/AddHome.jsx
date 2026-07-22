import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button, Input } from "@base-ui/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export default function AddHome({ editing = false, home = {} }) {
  const [preview, setPreview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { homeId } = useParams();

  const [formData, setFormData] = useState({
    homeName: "",
    price: "",
    address: "",
    description: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!editing) return;

    const fetchHome = async () => {
      try {
        const res = await axios.get(`${API_URL}/host/edit-home/${homeId}`, {
          withCredentials: true,
        });

        setPreview(res.data.photo);

        setFormData({
          homeName: res.data.homeName || "",
          price: res.data.price || "",
          address: res.data.address || "",
          description: res.data.description || "",
        });
      } catch (error) {
        toast.error("Failed to load home");
      }
    };

    fetchHome();
  }, [editing, homeId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    if (photo) {
      payload.append("photo", photo);
    }

    if (editing) {
      payload.append("id", homeId || home._id);
    }

    try {
      const endpoint = editing
        ? `${API_URL}/host/edit-home`
        : `${API_URL}/host/add-home`;
      const res = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      toast.success(
        res.data.message ||
          (editing ? "Home updated successfully" : "Home added successfully"),
      );
      setTimeout(() => {
        navigate("/host");
      }, 1000);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        "Failed to submit the form. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-blue-300">
      <Card className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-300 my-5">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-blue-600 to-cyan-400 bg-clip-text text-transparent text-center mb-2 drop-shadow">
          🏡 {editing ? "Edit" : "Add"} Your Home
        </h1>

        <p className="text-lg text-center mb-6 font-semibold text-emerald-600">
          Create or update your listing and{" "}
          <span className="text-pink-500">start earning!</span>
        </p>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-60 w-full rounded-xl object-cover"
          />
        )}

        <Form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="homeName"
              value={formData.homeName}
              onChange={handleChange}
              placeholder="Enter your house name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />

            <div className="relative">
              <span className="absolute left-2 right-1/2 top-1/2 -translate-y-1/2">
                ₹
              </span>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price Per Night"
                required
                className="w-full pl-5 py-2 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Location of your home"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />

          <Input
            type="file"
            name="photo"
            required={!editing}
            accept="image/jpg,image/jpeg,image/png"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />

          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your home"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          ></Textarea>
          <p className="text-right text-xs text-zinc-500">
            {formData.description.length}/500
          </p>

          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white py-2 rounded-lg font-extrabold shadow-lg hover:from-pink-500 hover:to-indigo-600 hover:scale-105 transition-all duration-300 cursor-pointer tracking-wide text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-white" />
                <span>{editing ? "Updating home..." : "Adding home..."}</span>
              </div>
            ) : editing ? (
              "Update Home"
            ) : (
              "Add Home"
            )}
          </Button>
        </Form>
      </Card>
    </main>
  );
}
