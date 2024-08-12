import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const REST_KEY = process.env.REST_KEY;
const distanceAPI = `https://apis.mappls.com/advancedmaps/v1/${REST_KEY}/distance_matrix/driving/`;

function tsp(graph) {
    const n = graph.length;
    const memo = {}; // Memoization object to store computed values

    // Helper function to recursively compute the shortest path
    function dp(mask, pos) {
        if (mask === (1 << n) - 1) // All cities have been visited
            return [graph[pos][0], [pos]]; // Return to the starting city

        if (memo[mask] && memo[mask][pos]) // If already computed
            return memo[mask][pos];

        let minCost = Infinity;
        let minPath = [];

        // Try all possible next cities
        for (let next = 0; next < n; next++) {
            if ((mask & (1 << next)) === 0) { // If next city is not visited
                const newMask = mask | (1 << next); // Update the mask
                const [cost, path] = dp(newMask, next); // Compute cost and path
                const totalCost = graph[pos][next] + cost; // Total cost
                if (totalCost < minCost) {
                    minCost = totalCost;
                    minPath = [pos, ...path]; // Update minPath
                }
            }
        }

        // Memoize the result
        if (!memo[mask]) memo[mask] = {};
        memo[mask][pos] = [minCost, minPath];

        return [minCost, minPath];
    }

    // Start from any city, let's start from city 0
    const [minCost, minPath] = dp(1, 0); // 1 represents that city 0 has been visited, returning minCost and minPath
    minPath.push(0); // Add starting city at the end to complete the cycle
    return { minCost, minPath };
}

// // Example usage
// const graph = [
//     [0, 155, 59,272,85],
//     [155, 0, 107, 93,121],
//     [59, 107, 0, 201,81],
//     [272, 93, 201, 0, 198],
//     [85, 121, 81, 198, 0],
    
// ];





export default async function getRoute(eLocs) {
    // console.log("eLocs  in getRoute backend..",eLocs);
    const size=eLocs.length;
    const graph = new Array(size);
    for (let i = 0; i < size; i++) {
        // Initializing each index of 'graph' to an array of size n
        graph[i] = new Array(size).fill(0);
    }
    console.log("Graph:");
    console.log(graph);
    for (let i = 0; i < size-1; i++) {
        let str=eLocs[i];
        for (let j = i+1; j < size; j++){
            str=str+";"+eLocs[j];
        }
            
        let distanceAPI_final = distanceAPI + encodeURIComponent(str );
        // console.log(distanceAPI_final);
        let apiResponse = await fetch(distanceAPI_final);
        let responseData = await apiResponse.json();
        // console.log(responseData);
        const distances=responseData.results.distances[0];
        // console.log("distance array : ",distances);
        
        for (let j = i+1; j < size; j++){
            let distance = Math.floor(distances[j-i] / 1000);
            graph[i][j]=distance;
            graph[j][i]=distance;
        }
        
    }
    console.log("Graph:");
    console.log(graph);
    const { minCost, minPath } = tsp(graph);
    console.log("Minimum cost:", minCost);
    console.log("Minimum cost path:", minPath);

    return {minCost, minPath};
}
  
  // Example usage:
// const coordinates = [
// [21.14729, 79.08452], // Nagpur
// [21.27390, 78.58622], // Katol
// [20.93357, 77.75453], // Amravati
// [20.74442, 78.60251], // Wardha
// [20.70010, 77.00816]  // Akola
// ];

    // Example usage:
// const eLocs = [
//     "2yzrdy", // Nagpur
//     "e61814", // Katol
//     "2yzluu", // Amravati
//     "2z1qov", // Wardha
//     "2yzl1t"  // Akola
// ];