// nearestHubFinder.js
import fetch from "node-fetch";
import statesData from "./hub.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const AUTH_URL = "https://outpost.mappls.com/api/security/oauth/token";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REST_KEY = process.env.REST_KEY;
let ACCESS_TOKEN = "";

const geocodeAPI = `https://atlas.mappls.com/api/places/geocode?address=`;
const reversegeocodeAPI = `https://apis.mappls.com/advancedmaps/v1/${REST_KEY}/rev_geocode?`;
const distanceAPI = `https://apis.mappls.com/advancedmaps/v1/${REST_KEY}/distance_matrix/trucking/`;

const generateAccessToken = async () => {
  try {
    const response = await axios.post(
      AUTH_URL,
      `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    ACCESS_TOKEN = accessToken;
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw error;
  }
};

async function makeAPICall(endpoint, header) {
  const response = await fetch(endpoint, header);
  const data = await response.json();
  return data;
}

async function makeMultipleAPICalls(endpoints, header) {
  const promises = endpoints.map((endpoint) => makeAPICall(endpoint, header));
  const responses = await Promise.all(promises);
  return responses;
}

export const findNearestHub = async (eLoc_src,state_src) => {
  try {
    // if (ACCESS_TOKEN === "") {
    //   await generateAccessToken();
    // }
    // let geocodeAPI_final = geocodeAPI + encodeURIComponent(location);

    // let apiResponse = await fetch(geocodeAPI_final, {
    //   headers: {
    //     Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the API key in the Authorization header
    //   },
    // });

    // if (apiResponse.status === 401) {
    //   // Access token is invalid or expired
    //   console.log("Access token is invalid or expired. Refreshing...");
    //   await generateAccessToken(); // Refresh the access token
    //   // Retry the request with the new access token
    //   apiResponse = await fetch(geocodeAPI_final, {
    //     headers: {
    //       Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the new access token in the Authorization header
    //     },
    //   });
    // }

    // let responseData = await apiResponse.json();
    // const eLoc_pickup = responseData.copResults.eLoc;
    // const stateDetected = responseData.copResults.state;
    // const statesData = await getAllHubs();
    const cities = statesData[state_src];

    let minDistance = Infinity;
    let cityWithMinDistance = "";
    // const apiCalls = [];
    // for (const city in cities) {
      // geocodeAPI_final = geocodeAPI + encodeURIComponent(cities[city]);
      // apiResponse = fetch(geocodeAPI_final, {
      //   headers: {
      //     Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the API key in the Authorization header
      //   },
      // });
    //   apiCalls.push(apiResponse);
      // responseData = await apiResponse.json();
      // const eLoc_city = responseData.copResults.eLoc;

    //   // let distanceAPI_final =
    //   //   distanceAPI + encodeURIComponent(eLoc_pickup + ";" + eLoc_city);
    //   // apiResponse = await fetch(distanceAPI_final);
    //   // responseData = await apiResponse.json();
    //   // const distance = responseData.results.distances[0][1];

    //   // if (distance < minDistance) {
    //   //   minDistance = distance;
    //   //   cityWithMinDistance = cities[city];
    //   // }
    // }
    // const headers = {
    //   headers: {
    //     Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the API key in the Authorization header
    //   },
    // };
    // const responses = await makeMultipleAPICalls(apiCalls, headers);
    // const responses = await Promise.allSettled(apiCalls);
    // console.log(responses);
    for (let i = 0; i < cities.length; i++) {
      console.log("access token = ", ACCESS_TOKEN);
      // responseData = await responses[i].value.json();
      // console.log(responseData);
      // let place = responseData.copResults.city;
      const eLoc_city = cities[i][1];
      // console.log("city = ", responseData.copResults.city);
      // console.log(responseData.copResults.eLoc);
      // responseData = await apiResponse.json();

      let distanceAPI_final =
        distanceAPI + encodeURIComponent(eLoc_src + ";" + eLoc_city);
      let apiResponse = await fetch(distanceAPI_final);
      let responseData = await apiResponse.json();
      const distance = responseData.results.distances[0][1];

      if (distance < minDistance) {
        minDistance = distance;
        cityWithMinDistance = cities[i][0];
      }
    }
    return cityWithMinDistance;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const assignNearestHub = async (locations) => {
  console.log(locations);
  
  try {
    if (ACCESS_TOKEN === "") {
      await generateAccessToken();
    }
    let cityHub = {};
    console.log("locations = ", locations);
    let hub;
    const user_id = uuidv4();
    console.log(user_id);
    for (let i = 0; i < locations.length; i++) {
      console.log("city = ", locations[i]);
      let geocodeAPI_final = geocodeAPI + encodeURIComponent(locations[i]);
      let apiResponse = await fetch(geocodeAPI_final, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the API key in the Authorization header
        },
      });
      let responseData = await apiResponse.json();
      const eLoc = responseData.copResults.eLoc;
      const state_detected = responseData.copResults.state;
      hub = await findNearestHub(eLoc,state_detected);
      console.log("hub----");
      console.log(hub);
      if (cityHub[hub] !== undefined) {
        cityHub[hub].push(locations[i]);
      } else {
        cityHub[hub] = [locations[i]];
      }
    }

    return [hub, user_id];
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
};
