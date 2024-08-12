// access_token_generator.js

import axios from 'axios';

const AUTH_URL = "https://outpost.mappls.com/api/security/oauth/token";
const CLIENT_ID =
  "96dHZVzsAuvHO6JHZGeCw7oW47HTvvExE23_al6SbgTmytW1biRgLZ7GrkrftHE2vZlB43rPg5TYQwBs7escAg==";
const CLIENT_SECRET =
  "lrFxI-iSEg9F0k8bXZyFqE2NTuLzyEhK9r5TMq--pxVbgAKlJU9fIqeTXylwoyjayPhny18c1opgkLEXu1OR3rNA-n2zxSXE";

export const generateAccessToken = async () => {
  try {
    const response = await axios.post(
      AUTH_URL,
      `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
};
