import axios from "axios";

const instance = axios.create({
  baseURL: "http://174.138.68.198:5000/images/",
});

export default instance;
