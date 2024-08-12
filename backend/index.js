// index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { assignNearestHub } from "./nearestHubFinder.js";
import { Order } from "./schema.js";
import getRoute from "./tsp.js";
import truckCapacityMap from "./truckInfo.js";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://fypproject:fyp@fypproject.i5fgxjm.mongodb.net/fypProject?retryWrites=true&w=majority&appName=FypProject";

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected");
  } catch (err) {
    console.log(err);
  }
}

connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/findNearestHub", async (req, res) => {
  try {
    let srcLoc = req.body.srcLoc;
    let srcLatLong = req.body.srcLatLong;
    let latLongUsed = req.body.latLongUsed;
    let truckType = req.body.truckType;
    let itemType = req.body.itemType;
    let weight = req.body.weight;
    console.log(req.body);
    const result = await assignNearestHub(
      srcLoc,
      srcLatLong,
      latLongUsed,
      truckType,
      itemType,
      weight
    );
    // console.log(result);
    res.send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/placeOrder", async (req, res) => {
  res.send("response received");
});
app.post("/getOrders", async (req, res) => {
  console.log(req.body.itemType);
  try {
    if (req.body.itemType === "default") {
      let hub = req.body.hub;
      let data;
      // console.log("hub = ", hub);
      data = await Order.find({ hub: hub });
      // console.log("data=", data);
      let result = [];
      for (let i = 0; i < data.length; i++) {
        let arr = [data[i].srcloc, data[i].eloc, data[i].uuid];
        // console.log("arr", arr);
        result.push(arr);
      }
      // console.log("result = ", result);
      res.send(result);
    } else {
      console.log("itemType in else", req.body.itemType);
      let hub = req.body.hub;
      let itemType = req.body.itemType;
      let data;
      // console.log("hub = ", hub);
      data = await Order.find({ hub: hub, itemType: itemType });
      console.log("data=", data);
      let result = [];
      for (let i = 0; i < data.length; i++) {
        let arr = [data[i].srcloc, data[i].eloc, data[i].uuid];
        // console.log("arr", arr);
        result.push(arr);
      }
      // console.log("result = ", result);
      res.send(result);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/getTruckInfo", async (req, res) => {
  let hub = req.body.hub;
  let itemType = req.body.itemType;

  // let hub = "Nagpur";
  // let itemType = "Dairy_Produce";

  console.log(hub, itemType);
  let data,
    trucksReq = 0;
  // console.log("hub = ", hub);
  data = await Order.find({ hub: hub, itemType: itemType });
  console.log("data=", data);
  let truckType = data[0].truckType;
  let weights = [];
  data.forEach((o) => {
    weights.push(o.weight);
  });

  let truckCapacity = Object.entries(truckCapacityMap).find(
    (entry) => entry[0] === truckType
  )[1];
  // console.log();
  // const truckCapacity = 10000;

  const totalWeight = weights.reduce(
    (acc, weight) => acc + parseInt(weight),
    0
  );

  trucksReq = totalWeight / truckCapacity;
  trucksReq = Math.ceil(trucksReq);
  // return finalWeight;
  console.log(trucksReq);
  res.send([trucksReq, truckType]);
});

app.post("/getOrderRoute", async (req, res) => {
  let eLocs = req.body.eLocs;
  const tspRes = await getRoute(eLocs);
  res.send(tspRes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
