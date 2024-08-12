import React, { useEffect } from 'react';

const Map2 = (props) => {
  useEffect(() => {
    // Ensure that initMap1 is available in the global scope
    window.initMap1 = function () {
      var map = new window.mappls.Map('map', {
        center: [21.15338, 79.07799],
        zoom: 10,
        zoomControl: true,
        backgroundColor: '#fff'
      });

      map.addListener('load', function () {
        var latLongArray = props.srcLatLong;
        
        // var dataArray = [
        //     [21.27390, 78.58622],
        //     [20.93357, 77.75453],
        //     [20.74442, 78.60251],
        //     [20.70010, 77.00816]
        //   ];
        var dataArray=[];
        for(let i=0;i<latLongArray.length;i++){
            dataArray.push([latLongArray[i].latitude,latLongArray[i].longitude]);
        }
        // console.log("dataArray",dataArray);
          var geoData = {
            type: "FeatureCollection",
            features: []
          };
          //21.123521902551627, 79.051512495426
          //`${item[0]},${item[1]}`
          dataArray.forEach(function(item) {
            var feature = {
              type: "Feature",
              properties: {
                htmlPopup: "input location"
              },
              geometry: {
                type: "Point",
                coordinates: [item[1],item[0]]
              }
            };
            geoData.features.push(feature);
          });
        //   console.log("geoData",geoData);
          var marker = mappls.Marker({
            map: map,
            position: geoData,
            icon_url: "https://apis.mapmyindia.com/map_v3/1.png",
            fitbounds: true,
            // clusters: false,
            // clustersIcon: "https://mappls.com/images/2.png",
            fitboundOptions: {
              padding: 120,
              duration: 1000,
            },
            popupOptions: {
              offset: { bottom: [0, -20] },
            },
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
    //   `https://apis.mappls.com/advancedmaps/api/${props.accessToken}/map_sdk_plugins?v=3.0`
    // );
  }, []);

  return (

    <div id="map"></div>

  );
}

export default Map2;