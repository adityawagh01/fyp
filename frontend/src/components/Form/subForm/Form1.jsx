
/* eslint-disable react/prop-types */
import { React, PropTypes, useEffect } from "react";
import "./Form1.css";
import TextField from '@mui/material/TextField';

const Form1 = ({ formData, setFormData }) => {
  const handleFrom = (event, index) => {
    const newSrcLocs = [...formData.srcLoc];
    newSrcLocs[index] = event.target.value;
    setFormData({ ...formData, srcLoc: newSrcLocs });
  };

  const handleTo = (event) => {
    setFormData({ ...formData, destLoc: event.target.value });
  };

  const handleAddSrcLoc = () => {
    if (formData.srcLoc.length < 3) { // Limiting to 3 source locations
      setFormData({ ...formData, srcLoc: [...formData.srcLoc, ""] });
    }
  };

  const handleRemoveSrcLoc = (index) => {
    const newSrcLocs = [...formData.srcLoc];
    newSrcLocs.splice(index, 1);
    setFormData({ ...formData, srcLoc: newSrcLocs });
  };

  return (
    <div className="Form1">

      <TextField 
        label="Source Location"
        value={formData.srcLoc[0] || ""} // Display first source location
        onChange={(event) => handleFrom(event, 0)} // Always update first source location
        size="small"
        fullWidth
      /> 

      {formData.srcLoc.slice(1).map((srcLoc, index) => (
        <div key={index}>
          <TextField 
            label={`Source Location ${index + 2}`} 
            value={srcLoc}
            onChange={(event) => handleFrom(event, index + 1)} // Update source locations from index 1 onwards
            size="small"
            fullWidth
          /> 
          <button onClick={() => handleRemoveSrcLoc(index + 1)}>🗑️</button> {/* Adjust index */}
        </div>
      ))}

      

      {formData.srcLoc.length < 3 && (
        <button onClick={handleAddSrcLoc}>+</button>
      )}

      <TextField 
        label="Destination Location"
        value={formData.destLoc}
        onChange={handleTo}
        size="small"
        fullWidth
      /> 

    </div>
  );
};

export default Form1;
