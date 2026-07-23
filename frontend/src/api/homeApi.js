import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const getHomes = async () => {
    try {
        const res = await API.get("/homes");
        return res.data.homes;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getHomeDetails = async (homeId) => {
    try {
        const res = await API.get(`/homes/${homeId}`);
        return res.data?.home ?? res.data;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
};

export const getFavouriteHomes = async () => {
  try {
    const res = await API.get(`/favourites`);
    return res.data?.favourites;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const removeFavourite = async (homeId) => {
  try {
    const res = await API.post(`/favourite/delete/${homeId}`);
    return res.data?.message;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addHomeToFavourites = async (homeId) => {
  try {
    const res = await API.post(`/favourites/${homeId}`);
    return res.data?.message;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const bookHome = async (homeId, bookingData) => {
  try {
    const res = await API.post(`/homes/${homeId}/book`, bookingData);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};