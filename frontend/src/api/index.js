import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

// Auth
export const login = (formData) =>
  API.post("/login", formData, { withCredentials: true });
export const signUp = (formData) =>
  API.post("/signup", formData, { withCredentials: true });
export const logout = () => API.get("/logout", { withCredentials: true });
export const getAuthenticatedUserObject = () =>
  API.get("/getauthuser", { withCredentials: true }); // withCredentials tells axios to send cookies in requests

// User
export const getUserObject = (id) => API.get("/user/" + id);

// Calculation
export const createCalculation = (newCalculation) =>
  API.post("/calculation/create", newCalculation, { withCredentials: true });
export const getCalculation = (id) => API.get("/calculation/" + id);
