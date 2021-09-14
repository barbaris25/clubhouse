import Axios from "axios";

const instance = Axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    config.headers.Authorization = window.localStorage.getItem("token");
  }

  return config;
});

export default instance;
