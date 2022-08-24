import axios from "axios";

export const headers = {
  "Content-Type": "application/json"
}

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
