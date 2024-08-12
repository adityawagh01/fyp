/* eslint-disable react/prop-types */
import { React, PropTypes, useState, useEffect } from "react";
import Select from "react-select";
import TextField from "@mui/material/TextField";

const productType = [
  { value: "Electronics", label: "Electronics" },
  { value: "Clothing", label: "Clothing" },
  { value: "Appliances", label: "Appliances" },
  { value: "Fresh_Produce", label: "Fresh Produce" },
  { value: "Dairy_Produce", label: "Dairy Produce" },
  { value: "Frozen_Goods", label: "Frozen Goods" },
  { value: "Pharmaceuticals", label: "Pharmaceuticals" },
  { value: "Chemicals", label: "Chemicals" },
  { value: "Packaged_Food", label: "Packaged Food" },
  { value: "Beverages", label: "Beverages" },
  { value: "Furniture", label: "Furniture" },
  { value: "Home_Goods", label: "Home Goods" },
  { value: "Auto_Comps", label: "Auto Comps" },
  { value: "Lumber", label: "Lumber" },
  { value: "Concrete", label: "Concrete" },
  { value: "Steel", label: "Steel" },
  { value: "Bricks_Tiles", label: "Bricks and Tiles" },
  { value: "Paper_Products ", label: "Paper Products " },
  { value: "Computer_Hardware", label: "Computer Hardware" },
  { value: "Heavy_Equipment", label: "Heavy Equipment" },
  { value: "Machinery", label: "Machinery" },
  { value: "Automobiles", label: "Automobiles" },
  { value: "Timber_Wood", label: "Timber and Wood" },
  { value: "Construction_Materials", label: "Construction Materials" },
  { value: "Crude_Oil", label: "Crude Oil" },
  { value: "Refined_Petroleum", label: "Refined Petroleum" },
  { value: "Natural_Gas", label: "Natural Gas" },
  { value: "Cattle_poultry", label: "Cattlea and Poultry" },
  { value: "Agricultural_Produce", label: "Agricultural Produce" },
  { value: "Grains", label: "Grains" },
  { value: "Coal", label: "Coal" },
  { value: "Municipal_Solid_Waste", label: "Municipal Solid Waste" },
  { value: "Sand", label: "Sand" },
  { value: "Recyclables", label: "Recyclables" },
  { value: "Small_Packages", label: "Small Packages" },
  { value: "Finished_Vehicles", label: "Finished Vehicles" },
  { value: "Hazardous_Materials", label: "Hazardous Materials" },
  { value: "Non_Hazardous_Materials", label: "Non-Hazardous Materials" },
  { value: "Medical_Equipment", label: "Medical Equipment" },
];

const trucks = {
  Electronics: ["Refrigerated Trucks (Reefers)", "Dry Vans"],
  Clothing: ["Refrigerated Trucks (Reefers)", "Dry Vans"],
  Appliances: ["Refrigerated Trucks (Reefers)", "Dry Vans"],
  "Fresh Produce": ["Refrigerated Trucks (Reefers)"],
  "Dairy Produce": ["Refrigerated Trucks (Reefers)"],
  "Frozen Goods": ["Refrigerated Trucks (Reefers)"],
  Pharmaceuticals: ["Refrigerated Trucks (Reefers)"],
  Chemicals: ["Refrigerated Trucks (Reefers)", "Tanker"],
  "Packaged Food": ["Dry Vans"],
  Beverages: ["Dry Vans", "Refrigerated Trucks (Reefers)"],
  Furniture: ["Dry Vans"],
  "Home Goods": ["Dry Vans"],
  "Auto Comps": ["Dry Vans"],
  Lumber: ["Dry Vans"],
  Concrete: ["Dry Vans"],
  Steel: ["Dry Vans"],
  "Bricks and Tiles": ["Dry Vans"],
  "Paper Products": ["Dry Vans"],
  "Computer Hardware": ["Dry Vans", "Flatbed"],
  "Heavy Equipment": ["Flatbed"],
  Machinery: ["Flatbed"],
  Automobiles: ["Flatbed"],
  "Timber and Wood": ["Flatbed"],
  "Construction Materials": ["Flatbed"],
  "Crude Oil": ["Tanker"],
  "Refined Petroleum": ["Tanker"],
  "Natural Gas": ["Tanker"],
  Cattle: ["Livestock"],
  Poultry: ["Livestock"],
  "Agricultural Produce": ["Livestock"],
  Grains: ["Bulk Haulage"],
  Coal: ["Bulk Haulage"],
  Sand: ["Bulk Haulage"],
  "Municipal Solid Waste": ["Bulk Haulage", "Specialized Trucks"],
  Recyclables: ["Bulk Haulage", "Specialized Trucks"],
  "Small Packages": ["Parcel Vans"],
  "Finished Vehicles": ["Car Carriers"],
  "Hazardous Materials": ["Specialized Trucks"],
  "Non-Hazardous Materials": ["Specialized Trucks"],
  "Medical Equipment": ["Specialized Trucks"],
};
const Form2 = ({ formData, setFormData }) => {
  const [truckType, setTruckType] = useState([
    { value: "Select Truck Type", label: "Selecr Truck Type" },
  ]);
  const [truckValue, setTruckValue] = useState(truckType[0]);
  let defaultProductValue = {
    value: formData.itemType,
    label: formData.itemType,
  };
  useEffect(() => {}, []);
  const [defaultTruckValue, setDefaultTruckValue] = useState({
    value:
      formData.truckType.length > 0 ? formData.truckType : "Select Truck Type",
    label:
      formData.truckType.length > 0 ? formData.truckType : "Select Truck Type",
  });

  const handleItemType = (event) => {
    let allTruck = [];
    for (let i = 0; i < trucks[event.label].length; i++) {
      allTruck.push({
        value: trucks[event.label][i],
        label: trucks[event.label][i],
      });
    }
    setTruckType(allTruck);
    setDefaultTruckValue({
      value: "Select Truck Type",
      label: "Select Truck Type",
    });
    setTruckValue(allTruck[0]);
    setFormData({ ...formData, itemType: event.value, truckType: "" });
  };

  const handleTruckType = (event) => {
    setTruckValue(event);
    setFormData({ ...formData, truckType: event.value });
  };

  const handleWeight = (event) => {
    setFormData({ ...formData, weight: event.target.value });
  };

  return (
    <div>
      <Select
        options={productType}
        defaultValue={defaultProductValue}
        placeHolder="Item Type"
        onChange={handleItemType}
      />
      <Select
        value={truckValue}
        options={truckType}
        defaultValue={defaultTruckValue}
        placeHolder="Truck Type"
        onChange={handleTruckType}
      />

      <TextField
        label="Weight"
        style={{ margin: "10px 0" }}
        value={formData.weight}
        onChange={handleWeight}
        size="small"
        fullWidth
      />
    </div>
  );
};

export default Form2;
