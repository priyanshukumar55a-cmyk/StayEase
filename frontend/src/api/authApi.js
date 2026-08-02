import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: import.meta.env.VITE_API_URL,
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

export const forgotPassword = async (payload) => {
  const res = await API.post("/auth/forgot-password", payload);
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await API.post("/auth/reset-password", payload);
  return res.data;
};

export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get("/auth/profile", { withCredentials: true });

  return res.data;
};

export const updateProfile = async (data) => {
  try {
    const res = await API.patch("/auth/profile/edit", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
