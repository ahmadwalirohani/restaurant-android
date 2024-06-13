import axios from "axios";
import { useRouter } from "vue-router";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: "http://192.168.10.2/api" });

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
api.interceptors.request.use((config) => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("accessToken");

  // If token is found
  if (token) {
    // Get request headers and if headers is undefined assign blank object
    config.headers = config.headers || {};

    // Set authorization header
    // ℹ️ JSON.parse will convert token to string
    config.headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : "";
  }

  // Return modified config
  return config;
});

// ℹ️ Add response interceptor to handle 401 response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error
    console.log(error);
    if (error.response.status === 401) {
      // ℹ️ Logout user and redirect to login page
      // Remove "userData" from localStorage
      localStorage.removeItem("userData");

      // Remove "accessToken" from localStorage
      localStorage.removeItem("accessToken");

      // If 401 response returned from api
      // router.push('/login');
      useRouter().push("login");
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
