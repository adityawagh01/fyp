import { useEffect, useState } from "react";
// import axios from "axios";

import Form1 from "./subForm/Form1";
import Form2 from "./subForm/Form2";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import Map1 from "../Map/Map1";
import Map2 from "../Map/Map2";
import Trucks_img from "../../assets/Trucks.webp";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import LatLongForm from "./subForm/LatLongForm";
import { generateAccessToken } from '../../utils/access_token_generator';

function Form() {
  const navigateTo = useNavigate();
  const [step, setStep] = useState(0);
  const [seeMap, setSeeMap] = useState(0);
  const FormTitles = ["Location Details", "Order Category"];

  const [formData, setFormData] = useState({
    srcLoc: [],
    srcLatLong: [{ latitude: "", longitude: "" }],
    destLoc: "",
    itemType: "",
    truckType: "",
    weight: "",
    latLongUsed: false,
  });

  const [useLatLong, setLatLong] = useState(false);

  // const [srcLocChanged, setSrcLocChanged] = useState(false);

  // useEffect(() => {
  //   // Check if srcLoc array has changed
  //   const isSrcLocChanged = JSON.stringify(formData.srcLoc) !== JSON.stringify([]);
  //   setSrcLocChanged(isSrcLocChanged);
  // }, [formData.srcLoc]);

  const [accessToken, setAccessToken] = useState("");

  // Fetch access token when the component mounts
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await generateAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error("Error getting access token:", error.message);
        throw error;
      }
    };

    fetchAccessToken();
  }, []);

  const handlePrevClick = () => {
    setStep((currPage) => Math.max(currPage - 1, 0)); // Ensure the page does not go below 0
  };

  const handleNextClick = (e) => {
    if (step == FormTitles.length - 1) {
      e.preventDefault();
      console.log("request address - ", location);

      let data = {
        srcLoc: formData.srcLoc,
        srcLatLong: formData.srcLatLong,
        destLoc: formData.destLoc,
        itemType: formData.itemType,
        truckType: formData.truckType,
        weight: formData.weight,
        latLongUsed: formData.latLongUsed,
      };
      console.log(data);

      let finalFormEndpoint = "http://localhost:3000/findNearestHub";
      fetch(finalFormEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.statusText);
          }
          console.log(response);
          return response.text();
        })
        .then((d) => {
          // console.log("response state - ", d);
          let formData = JSON.parse(d);
          navigateTo(`/success/${formData[0]}/${formData[1]}`);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setStep((currPage) => Math.min(currPage + 1, FormTitles.length - 1)); // Ensure the page does not exceed the length of FormTitles
    }
  };

  const FormDisplay = () => {
    switch (step) {
      case 0:
        if (!useLatLong) {
          return <Form1 formData={formData} setFormData={setFormData} />;
        } else {
          return <LatLongForm formData={formData} setFormData={setFormData} />;
        }
      case 1:
        return <Form2 formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  const handleLocationSearch = () => {
    setSeeMap((seeMap) => (seeMap == 0 ? (seeMap = 1) : (seeMap = 0)));
  };

  const MapDisplay = () => {
    switch (seeMap) {
      case 0:
        return (
          <img
            src={Trucks_img}
            alt="Trucks"
            style={{ maxHeight: "100%", maxWidth: "100%", height: "auto" }}
          />
        );
      case 1:
        if(useLatLong){
          console.log("latlongarray in Form.jsx",formData.srcLatLong);
          return (
            <Map2 srcLatLong={formData.srcLatLong} accessToken={accessToken} />
          );
        }
        else{
          return (
            <Map1 srcLocation={formData.srcLoc[0]} accessToken={accessToken} />
            );
          }
      default:
        return null;
    }
  };

  const handleCheckboxChange = () => {
    // console.log(useLatLong);
    setLatLong(!useLatLong); // Toggle the value of useLatLong
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      latLongUsed: useLatLong,
    }));
  }, [useLatLong]);

  return (
    <div className="form-main">
      <div className="form-left">
        <h2 className="header">{FormTitles[step]}</h2>
        <div className="body">{FormDisplay()}</div>

        <div>
          {step == 0 && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useLatLong}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Use Lat Long"
              />
            </FormGroup>
          )}
        </div>

        <div className="footer">
          {step == 0 && (
            <Button onClick={handleLocationSearch} variant="contained">
              Confirm source Location
            </Button>
          )}

          {step != 0 && (
            <Button onClick={handlePrevClick} variant="outlined">
              prev
            </Button>
          )}
          <Button onClick={handleNextClick} variant="contained">
            {step === FormTitles.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
      <div className="form-right">{MapDisplay()}</div>
    </div>
  );
}

export default Form;
