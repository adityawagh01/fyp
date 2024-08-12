/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import marker_img from "../../assets/marker.png";
import "./MarkerMap.css";
// import {statesData} from "../../../hub.js"
var map, marker;
const statesData = {
  "Gujarat": [["Ahmedabad","gwrwkl"], ["Rajkot","t7szd4"], ["Surat","jpi3jl"]],
  "Madhya Pradesh": [["Bhopal","1bbcyj"], ["Indore","1bbd32"], ["Jabalpur","1bbbzl"]],
  "Maharashtra": [["Mumbai","2yzffw"], ["Aurangabad","2yzn9b"], ["Nagpur","2yzrdy"]],
  "Rajasthan": [["Jaipur","3t7xv6"], ["Udaipur","2z3484"], ["Jodhpur","2z288t"]],
  // Add more states as needed
};
const MarkerMap = (props) => {
  async function getAllOrders(hub) {
    let obj = { hub: hub,itemType:props.itemType };
    console.log("obj in marker map", obj);
    let finalFormEndpoint = "http://localhost:3000/getOrders";
    let data = await fetch(finalFormEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    console.log(data);
    return data;
  }
  useEffect(() => {
    // Ensure that initMap1 is available in the global scope
    window.initMap1 = function () {
      map = new window.mappls.Map("map", {
        center: [21.15338, 79.07799],
        zoom: 7,
        zoomControl: true,
        backgroundColor: "#fff",
      });

      map.addListener("load", async function () {
        const hub = `${props.selectedHub}`;
        // const hub = "Nagpur";
        console.log(`${props.selectedHub}`);
        let dataArray = await JSON.parse(
          await (await getAllOrders(hub)).text()
        );
        console.log(dataArray);
        // console.log(dataArray1);
        // var dataArray = [
        //   ["katol", "e61814"],
        //   ["amravati", "2yzluu"],
        //   ["wardha", "2z1qov"],
        //   ["akola", "2yzl1t"],
        // ];
        var markerOptions = {
          map: map,
          pin: [],
          popupHtml: [],
        };

        dataArray.forEach(function (item) {
          markerOptions.pin.push(item[1]);
          markerOptions.popupHtml.push("<h1>" + item[0] + "</h1>");
          // markerOptions.html.push(item[0]);
        });
        var hubeLoc ;
        for (const state in statesData) {
          const cities = statesData[state];
          for (const [cityName, eLoc] of cities) {
              if (cityName.toLowerCase() === hub.toLowerCase()) {
                  hubeLoc=  eLoc;
              }
          }
      }
        markerOptions.pin.push(hubeLoc);
        markerOptions.popupHtml.push("<h1>" + hub + "</h1>");
        console.log(markerOptions);
        mappls.pinMarker(markerOptions, function (data) {
          marker = data;
          marker.fitbounds();
          marker.setIcon(marker_img,hubeLoc);
        });
      });
    };

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadScript(
      `https://apis.mappls.com/advancedmaps/api/${props.accessToken}/map_sdk?layer=vector&v=3.0&callback=initMap1`
    );
    // loadScript(
    //   `https://apis.mappls.com/advancedmaps/api/${props.accessToken}/map_sdk?layer=vector&v=3.0&callback=initMap1`
    // );
    loadScript(
      `https://apis.mappls.com/advancedmaps/api/${props.accessToken}/map_sdk_plugins?v=3.0`
    );
  }, []);

  return (
      <div id="map"></div>
  );
};

export default MarkerMap;
