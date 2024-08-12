/* eslint-disable react/prop-types */
import React from "react";
import { TextField } from "@mui/material";

export default function LatLongForm({ formData, setFormData }) {
  const handleTo = (event) => {
    setFormData({ ...formData, destLoc: event.target.value });
  };

  const handleAddSrcLoc = () => {
    if (formData.srcLatLong.length < 3) {
      // Limiting to 3 source locations
      // setFormData({ ...formData, srcLatLong: [...formData.srcLatLong, ""] });
      setFormData({
        ...formData,
        srcLatLong: [...formData.srcLatLong, { latitude: "", longitude: "" }],
      });
    }
  };

  const handleRemoveSrcLoc = (index) => {
    const newSrcLocs = [...formData.srcLatLong];
    newSrcLocs.splice(index, 1);
    setFormData({ ...formData, srcLatLong: newSrcLocs });
  };

  const handleLatitudeChange = (event, index) => {
    // const newSrcLocs = [...formData.srcLatLong];
    // if (newSrcLocs[index]) {
    //     newSrcLocs[index].latitude = event.target.value;
    // } else {
    //     newSrcLocs[index] = { latitude: event.target.value, longitude: '' };
    // }
    // setFormData({ ...formData, srcLatLong: newSrcLocs });

    const newSrcLocs = [...formData.srcLatLong];
    newSrcLocs[index].latitude = event.target.value;
    setFormData({ ...formData, srcLatLong: newSrcLocs });
  };

  const handleLongitudeChange = (event, index) => {
    // const newSrcLocs = [...formData.srcLatLong];
    // if (newSrcLocs[index]) {
    //     newSrcLocs[index].longitude = event.target.value;
    // } else {
    //     newSrcLocs[index] = { latitude: '', longitude: event.target.value };
    // }
    // setFormData({ ...formData, srcLatLong: newSrcLocs });

    const newSrcLocs = [...formData.srcLatLong];
    newSrcLocs[index].longitude = event.target.value;
    setFormData({ ...formData, srcLatLong: newSrcLocs });
  };

  return (
    <div>
      <label>Source Locations:</label>
      {formData.srcLatLong.map((srcLatLong, index) => (
        <div key={index} style={{ display: "flex" }}>
          <TextField
            label={`latitude ${index + 1}`}
            value={srcLatLong.latitude}
            onChange={(event) => handleLatitudeChange(event, index)}
            size="small"
            type="Number"
            fullWidth
          />
          <TextField
            label={`longitude ${index + 1}`}
            value={srcLatLong.longitude}
            onChange={(event) => handleLongitudeChange(event, index)}
            size="small"
            type="Number"
            fullWidth
          />
          <button onClick={() => handleRemoveSrcLoc(index)}>🗑️</button>
        </div>
      ))}

      {formData.srcLatLong.length < 3 && (
        <button onClick={handleAddSrcLoc} style={{ margin: "20px 0px" }}>
          +
        </button>
      )}

      <div style={{ display: "flex" }}>
        <TextField
          label="Destination location"
          value={formData.destLoc}
          onChange={handleTo}
          size="small"
          fullWidth
        />
      </div>
    </div>
  );
}
