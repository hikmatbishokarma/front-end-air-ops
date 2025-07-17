import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { line, curveBasis } from "d3-shape";
import { geoMercator } from "d3-geo";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { Card, Tooltip, Typography } from "@mui/material";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// 👇 Dynamic props: only FROM and TO
const DynamicFlightMap = ({ from, to }) => {
  const width = 1000;
  const height = 500;

  const center = [
    (from.coords[0] + to.coords[0]) / 2,
    (from.coords[1] + to.coords[1]) / 2,
  ];

  const projection = geoMercator()
    .scale(180)
    .center(center)
    .translate([width / 2, height / 2]);

  const curvedLine = line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(curveBasis);

  const fromPx = projection(from.coords);
  const toPx = projection(to.coords);
  const mid = [(fromPx[0] + toPx[0]) / 2, (fromPx[1] + toPx[1]) / 2 - 40];
  const pathData = curvedLine([fromPx, mid, toPx]);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Dynamic Flight Path
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
                fill="#f0f0f0"
                stroke="#ccc"
              />
            ))
          }
        </Geographies>

        {/* From & To markers */}
        {[from, to].map((city, idx) => (
          <Marker key={idx} coordinates={city.coords}>
            <Tooltip title={city.name}>
              <circle r={5} fill="#f57c00" />
            </Tooltip>
          </Marker>
        ))}

        {/* Path */}
        <path
          d={pathData || ""}
          fill="none"
          stroke="#1976d2"
          strokeWidth={2}
          opacity={0.8}
        />

        {/* Plane icon */}
        <Marker coordinates={from.coords}>
          <AirplanemodeActiveIcon sx={{ color: "#1976d2", fontSize: 20 }} />
        </Marker>
      </ComposableMap>
    </Card>
  );
};

export default DynamicFlightMap;
