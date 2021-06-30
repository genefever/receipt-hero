import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

// Auth
// withCredentials tells axios to send cookies in requests
export const login = (formData) =>
  API.post("/auth/login", formData, { withCredentials: true });
export const signUp = (formData) =>
  API.post("/auth/signup", formData, { withCredentials: true });
export const logout = () => API.get("/auth/logout", { withCredentials: true });
export const getAuthenticatedUser = () =>
  API.get("/auth/getuser", { withCredentials: true });
export const forgotPassword = (formData) => API.post("/auth/forgot", formData);
export const resetPassword = (token, formData) =>
  API.post(`/auth/reset/${token}`, formData);

// User
export const getUser = (id) => API.get("/user/" + id);

// Calculation
export const createCalculation = (newCalculation) =>
  API.post("/calculation/create", newCalculation, { withCredentials: true });
export const getCalculation = (id) => API.get(`/calculation/${id}`);
export const deleteCalculation = (id) =>
  API.delete(`/calculation/${id}/delete`, { withCredentials: true });
export const updateCalculation = (calculationObject) =>
  API.put(`/calculation/${calculationObject._id}/edit`, calculationObject, {
    withCredentials: true,
  });
