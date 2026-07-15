import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

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
        return res.data.home;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
};