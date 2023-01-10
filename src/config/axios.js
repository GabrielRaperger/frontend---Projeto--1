import axios from "axios";

const success = (res) => res;
const error = (error) => {
  if (401 === error.response.status) window.location = "/auth/signin";
  else return Promise.reject(error);
};

axios.interceptors.response.use(success, error);
