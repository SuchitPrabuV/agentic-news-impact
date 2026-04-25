import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export const fetchNews = async (sectors) => {
  const response = await API.get(
    `/api/news?sectors=${sectors.join(",")}`
  );
  return response.data;
};

export const fetchPrediction = async (article) => {
  const response = await API.post("/api/predict", article);
  return response.data;
};