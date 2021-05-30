import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

export const login = (formData) => API.post("/login", formData);
export const signUp = (formData) => API.post("/signup", formData);
export const logout = () => API.get("/logout");

export const getUserObject = () =>
  API.get("/getuser", { withCredentials: true }); // withCredentials tells axios to send cookies in requests
