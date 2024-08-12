import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const AUTH_URL = 'https://outpost.mappls.com/api/security/oauth/token';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Correct export syntax
export let ACCESS_TOKEN = '';

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
        ACCESS_TOKEN = accessToken;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
};

// Since you cannot use await in the top-level scope, you can invoke the function immediately
// in an IIFE (Immediately Invoked Function Expression)
(async () => {
    if (ACCESS_TOKEN === '') {
        await generateAccessToken();
    }
})();

// Exporting ACCESS_TOKEN directly is fine
export { ACCESS_TOKEN };
