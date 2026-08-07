import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const createOrder = async (data) => {
  const res = await API.post("/api/payment/create-order", data);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await API.post("/api/payment/verify-payment", data);
  return res.data;
};
