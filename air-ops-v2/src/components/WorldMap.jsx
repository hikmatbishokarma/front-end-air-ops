// import React from "react";
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
// } from "react-simple-maps";
// import { Card, Tooltip, Typography } from "@mui/material";
// import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
// import { geoMercator, geoPath } from "d3-geo";
// import { line, curveBasis } from "d3-shape";

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// const routes = [
//   {
//     // from: { name: "New York", coords: [-74.006, 40.7128] },
//     // to: { name: "Mumbai", coords: [72.8777, 19.076] },
//     from: { name: "Hyderabad", coords: [78.4867, 17.385] },
//     to: { name: "Bangalore", coords: [77.5946, 12.9716] },
//   },
// ];

// const WorldFlightMap = () => {
//   const width = 1000;
//   const height = 500;

//   const projection = geoMercator()
//     .scale(170) // Adjust zoom level
//     .center([0, 20]) // Center on mid-Atlantic / Africa
//     .translate([width / 2, height / 2]);

//   const path = geoPath(projection);

//   const curvedLine = line()
//     .x((d) => d[0])
//     .y((d) => d[1])
//     .curve(curveBasis);

//   return (
//     <Card sx={{ p: 2 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Global Flight Route
//       </Typography>
//       <ComposableMap
//         projection={projection}
//         width={width}
//         height={height}
//         style={{ width: "100%", height: "auto" }}
//       >
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 fill="#f5f5f5"
//                 stroke="#aaa"
//                 strokeWidth={0.4}
//               />
//             ))
//           }
//         </Geographies>

//         {/* Markers */}
//         {routes
//           .flatMap(({ from, to }) => [from, to])
//           .map((city, index) => (
//             <Marker key={`${city.name}-${index}`} coordinates={city.coords}>
//               <Tooltip title={city.name}>
//                 <circle r={5} fill="#fb8c00" />
//               </Tooltip>
//             </Marker>
//           ))}

//         {/* Arc Line */}
//         {routes.map(({ from, to }, index) => {
//           const fromPx = projection(from.coords);
//           const toPx = projection(to.coords);
//           if (!fromPx || !toPx) return null;

//           const mid = [
//             (fromPx[0] + toPx[0]) / 2,
//             (fromPx[1] + toPx[1]) / 2 - 60,
//           ];
//           const pathData = curvedLine([fromPx, mid, toPx]);

//           return (
//             <path
//               key={index}
//               d={pathData || ""}
//               fill="none"
//               stroke="#1976d2"
//               strokeWidth={2}
//               opacity={0.9}
//             />
//           );
//         })}

//         {/* Plane Icon */}
//         <Marker coordinates={routes[0].from.coords}>
//           <AirplanemodeActiveIcon sx={{ color: "#1976d2", fontSize: 20 }} />
//         </Marker>
//       </ComposableMap>
//     </Card>
//   );
// };

// export default WorldFlightMap;

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client"; // Don't forget this import!

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMapTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(geoUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worldAtlasData = await response.json();
        // Convert TopoJSON 'countries' object to GeoJSON
        const countriesGeoJson = feature(
          worldAtlasData,
          worldAtlasData.objects.countries
        );
        setData(countriesGeoJson);
      } catch (err) {
        console.error("Error fetching map data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error.message}. Check console.</div>;
  if (!data) return <div>No map data available.</div>;

  return (
    <div style={{ border: "2px solid green", padding: "10px" }}>
      <h2>World Map Test</h2>
      <ComposableMap width={800} height={500} projection="geoMercator">
        <Geographies geography={data}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMapTest;
