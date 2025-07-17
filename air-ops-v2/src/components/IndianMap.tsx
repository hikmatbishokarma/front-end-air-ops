import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoMercator } from "d3-geo";
import { line, curveBasis } from "d3-shape";
import { Card, Tooltip, Typography } from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive"; // Correct path if needed
import { feature } from "topojson-client";

// Using the world-atlas URL (this is correct)
const worldGeoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const IndiaFlightMapWithStops = ({ stops = [] }: { stops: any }) => {
  const width = 800;
  const height = 500;

  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        setLoading(true);
        const response = await fetch(worldGeoUrl); // Use worldGeoUrl here
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const worldAtlasData = await response.json();
        const countriesGeoJson = feature(
          worldAtlasData,
          worldAtlasData.objects.countries
        );
        setGeoData(countriesGeoJson);
      } catch (err) {
        console.error("Error fetching World TopoJSON:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorldData();
  }, []);

  // --- CRITICAL ADJUSTMENT AREA ---
  // These values need to be carefully tuned when zooming from a world map to a country.
  const indiaCenter = [78.9629, 21.5937]; // Approximate center of India

  // This is the value you need to adjust significantly.
  // Start with a very large number and reduce it until India fills the map.
  // Examples:
  // 1000 - Whole world visible
  // 5000 - Decent zoom, but India might still be small
  // 8000 - India should be clearly visible
  // 10000 - India should fill a good portion of the map
  // 15000 - Very zoomed in on India
  const indiaScale = 7000; // <<<--- START EXPERIMENTING HERE! Try 8000, 9000, 10000.

  const projection = geoMercator()
    .scale(indiaScale)
    .center(indiaCenter)
    .translate([width / 2, height / 2]);

  const curvedLine = line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(curveBasis);

  if (loading) {
    return (
      <Card sx={{ p: 2, border: "2px solid red" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading World Map (Zooming to India)...
        </Typography>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 2, border: "2px solid red" }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Error loading map: {error.message}
        </Typography>
        <Typography variant="body2">
          Please check the console for more details and verify the map URL.
        </Typography>
      </Card>
    );
  }

  if (!geoData) {
    return (
      <Card sx={{ p: 2, border: "2px solid red" }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Map data not available after loading.
        </Typography>
        <Typography variant="body2">
          The map data might be empty or malformed.
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2, border: "2px solid red" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        India Multi-Stop Flight Map (World Map Zoomed)
      </Typography>
      <ComposableMap
        width={width}
        height={height}
        projection={projection}
        style={{ width: "100%", height: "auto", backgroundColor: "#e3f2fd" }}
      >
        {geoData && (
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#f0f0f0"
                  stroke="#aaa"
                />
              ))
            }
          </Geographies>
        )}

        {/* Draw all stops */}
        {stops.map((city, index) => (
          <Marker key={index} coordinates={city.coords}>
            <Tooltip title={city.name}>
              <circle r={5} fill="#fb8c00" />
            </Tooltip>
          </Marker>
        ))}

        {/* Draw arcs between each consecutive stop */}
        {stops.map((_, i) => {
          if (i === stops.length - 1) return null;

          const fromCoords = stops[i].coords;
          const toCoords = stops[i + 1].coords;

          const from = projection(fromCoords);
          const to = projection(toCoords);

          if (!from || !to) return null;

          const mid = [
            (from[0] + to[0]) / 2,
            (from[1] + to[1]) / 2 - 30, // Adjust this value for curve height/direction
          ];
          const pathData = curvedLine([from, mid, to]);

          return (
            <path
              key={`path-${i}`}
              d={pathData || ""}
              fill="none"
              stroke="#1976d2"
              strokeWidth={2}
              opacity={0.9}
            />
          );
        })}

        {/* ✈️ Airplane icon on the first stop */}
        {stops[0] && (
          <Marker coordinates={stops[0].coords}>
            <AirplanemodeActiveIcon sx={{ color: "#1976d2", fontSize: 20 }} />
          </Marker>
        )}
      </ComposableMap>
    </Card>
  );
};

export default IndiaFlightMapWithStops;
