// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://customer-node.rupioo.com",
//   // baseURL: "https://node.rupioo.com",
// });

// export default instance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://node.rupioo.com",
});

axiosInstance.interceptors.request.use((config) => {
  // Get the current subdomain
  const subdomain = window.location.hostname.split(".")[0];
  // Check subdomain and set base URL accordingly
  if (subdomain === "customer") {
    config.baseURL = "https://customer-node.rupioo.com";
  } else if (subdomain === "admin") {
    config.baseURL = "https://node.rupioo.com";
  } else {
    // config.baseURL = "https://node.rupioo.com";
    config.baseURL = "https://production-node.rupioo.com";
  }

  return config;
});

export default axiosInstance;
