import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlightIcon from "@mui/icons-material/Flight";
import LocationAutocomplete from "./LocationAutocomplete";

type Airport = {
    code: string;
    name?: string;
    city?: string;
    country?: string;
    lat?: string | number;
    long?: string | number;
};

const AirportDistanceCalculator = () => {
    const [fromAirport, setFromAirport] = useState<Airport | null>(null);
    const [toAirport, setToAirport] = useState<Airport | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [unit, setUnit] = useState<"nautical" | "miles" | "kilometers">("nautical");
    const [showResult, setShowResult] = useState(false);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 3440.065; // Radius of the earth in nautical miles
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in nautical miles
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const parseCoordinate = (coord: string | number | undefined): number | null => {
        if (typeof coord === "number") return coord;
        if (!coord) return null;

        // Handle format like "N13-08.1" or "E077-36.6"
        const regex = /^([NSEW])(\d+)-([\d.]+)$/;
        const match = coord.match(regex);

        if (match) {
            const [, dir, deg, min] = match;
            let decimal = parseInt(deg, 10) + parseFloat(min) / 60;
            if (dir === "S" || dir === "W") {
                decimal *= -1;
            }
            return decimal;
        }

        // Try parsing as simple float if regex fails
        const simple = parseFloat(coord);
        return isNaN(simple) ? null : simple;
    };

    const handleCalculate = () => {
        console.log("fromAirport::", fromAirport);
        console.log("toAirport:::", toAirport);

        const lat1 = parseCoordinate(fromAirport?.lat);
        const lon1 = parseCoordinate(fromAirport?.long);
        const lat2 = parseCoordinate(toAirport?.lat);
        const lon2 = parseCoordinate(toAirport?.long);

        if (lat1 !== null && lon1 !== null && lat2 !== null && lon2 !== null) {
            const dist = calculateDistance(lat1, lon1, lat2, lon2);
            setDistance(dist);
            setShowResult(true);
        } else {
            console.error("Invalid coordinates", { fromAirport, toAirport });
        }
    };

    const getDisplayDistance = () => {
        if (distance === null) return 0;
        switch (unit) {
            case "miles":
                return (distance * 1.15078).toFixed(2);
            case "kilometers":
                return (distance * 1.852).toFixed(2);
            default:
                return distance.toFixed(2);
        }
    };

    const getUnitLabel = () => {
        switch (unit) {
            case "miles":
                return "Miles";
            case "kilometers":
                return "Kilometers";
            default:
                return "Nautical Miles";
        }
    };

    return (
        <Card sx={{ mt: 4, overflow: "hidden" }}>
            {/* Header Section */}
            <Box
                sx={{
                    bgcolor: "#0d2d6c", // Dark blue color from screenshot
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mr: 2 }}>
                    Airport Distance Calculator
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, maxWidth: "800px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#1976d2", borderRadius: 1 }}>
                        <Box sx={{ px: 2, py: 1, color: "white", fontWeight: "bold" }}>From:</Box>
                        <Box sx={{ bgcolor: "white", width: 200 }}>
                            <LocationAutocomplete
                                value={fromAirport}
                                onChange={setFromAirport}
                                label=""
                                isRequired={false}
                            />
                        </Box>
                    </Box>

                    <FlightIcon sx={{ color: "#1976d2", transform: "rotate(90deg)", fontSize: 30 }} />

                    <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#1976d2", borderRadius: 1 }}>
                        <Box sx={{ px: 2, py: 1, color: "white", fontWeight: "bold" }}>To:</Box>
                        <Box sx={{ bgcolor: "white", width: 200 }}>
                            <LocationAutocomplete
                                value={toAirport}
                                onChange={setToAirport}
                                label=""
                                isRequired={false}
                            />
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleCalculate}
                        sx={{
                            bgcolor: "#1976d2",
                            textTransform: "none",
                            fontWeight: "bold",
                            px: 4,
                            "&:hover": { bgcolor: "#1565c0" },
                        }}
                    >
                        Calculate
                    </Button>
                </Box>
            </Box>

            {/* Result Section */}
            {showResult && distance !== null && (
                <Box sx={{ bgcolor: "#eef5fa", position: "relative" }}>
                    <IconButton
                        onClick={() => setShowResult(false)}
                        sx={{ position: "absolute", right: 8, top: 8, color: "#666" }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>
                            The distance from {fromAirport?.code} to {toAirport?.code} is
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: "bold", my: 2 }}>
                            {getDisplayDistance()}{" "}
                            <Typography component="span" variant="h4" sx={{ fontWeight: "normal" }}>
                                {getUnitLabel()}
                            </Typography>
                        </Typography>

                        <RadioGroup
                            row
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as any)}
                            sx={{ justifyContent: "center", mt: 2 }}
                        >
                            <FormControlLabel value="nautical" control={<Radio />} label="Nautical Miles" />
                            <FormControlLabel value="miles" control={<Radio />} label="Miles" />
                            <FormControlLabel value="kilometers" control={<Radio />} label="Kilometers" />
                        </RadioGroup>
                    </Box>

                    <TableContainer component={Paper} square elevation={0}>
                        <Table sx={{ minWidth: 650 }} aria-label="airport details">
                            <TableHead sx={{ bgcolor: "#6c757d" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ICAO</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Airport Name</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>City</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Country</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[fromAirport, toAirport].map((airport, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ "&:nth-of-type(odd)": { bgcolor: "white" }, "&:nth-of-type(even)": { bgcolor: "#f5f5f5" } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ color: "#1976d2", fontWeight: "bold" }}>
                                            {airport?.code}
                                        </TableCell>
                                        <TableCell sx={{ color: "#1976d2" }}>{airport?.name}</TableCell>
                                        <TableCell>{airport?.city}</TableCell>
                                        <TableCell>{airport?.country}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </Card>
    );
};

export default AirportDistanceCalculator;
