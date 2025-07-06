// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
// } from "react-simple-maps";
// import { Card, Tooltip } from "@mui/material";
// import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
// import { useEffect, useState } from "react";

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// const FlightMap = () => {
//   const routes = [
//     {
//       from: { name: "Hyderabad", coords: [78.4867, 17.385] },
//       to: { name: "Bangalore", coords: [77.5946, 12.9716] },
//     },
//     {
//       from: { name: "Bangalore", coords: [77.5946, 12.9716] },
//       to: { name: "Goa", coords: [73.8567, 15.2993] },
//     },
//   ];

//   const [planePos, setPlanePos] = useState(routes[0].from.coords);

//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       const route = routes[index];
//       const [x1, y1] = route.from.coords;
//       const [x2, y2] = route.to.coords;
//       const steps = 50;
//       let step = 0;

//       const flight = setInterval(() => {
//         if (step > steps) {
//           clearInterval(flight);
//           index = (index + 1) % routes.length;
//         } else {
//           const lng = x1 + (x2 - x1) * (step / steps);
//           const lat = y1 + (y2 - y1) * (step / steps);
//           setPlanePos([lng, lat]);
//           step++;
//         }
//       }, 100);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Card sx={{ p: 2, height: "500px" }}>
//       <ComposableMap projection="geoMercator">
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 fill="#e0e0e0"
//                 stroke="#888"
//               />
//             ))
//           }
//         </Geographies>

//         {/* Markers for cities */}
//         {routes.map(({ from, to }, i) => (
//           <g key={i}>
//             {[from, to].map((city) => (
//               <Marker key={city.name} coordinates={city.coords}>
//                 <Tooltip title={city.name}>
//                   <circle r={4} fill="#ff9800" />
//                 </Tooltip>
//               </Marker>
//             ))}
//           </g>
//         ))}

//         {/* Plane marker */}
//         <Marker coordinates={planePos}>
//           <AirplanemodeActiveIcon sx={{ color: "#1976d2" }} />
//         </Marker>
//       </ComposableMap>
//     </Card>
//   );
// };

// export default FlightMap;

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Card, Tooltip, Typography } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { geoMercator, geoPath } from "d3-geo";
import { line, curveBasis } from "d3-shape";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Define routes
const routes = [
  {
    from: { name: "Hyderabad", coords: [78.4867, 17.385] },
    to: { name: "Bangalore", coords: [77.5946, 12.9716] },
  },
  {
    from: { name: "Bangalore", coords: [77.5946, 12.9716] },
    to: { name: "Goa", coords: [73.8567, 15.2993] },
  },
];

const FlightMap = () => {
  const width = 800;
  const height = 500;

  // Zoomed projection centered on India
  const projection = geoMercator()
    .center([78.9629, 21.5937])
    .scale(1500)
    .translate([width / 2, height / 2]);

  const path = geoPath(projection);

  const curvedLine = line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(curveBasis);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Flight Route Map
      </Typography>
      <ComposableMap
        width={width}
        height={height}
        projection={projection}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e0e0e0"
                stroke="#999"
                strokeWidth={0.3}
              />
            ))
          }
        </Geographies>

        {/* City markers with tooltip */}
        {routes
          .flatMap(({ from, to }) => [from, to])
          .map((city, index) => (
            <Marker key={`${city.name}-${index}`} coordinates={city.coords}>
              <Tooltip title={city.name}>
                <circle r={5} fill="#fb8c00" />
              </Tooltip>
            </Marker>
          ))}

        {/* Curved lines */}
        {routes.map(({ from, to }, idx) => {
          const fromPx = projection(from.coords);
          const toPx = projection(to.coords);
          if (!fromPx || !toPx) return null;

          const mid = [
            (fromPx[0] + toPx[0]) / 2,
            (fromPx[1] + toPx[1]) / 2 - 40,
          ];
          const pathData = curvedLine([fromPx, mid, toPx]);

          return (
            <path
              key={idx}
              d={pathData!}
              fill="none"
              stroke="#1976d2"
              strokeWidth={2}
              opacity={0.8}
            />
          );
        })}

        {/* Plane icon */}
        <Marker coordinates={routes[0].from.coords}>
          <AirplanemodeActiveIcon sx={{ color: "#1976d2", fontSize: 20 }} />
        </Marker>
      </ComposableMap>
    </Card>
  );
};

export default FlightMap;
