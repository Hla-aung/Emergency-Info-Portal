import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const ApiManager = axios.create({
  baseURL: API_BASE_URL,
});
