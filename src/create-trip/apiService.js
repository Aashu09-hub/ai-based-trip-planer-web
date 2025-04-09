import axios from "axios";

const API_URL = "https://navitime-maps.p.rapidapi.com/map_script?host=localhost"; 
const API_KEY = REACT_APP_RAPIDAPI_KEY;

const options = {
  method: "GET",
  url: API_URL,
  headers: {
    "X-RapidAPI-Key": '57c826d078mshc2908e446f28b64p1a14bcjsnda191eb7828a',
    "X-RapidAPI-Host": ' navitime-maps.p.rapidapi.com' , 
  },
};

export const fetchData = async () => {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
