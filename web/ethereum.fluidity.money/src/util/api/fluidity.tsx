import axios from "axios";

export const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": `${process.env.REACT_APP_API_URL}`,
  'Access-Control-Allow-Methods': 'POST',
}

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
