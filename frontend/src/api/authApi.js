import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data.user;
};

export const signupUser = async (userData) => {
  const res = await API.post("/auth/signup", userData);
  return res.data.user;
};

export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get("/auth/profile", { withCredentials: true });

  return res.data;
};