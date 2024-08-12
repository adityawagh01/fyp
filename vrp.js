// Step 1: npm install routific

// Step 2: Initialize client
const Routific = require('routific')

// This is your demo token
const token   = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1MzEzZDZiYTNiMDBkMzA4MDA2ZTliOGEiLCJpYXQiOjEzOTM4MDkwODJ9.PR5qTHsqPogeIIe0NyH2oheaGR-SJXDsxPTcUQNq90E'

const options = {token: token}
const client  = new Routific.Client(options);

// Step 3: Initialize VRP service
const vrp = new Routific.Vrp();

// Step 4: Add your visits
const visits = [
  {
    id: "visit_1",
    location: {name: "wardha", lat: 20.83616124688287, lng: 78.5912538967032}
  },
  {
    id: "visit_2",
    location: {name: "katol", lat: 21.3280321643057, lng : 78.56275888754627}
  },
  {
    id: "visit_3",
    location: {name: "amravati", lat: 20.992539688035073, lng : 77.80051739259874}
  }
]

visits.map((visit) => {
  vrp.addVisit(visit.id, visit);
})

// Step 5: Add your vehicles
const vehicles = [
  {
    id: "vehicle_1",
    start_location: {
        id: "ngp_hub",
        lat: 21.14889886500973,
        lng: 79.08761165116903
    },
    end_location: {
        id: "ngp_hub",
        lat: 21.14889886500973,
        lng: 79.08761165116903
    }
  }
]

vehicles.map((vehicle) => {
  vrp.addVehicle(vehicle.id, vehicle);
})

// Step 6: Add traffic speed
vrp.addOption("traffic", "slow");

// Step 7: Send request
client.route(vrp, (err, solution, jobId) => {
  if (err) {
    console.log("An error occurred");
    console.log(err);
  } else if (solution.status == "success") {
    console.log("Solution is:")
    console.log(solution.solution)
  }
})