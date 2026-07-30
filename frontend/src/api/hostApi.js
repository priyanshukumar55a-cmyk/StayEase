import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const getHostDashboardStats = async () => {
  const res = await API.get(`/host/dashboard`);
  return res.data;
};

export const getHostBookings = async (status, search) => {
  const res = await API.get(
    `/host/bookings?status=${status}&search=${encodeURIComponent(search.trim())}`,
  );

  return res.data;
};

export const updateBookingRequest = async (bookingId, status) => {
  const res = await API.patch(`/host/bookings/${bookingId}`, {
    status,
  });

  return res.data;
};

export const getHostReviews = async () => {
  const res = await API.get(`/host/reviews`);

  return res.data;
};
