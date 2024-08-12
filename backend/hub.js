const statesData = {
    "Gujarat": [["Ahmedabad","gwrwkl"], ["Rajkot","t7szd4"], ["Surat","jpi3jl"]],
    "Madhya Pradesh": [["Bhopal","1bbcyj"], ["Indore","1bbd32"], ["Jabalpur","1bbbzl"]],
    "Maharashtra": [["Mumbai","2yzffw"], ["Aurangabad","2yzn9b"], ["Nagpur","2yzrdy"]],
    "Rajasthan": [["Jaipur","3t7xv6"], ["Udaipur","2z3484"], ["Jodhpur","2z288t"]],
    // Add more states as needed
  };
// import { Hub } from "./schema.js";
// async function getAllHubs() {
//   try {
//     // Fetch all data from the "Hubs" collection
//     const hubs = await Hub.find();
//     const stateCityMap = {};

//     // Iterate through the fetched data
//     hubs.forEach((hub) => {
//       const { state, city } = hub;

//       // If the state is not in the map, initialize an array for it
//       if (!stateCityMap[state]) {
//         stateCityMap[state] = [];
//       }

//       // Add the city to the array corresponding to the state
//       stateCityMap[state].push(city);
//     });

//     // Log or process the fetched data
//     console.log("All hubs:", stateCityMap);
//     return stateCityMap;
//   } catch (error) {
//     console.error("Error fetching hubs:", error);
//   }
// }

export default statesData; 
