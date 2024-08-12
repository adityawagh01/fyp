/* eslint-disable react/prop-types */
import { useEffect } from "react";

export default function MapDirection(props) {

    useEffect(() => {
        // Ensure that initMap1 is available in the global scope
        var map,direction_plugin; 
        console.log("Map direction props",props.orders);
        const orders=props.orders;
        window.initMap1 = function () {
            map = new mappls.Map('map', {
                center: [28.09, 78.3],
                zoom: 5
            });
            map.addListener('load',function(){ 
                /*direction plugin initialization*/
                var direction_option = {
                    map: map,
                    divWidth:'0px',
                    profile: "trucking",
                    start:{label: orders[0][0], geoposition: orders[0][1]},
                    via:[],
                    end: {label: orders[0][0], geoposition: orders[0][1]}
                }
                for (var i = 1; i < orders.length-1; i++) {
                    direction_option.via.push({
                        label: orders[i][0],
                        geoposition: orders[i][1]
                    });
                }
                console.log("direction option",direction_option);
                mappls.direction(direction_option,function(data) {
                    direction_plugin=data;
                    console.log(direction_plugin);
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
  )
}
