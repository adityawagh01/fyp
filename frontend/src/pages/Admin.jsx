import { useEffect, useState } from "react";
import { Button, ButtonGroup, Box, Grid } from "@mui/material";
import Select from "react-select";
import MarkerMap from "../components/Map/MarkerMap";
import { generateAccessToken } from "../utils/access_token_generator";
import MapDirection from "../components/Map/MapDirection";

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

export default function Admin() {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedHub, setSelectedHub] = useState([]);
  const [mapKey, setMapKey] = useState(0); // Key for MarkerMap component
  const [orders, setOrders] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [accessTokenLoaded, setAccessTokenLoaded] = useState(false);

  const [getRouteMap, setGetRouteMap] = useState(false);
  const [itemType, setItemType] = useState("default");
  const [allOrders, setAllOrders] = useState(true);
  const [truckInfo, setTruckInfo] = useState(null);
  const [truckType, setTruckType] = useState(null);

  // Fetch access token when the component mounts
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await generateAccessToken();
        setAccessToken(token);
        setAccessTokenLoaded(true);
      } catch (error) {
        console.error("Error getting access token:", error.message);
        throw error;
      }
    };
    fetchAccessToken();
  }, []);

  const hubLocs = [
    {
      state: "Gujarat",
      hubs: [
        ["Ahmedabad", "gwrwkl"],
        ["Rajkot", "t7szd4"],
        ["Surat", "jpi3jl"],
      ],
    },
    {
      state: "Madhya Pradesh",
      hubs: [
        ["Bhopal", "1bbcyj"],
        ["Indore", "1bbd32"],
        ["Jabalpur", "1bbbzl"],
      ],
    },
    {
      state: "Maharashtra",
      hubs: [
        ["Mumbai", "2yzffw"],
        ["Aurangabad", "2yzn9b"],
        ["Nagpur", "2yzrdy"],
      ],
    },
    {
      state: "Rajasthan",
      hubs: [
        ["Jaipur", "3t7xv6"],
        ["Udaipur", "2z3484"],
        ["Jodhpur", "2z288t"],
      ],
    },
  ];

  const handleStateClick = (state) => {
    setSelectedState(state);
    setSelectedHub([]);
  };

  const handleHubClick = (selectedHub) => {
    setAllOrders(true);
    setItemType("default");
    setSelectedHub(selectedHub);
    // const allOrders = await getAllOrders(selectedHub[0]);
    setMapKey((prevKey) => prevKey + 1);
    // setOrders(allOrders);
  };

  const handleGetRoute = async () => {
    const allOrders = await getAllOrders(selectedHub[0]);

    if (getRouteMap) {
      setOrders(allOrders);
      setGetRouteMap(!getRouteMap);
    } else {
      const eLocs = [selectedHub[1].toUpperCase()];
      allOrders.forEach((o) => {
        eLocs.push(o[1]);
      });

      const response = await fetch("http://localhost:3000/getOrderRoute", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eLocs: eLocs,
          itemType: itemType,
        }),
      });

      const tspRes = await response.json();
      const newOrdersInd = tspRes.minPath;
      let newOrders = [];

      newOrdersInd.forEach((ind) => {
        newOrders.push(ind === 0 ? [...selectedHub, "hub"] : orders[ind - 1]);
      });
      setOrders(newOrders);
      setGetRouteMap(!getRouteMap);
    }
  };

  async function getAllOrders(hub) {
    let obj = { hub: hub, itemType: itemType };
    let finalFormEndpoint = "http://localhost:3000/getOrders";
    let data = await fetch(finalFormEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return await data.json();
  }

  const handleItemType = (selectedOption) => {
    if (selectedOption) {
      setItemType(selectedOption.value);
    } else {
      setItemType("default"); // Reset if no option is selected
    }
  };

  const handleSubmit = async () => {
    setAllOrders(false);
    const allOrders = await getAllOrders(selectedHub[0]);
    setOrders(allOrders);
    setMapKey((prevKey) => prevKey + 1);
  };

  const handleTruckInfo = async () => {
    let res = await fetch("http://localhost:3000/getTruckInfo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hub: selectedHub[0], itemType: itemType }),
    });

    let data = await res.json();

    setTruckInfo(data[0]);
    setTruckType(data[1]);
  };

  useEffect(() => {
    if (selectedHub.length !== 0)
      getAllOrders(selectedHub[0]).then((o) => setOrders(o));
  }, [selectedHub]);

  return (
    <Box
      width={"100%"}
      justifyContent={"center"}
      display={"flex"}
      flexDirection="column"
      gap={2}
    >
      <ButtonGroup size="large" sx={{ justifyContent: "center" }}>
        {hubLocs.map((s, index) => (
          <Button
            key={index}
            onClick={() => handleStateClick(s.state)}
            variant={selectedState === s.state ? "contained" : "outlined"}
            sx={{ color: "whitesmoke", border: "1px solid white" }}
          >
            {s.state}
          </Button>
        ))}
      </ButtonGroup>
      {selectedState && (
        <Box display="flex" justifyContent="center">
          <ButtonGroup size="large">
            {hubLocs
              .find((loc) => loc.state === selectedState)
              .hubs.map((hub, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleHubClick(hub)}
                  variant={selectedHub[0] === hub[0] ? "contained" : "outlined"}
                  sx={{ color: "whitesmoke", border: "1px solid white" }}
                >
                  {hub[0]}
                </Button>
              ))}
          </ButtonGroup>
        </Box>
      )}

      <Box display="flex" justifyContent="center">
        <Select
          placeHolder="Item Type"
          options={productType}
          onChange={handleItemType}
          value={productType.find((option) => option.value === itemType)}
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <ButtonGroup size="large">
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </ButtonGroup>
      </Box>

      {selectedHub.length !== 0 && (
        <Box>
          <Box display={"flex"} justifyContent={"space-evenly"}>
            <Box>
              {/* {accessTokenLoaded && <MarkerMap key={mapKey} accessToken={accessToken} selectedHub={selectedHub[0]}/>} */}

              {/* {orders && <MapDirection orders={orders} accessToken={accessToken}/>} */}

              {getRouteMap
                ? orders && (
                    <MapDirection orders={orders} accessToken={accessToken} />
                  )
                : accessTokenLoaded && (
                    <MarkerMap
                      key={mapKey}
                      accessToken={accessToken}
                      selectedHub={selectedHub[0]}
                      itemType={itemType}
                    />
                  )}
            </Box>
            <Box
              display={allOrders ? "none" : "flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Button variant={"contained"} onClick={handleGetRoute}>
                {getRouteMap ? "GetOrders" : "GetRoute"}
              </Button>
            </Box>
            <Box
              width={"40%"}
              color={"whitesmoke"}
              border={"1px solid whitesmoke"}
            >
              <Grid container>
                <Grid
                  item
                  xs={2}
                  display={"flex"}
                  justifyContent={"center"}
                  borderBottom={"2px solid whitesmoke"}
                  py={1}
                >
                  No.
                </Grid>
                <Grid
                  item
                  xs={5}
                  display={"flex"}
                  justifyContent={"center"}
                  borderBottom={"2px solid whitesmoke"}
                  py={1}
                >
                  City
                </Grid>
                <Grid
                  item
                  xs={5}
                  display={"flex"}
                  justifyContent={"center"}
                  borderBottom={"2px solid whitesmoke"}
                  py={1}
                >
                  UUID
                </Grid>
                {orders.map((o, i) => (
                  <>
                    <Grid
                      item
                      key={i}
                      xs={2}
                      display={"flex"}
                      justifyContent={"center"}
                      borderBottom={"2px solid whitesmoke"}
                      py={1}
                    >
                      {i + 1}
                    </Grid>
                    {o.map(
                      (d, j) =>
                        j !== 1 && (
                          <Grid
                            item
                            key={j}
                            xs={5}
                            display={"flex"}
                            justifyContent={"center"}
                            borderBottom={"2px solid whitesmoke"}
                            py={1}
                          >
                            {d}
                          </Grid>
                        )
                    )}
                  </>
                ))}
              </Grid>
            </Box>
          </Box>

          {!allOrders && (
            <Box mt={3}>
              <Box display={"flex"} justifyContent={"center"}>
                <Button variant="contained" onClick={handleTruckInfo}>
                  get Truck Info
                </Button>
              </Box>
              <Box
                color={"whitesmoke"}
                display={"flex"}
                justifyContent={"center"}
                my={2}
              >
                {truckInfo !== null && "Number of trucks - " + truckInfo}
              </Box>
              <Box
                color={"whitesmoke"}
                display={"flex"}
                justifyContent={"center"}
                my={2}
              >
                {truckInfo !== null && "Truck Type - " + truckType}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
