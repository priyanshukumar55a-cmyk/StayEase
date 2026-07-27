import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
//   baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const getHostDashboardStats = async () => {
  const res = await API.get(`/host/dashboard`);
  return res.data;
};

export const getHostBookings = async (status) => {
    const res = await API.get(
        `/host/bookings?status=${status}`
    )

    return res.data;
}