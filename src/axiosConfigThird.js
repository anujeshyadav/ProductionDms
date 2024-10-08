import axios from "axios";

const instance = axios.create({
  baseURL: "https://node-hrm.rupioo.com/",
  // baseURL: "https://node.rupioo.com",
});

export default instance;
