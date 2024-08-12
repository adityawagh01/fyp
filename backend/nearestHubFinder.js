// nearestHubFinder.js
import fetch from "node-fetch";
import statesData from "./hub.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { Order } from "./schema.js";
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

export const findNearestHub = async (eLoc_src, state_src) => {
  try {
    const cities = statesData[state_src];

    let minDistance = Infinity;
    let cityWithMinDistance = "";
    for (let i = 0; i < cities.length; i++) {
      const eLoc_city = cities[i][1];
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
const geteLocState = async (addressString) => {
  try {
    let geocodeAPI_final = geocodeAPI + encodeURIComponent(addressString);
    let apiResponse = await fetch(geocodeAPI_final, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`, // Include the API key in the Authorization header
      },
    });
    let responseData = await apiResponse.json();
    const eLoc = responseData.copResults.eLoc;
    const state_detected = responseData.copResults.state;
    return [eLoc, state_detected];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
export const assignNearestHub = async (srcLoc, srcLatLong, latLongUsed,truckType,itemType,weight) => {
  // console.log(srcLoc);

  try {
    if (ACCESS_TOKEN === "") {
      await generateAccessToken();
    }
    let allHub;
    const user_id = uuidv4();
    console.log(user_id);
    if (latLongUsed === false) {
      for (let i = 0; i < srcLoc.length; i++) {
        console.log("city = ", srcLoc[i]);
        const [eLoc, state_detected] = await geteLocState(srcLoc[i]);
        const hub = await findNearestHub(eLoc, state_detected);
        // console.log("hub----");
        // console.log(hub);
        allHub = hub;
        const newOrder = new Order({
          eloc: eLoc,
          srcloc: srcLoc[i],
          uuid: user_id,
          hub: hub,
          state: state_detected,
          truckType : truckType,
          itemType : itemType,
          weight : weight
        });
        newOrder.save();
      }
    } else {
      for (let i = 0; i < srcLatLong.length; i++) {
        console.log("latLong = ", srcLatLong[i]);
        let latLongQuery =
          "lat=" + srcLatLong[i].latitude + "&lng=" + srcLatLong[i].longitude;
        let reversegeocodeAPI_final = reversegeocodeAPI + latLongQuery;
        let apiResponse = await fetch(reversegeocodeAPI_final);
        let responseData = await apiResponse.json();
        // console.log(responseData);
        const address = responseData.results[0].city;
        console.log(address);
        const [eLoc, state_detected] = await geteLocState(address);
        const hub = await findNearestHub(eLoc, state_detected);
        console.log("eLoc----", eLoc);
        console.log("hub----", hub);
        allHub = hub;
        const newOrder = new Order({
          eloc: eLoc,
          lat: srcLatLong[i].latitude,
          long: srcLatLong[i].longitude,
          srcLoc: address,
          uuid: user_id,
          hub: hub,
          state: state_detected,
          truckType : truckType,
          itemType : itemType,
          weight : weight
        });
        newOrder.save();
      }
    }
    // let cityHub = {};
    // console.log("srcLoc = ", srcLoc);
    // let hub;

    return [allHub, user_id];
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
};
//21.123491878792002, 79.051512495426
