import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

export const login = (formData) =>
  API.post("/login", formData, { withCredentials: true });
export const signUp = (formData) =>
  API.post("/signup", formData, { withCredentials: true });
export const logout = () => API.get("/logout", { withCredentials: true });

export const getAuthenticatedUserObject = () =>
  API.get("/getauthuser", { withCredentials: true }); // withCredentials tells axios to send cookies in requests
export const getUserObject = (id) => API.get("/user/" + id);
export const createCalculation = (newCalculation) =>
  API.post("/calculations/create", newCalculation, { withCredentials: true });
