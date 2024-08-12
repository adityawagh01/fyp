/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';

const Map1 = (props) => {
  useEffect(() => {
    // Ensure that initMap1 is available in the global scope
    window.initMap1 = function () {
      var map = new window.mappls.Map('map', {
        center: [21.15338, 79.07799],
        zoom: 10,
        backgroundColor: '#fff'
      });

      map.addListener('load', function () {
        var optional_config = {
          region: "IND",
          height: 300,
        };

        new window.mappls.search(props.srcLocation, optional_config, callback);

        function callback(data) {
          if (data) {
            var dt = data[0];
            if (!dt) return false;
            var eloc = dt.eLoc;
            var place = dt.placeName + ", " + dt.placeAddress;

            if (window.marker) window.marker.remove();

            window.mappls.pinMarker({
              map: map,
              pin: eloc,
              popupHtml: place,
              popupOptions: {
                openPopup: true
              }
            }, function (data) {
              window.marker = data;
              window.marker.fitbounds();
            });
          }
        }
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
    loadScript(
      `https://apis.mappls.com/advancedmaps/api/${props.accessToken}/map_sdk_plugins?v=3.0`
    );
  }, []);

  return (
    <div id="map"></div>
  );
}

export default Map1;
