import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

export const login = (formData) => API.post("/login", formData);
export const signUp = (formData) => API.post("/signup", formData);
export const googleLogin = (formData) => API.get("/auth/google");
export const googleLoginCallback = (formData) =>
  API.get("/auth/google/callback");
