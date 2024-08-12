import mongoose from "mongoose";

const hubSchema = new mongoose.Schema(
  {
    state: String,
    city: String,
  },
  { collection: "Hubs" }
);

const OrderSchema = new mongoose.Schema({
  eloc: String,
  lat: String,
  long: String,
  srcloc: String,
  uuid: String,
  hub: String,
  state: String,
  truckType: String,
  itemType: String,
  weight: String
});

const Hub = mongoose.model("Hub", hubSchema);

const Order = mongoose.model("Order", OrderSchema);

export { Hub, Order };
