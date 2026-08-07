import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const cancelBooking = async (bookingId) => {
  try {
    const res = await API.patch(`/bookings/${bookingId}/cancel`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const res = await API.get(`/bookings`);
    return res.data.bookings;
  } catch (err) {
    console.error(err);
    throw err;
  }
};