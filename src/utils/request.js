import axios from "axios";
import router from "../router/index";

export const baseUrl = process.env.VUE_APP_BASE_API;

axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(
  function (config) {
    let accessToken = localStorage.getItem("accessToken");
    if (config.params) {
      config.params.accessToken = accessToken;
    }
    if (config.data) {
      config.data.accessToken = accessToken;
    }
    if (!accessToken) {
      router.push(`/error`);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    if (response.status === 204) {
    }
    return response;
  },
  function (error) {
    if (error.response.data.code === -9) {
      router.push(`/error`);
    } else if (error.response.data.code === -7) {
      router.push(`/error`);
    } else if (error.response.data.code === -5) {
      router.push(`/error`);
    } else {
      return Promise.reject(error);
    }
  }
);

export default axios;
