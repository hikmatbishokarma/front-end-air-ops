import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
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
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlightIcon from "@mui/icons-material/Flight";
import LocationAutocomplete from "./LocationAutocomplete";
import useGql from "@/lib/graphql/gql";
import { GET_AIRPORTS, GET_NEAREST_AIRPORT } from "@/lib/graphql/queries/airports";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

type Airport = {
    code: string;
    name?: string;
    city?: string;
    country?: string;
    state?: string;
    lat?: string | number;
    long?: string | number;
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

const parseCoordinate = (coord: string | number | undefined): number | null => {
    if (typeof coord === "number") return coord;
    if (!coord) return null;

    const trimmed = coord.trim();

    // Format: N13-08.1 (Legacy)
    const regexLegacy = /^([NSEW])(\d+)-([\d.]+)$/i;
    const matchLegacy = trimmed.match(regexLegacy);
    if (matchLegacy) {
        const [, dir, deg, min] = matchLegacy;
        let decimal = parseInt(deg, 10) + parseFloat(min) / 60;
        if (dir.toUpperCase() === "S" || dir.toUpperCase() === "W") {
            decimal *= -1;
        }
        return decimal;
    }

    // Format: 28.6139° N or 28.6139 N (Suffix)
    const regexSuffix = /^([\d.]+)[°º]?\s*([NSEW])$/i;
    const matchSuffix = trimmed.match(regexSuffix);
    if (matchSuffix) {
        const [, val, dir] = matchSuffix;
        let decimal = parseFloat(val);
        if (dir.toUpperCase() === "S" || dir.toUpperCase() === "W") {
            decimal *= -1;
        }
        return decimal;
    }

    // Format: Simple Number
    const simple = parseFloat(trimmed);
    return isNaN(simple) ? null : simple;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3440.065;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

// ============ ORIGINAL AIRPORT CALCULATOR (UNCHANGED) ============
const AirportCalculator = () => {
    const [fromAirport, setFromAirport] = useState<Airport | null>(null);
    const [toAirport, setToAirport] = useState<Airport | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [unit, setUnit] = useState<"nautical" | "miles" | "kilometers">("nautical");
    const [showResult, setShowResult] = useState(false);



    const handleCalculate = () => {
        const lat1 = parseCoordinate(fromAirport?.lat);
        const lon1 = parseCoordinate(fromAirport?.long);
        const lat2 = parseCoordinate(toAirport?.lat);
        const lon2 = parseCoordinate(toAirport?.long);

        if (lat1 !== null && lon1 !== null && lat2 !== null && lon2 !== null) {
            const dist = calculateDistance(lat1, lon1, lat2, lon2);
            setDistance(dist);
            setShowResult(true);
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
        <>
            <Box
                sx={{
                    bgcolor: "#0d2d6c",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                {/* FROM SECTION */}
                <Box sx={{ display: "flex", alignItems: "stretch", bgcolor: "#1976d2", borderRadius: 1, flex: "1 1 300px" }}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>From:</Box>
                    <Box sx={{ bgcolor: "white", flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: "hidden" }}>
                        <LocationAutocomplete
                            value={fromAirport}
                            onChange={setFromAirport}
                            label=""
                            isRequired={false}
                        />
                    </Box>
                </Box>

                {/* SWAP BUTTON */}
                <IconButton
                    onClick={() => {
                        const temp = fromAirport;
                        setFromAirport(toAirport);
                        setToAirport(temp);
                    }}
                    sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#e0e0e0" },
                        boxShadow: 1,
                        flexShrink: 0
                    }}
                >
                    <SwapHorizIcon sx={{ color: "#1976d2" }} />
                </IconButton>

                {/* TO SECTION */}
                <Box sx={{ display: "flex", alignItems: "stretch", bgcolor: "#1976d2", borderRadius: 1, flex: "1 1 300px" }}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>To:</Box>
                    <Box sx={{ bgcolor: "white", flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: "hidden" }}>
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
                        py: 1.5,
                        "&:hover": { bgcolor: "#1565c0" },
                        flexShrink: 0
                    }}
                >
                    Calculate
                </Button>
            </Box>

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
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: "#6c757d" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>ICAO</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Airport Name</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>City</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>State</TableCell>
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
                                        <TableCell>{airport?.state}</TableCell>
                                        <TableCell>{airport?.country}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
};

// ============ NEW HELICOPTER CALCULATOR ============
const HelicopterCalculator = () => {
    const [fromLat, setFromLat] = useState("");
    const [fromLong, setFromLong] = useState("");
    const [toLat, setToLat] = useState("");
    const [toLong, setToLong] = useState("");
    const [distance, setDistance] = useState<number | null>(null);
    const [unit, setUnit] = useState<"nautical" | "miles" | "kilometers">("nautical");
    const [showResult, setShowResult] = useState(false);
    const [fromNearestAirport, setFromNearestAirport] = useState<Airport | null>(null);
    const [toNearestAirport, setToNearestAirport] = useState<Airport | null>(null);
    const [fromNearestDistance, setFromNearestDistance] = useState<number | null>(null);
    const [toNearestDistance, setToNearestDistance] = useState<number | null>(null);
    const fetchNearestAirport = async (lat: string, lon: string) => {
        try {
            const result = await useGql({
                query: GET_NEAREST_AIRPORT,
                queryName: "nearestAirport",
                queryType: "query",
                variables: { lat, long: lon },
            });
            if (result?.data?.nearestAirport) {
                const airport = result.data.nearestAirport;
                const airportLat = parseCoordinate(airport.latitude);
                const airportLon = parseCoordinate(airport.longitude);

                // Parse local coordinates for distance calculation
                const localLat = parseCoordinate(lat);
                const localLon = parseCoordinate(lon);

                let dist = null;
                if (airportLat !== null && airportLon !== null && localLat !== null && localLon !== null) {
                    dist = calculateDistance(localLat, localLon, airportLat, airportLon);
                }
                return { airport, distance: dist };
            }
        } catch (error) {
            console.error("Error fetching nearest airport:", error);
        }
        return { airport: null, distance: null };
    };

    const handleCalculate = () => {
        const lat1 = parseCoordinate(fromLat);
        const lon1 = parseCoordinate(fromLong);
        const lat2 = parseCoordinate(toLat);
        const lon2 = parseCoordinate(toLong);

        if (lat1 !== null && lon1 !== null && lat2 !== null && lon2 !== null) {
            const dist = calculateDistance(lat1, lon1, lat2, lon2);
            setDistance(dist);

            fetchNearestAirport(fromLat, fromLong).then(({ airport, distance }) => {
                setFromNearestAirport(airport);
                setFromNearestDistance(distance);
            });

            fetchNearestAirport(toLat, toLong).then(({ airport, distance }) => {
                setToNearestAirport(airport);
                setToNearestDistance(distance);
            });

            setShowResult(true);
        }
    };

    const getDisplayDistance = () => {
        if (distance === null) return 0;
        switch (unit) {
            case "miles": return (distance * 1.15078).toFixed(2);
            case "kilometers": return (distance * 1.852).toFixed(2);
            default: return distance.toFixed(2);
        }
    };

    const getUnitLabel = () => {
        switch (unit) {
            case "miles": return "Miles";
            case "kilometers": return "Kilometers";
            default: return "Nautical Miles";
        }
    };

    const formatDistanceInUnit = (dist: number | null) => {
        if (dist === null) return "N/A";
        switch (unit) {
            case "miles": return `${(dist * 1.15078).toFixed(2)} mi`;
            case "kilometers": return `${(dist * 1.852).toFixed(2)} km`;
            default: return `${dist.toFixed(2)} NM`;
        }
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: "#0d2d6c",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >
                {/* FROM SECTION */}
                <Box sx={{ display: "flex", alignItems: "stretch", bgcolor: "#1976d2", borderRadius: 1, flex: "1 1 300px" }}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>From:</Box>
                    <Box sx={{ bgcolor: "white", flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: "hidden", display: "flex" }}>
                        <TextField
                            placeholder="Lat (N13-08.1)"
                            value={fromLat}
                            onChange={(e) => setFromLat(e.target.value)}
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                "& .MuiOutlinedInput-root": { borderRadius: 0 },
                                borderRight: "1px solid #eee"
                            }}
                        />
                        <TextField
                            placeholder="Long (E077-36.6)"
                            value={fromLong}
                            onChange={(e) => setFromLong(e.target.value)}
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                "& .MuiOutlinedInput-root": { borderRadius: 0 }
                            }}
                        />
                    </Box>
                </Box>

                {/* SWAP BUTTON */}
                <IconButton
                    onClick={() => {
                        const tLat = fromLat; const tLong = fromLong;
                        setFromLat(toLat); setFromLong(toLong);
                        setToLat(tLat); setToLong(tLong);
                    }}
                    sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#e0e0e0" },
                        boxShadow: 1,
                        flexShrink: 0
                    }}
                >
                    <SwapHorizIcon sx={{ color: "#1976d2" }} />
                </IconButton>

                {/* TO SECTION */}
                <Box sx={{ display: "flex", alignItems: "stretch", bgcolor: "#1976d2", borderRadius: 1, flex: "1 1 300px" }}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>To:</Box>
                    <Box sx={{ bgcolor: "white", flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: "hidden", display: "flex" }}>
                        <TextField
                            placeholder="Lat (N12-58.2)"
                            value={toLat}
                            onChange={(e) => setToLat(e.target.value)}
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                "& .MuiOutlinedInput-root": { borderRadius: 0 },
                                borderRight: "1px solid #eee"
                            }}
                        />
                        <TextField
                            placeholder="Long (E077-40.3)"
                            value={toLong}
                            onChange={(e) => setToLong(e.target.value)}
                            size="small"
                            fullWidth
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                "& .MuiOutlinedInput-root": { borderRadius: 0 }
                            }}
                        />
                    </Box>
                </Box>

                <Button variant="contained" onClick={handleCalculate} sx={{ bgcolor: "#1976d2", textTransform: "none", fontWeight: "bold", px: 4, py: 1.5, flexShrink: 0, "&:hover": { bgcolor: "#1565c0" } }}>Calculate</Button>
            </Box>

            {showResult && distance !== null && (
                <Box sx={{ bgcolor: "#eef5fa", position: "relative" }}>
                    <IconButton onClick={() => setShowResult(false)} sx={{ position: "absolute", right: 8, top: 8, color: "#666" }}><CloseIcon /></IconButton>
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>The distance is</Typography>
                        <Typography variant="h2" sx={{ fontWeight: "bold", my: 2 }}>
                            {getDisplayDistance()}{" "}<Typography component="span" variant="h4" sx={{ fontWeight: "normal" }}>{getUnitLabel()}</Typography>
                        </Typography>
                        <RadioGroup row value={unit} onChange={(e) => setUnit(e.target.value as any)} sx={{ justifyContent: "center", mt: 2 }}>
                            <FormControlLabel value="nautical" control={<Radio />} label="Nautical Miles" />
                            <FormControlLabel value="miles" control={<Radio />} label="Miles" />
                            <FormControlLabel value="kilometers" control={<Radio />} label="Kilometers" />
                        </RadioGroup>
                    </Box>
                    <TableContainer component={Paper} square elevation={0}>
                        <Table>
                            <TableHead sx={{ bgcolor: "#6c757d" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Coordinates</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nearest Airport</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ bgcolor: "white" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
                                    <TableCell sx={{ color: "#1976d2" }}>{fromLat}, {fromLong}</TableCell>
                                    <TableCell>
                                        {fromNearestAirport ? (
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: "bold" }}>{fromNearestAirport.code}</Typography>
                                                <Typography variant="caption">{fromNearestAirport.name}</Typography>
                                                <Typography variant="caption" display="block">{fromNearestAirport.city}, {fromNearestAirport.state}</Typography>
                                                <Typography variant="caption" display="block">{fromNearestAirport.country}</Typography>
                                                <Typography variant="caption" display="block" sx={{ color: "#666", mt: 0.5 }}>Distance: {formatDistanceInUnit(fromNearestDistance)}</Typography>
                                            </Box>
                                        ) : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
                                    <TableCell sx={{ color: "#1976d2" }}>{toLat}, {toLong}</TableCell>
                                    <TableCell>
                                        {toNearestAirport ? (
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: "bold" }}>{toNearestAirport.code}</Typography>
                                                <Typography variant="caption">{toNearestAirport.name}</Typography>
                                                <Typography variant="caption" display="block">{toNearestAirport.city}, {toNearestAirport.state}</Typography>
                                                <Typography variant="caption" display="block">{toNearestAirport.country}</Typography>
                                                <Typography variant="caption" display="block" sx={{ color: "#666", mt: 0.5 }}>Distance: {formatDistanceInUnit(toNearestDistance)}</Typography>
                                            </Box>
                                        ) : "N/A"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
};

// ============ CUSTOM CALCULATOR ============
const CustomCalculator = () => {
    // True: From=Airport, To=Lat/Long
    // False: From=Lat/Long, To=Airport
    const [isAirportToLatLong, setIsAirportToLatLong] = useState(true);

    // Data states
    const [airportData, setAirportData] = useState<Airport | null>(null); // The single airport side
    const [latData, setLatData] = useState("");
    const [longData, setLongData] = useState("");

    const [distance, setDistance] = useState<number | null>(null);
    const [unit, setUnit] = useState<"nautical" | "miles" | "kilometers">("nautical");
    const [showResult, setShowResult] = useState(false);
    const [nearestAirport, setNearestAirport] = useState<Airport | null>(null);
    const [nearestDistance, setNearestDistance] = useState<number | null>(null);

    // Nearest airport logic for the Lat/Long side
    const fetchNearestAirport = async (lat: string, lon: string) => {
        try {
            const result = await useGql({
                query: GET_NEAREST_AIRPORT,
                queryName: "nearestAirport",
                queryType: "query",
                variables: { lat, long: lon },
            });
            if (result?.data?.nearestAirport) {
                const airport = result.data.nearestAirport;

                // For client-side distance calc, we still need parsed values
                const localLat = parseCoordinate(lat);
                const localLon = parseCoordinate(lon);

                const airportLat = parseCoordinate(airport.latitude);
                const airportLon = parseCoordinate(airport.longitude);

                let dist = null;
                if (localLat !== null && localLon !== null && airportLat !== null && airportLon !== null) {
                    dist = calculateDistance(localLat, localLon, airportLat, airportLon);
                }
                return { airport, distance: dist };
            }
        } catch (error) {
            console.error("Error fetching nearest airport:", error);
        }
        return { airport: null, distance: null };
    };

    const handleCalculate = () => {
        let lat1: number | null = null;
        let lon1: number | null = null;
        let lat2: number | null = null;
        let lon2: number | null = null;

        const manualLat = parseCoordinate(latData);
        const manualLong = parseCoordinate(longData);
        const airportLat = parseCoordinate(airportData?.lat);
        const airportLong = parseCoordinate(airportData?.long);

        if (isAirportToLatLong) {
            // From Airport -> To Lat/Long
            lat1 = airportLat;
            lon1 = airportLong;
            lat2 = manualLat;
            lon2 = manualLong;
        } else {
            // From Lat/Long -> To Airport
            lat1 = manualLat;
            lon1 = manualLong;
            lat2 = airportLat;
            lon2 = airportLong;
        }

        if (lat1 !== null && lon1 !== null && lat2 !== null && lon2 !== null) {
            // Main Distance
            const dist = calculateDistance(lat1, lon1, lat2, lon2);
            setDistance(dist);

            // Find nearest for the manual coordinates side
            fetchNearestAirport(latData, longData).then(({ airport, distance }) => {
                setNearestAirport(airport);
                setNearestDistance(distance);
            });

            setShowResult(true);
        }
    };

    const getDisplayDistance = () => {
        if (distance === null) return 0;
        switch (unit) {
            case "miles": return (distance * 1.15078).toFixed(2);
            case "kilometers": return (distance * 1.852).toFixed(2);
            default: return distance.toFixed(2);
        }
    };

    const getUnitLabel = () => {
        switch (unit) {
            case "miles": return "Miles";
            case "kilometers": return "Kilometers";
            default: return "Nautical Miles";
        }
    };

    const formatDistanceInUnit = (dist: number | null) => {
        if (dist === null) return "N/A";
        switch (unit) {
            case "miles": return `${(dist * 1.15078).toFixed(2)} mi`;
            case "kilometers": return `${(dist * 1.852).toFixed(2)} km`;
            default: return `${dist.toFixed(2)} NM`;
        }
    };

    return (
        <>
            <Box
                sx={{
                    bgcolor: "#0d2d6c",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                {/* FROM SECTION */}
                <Box sx={{ display: "flex", alignItems: "stretch", bgcolor: "#1976d2", borderRadius: 1, flex: "1 1 300px" }}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>From:</Box>
                    <Box sx={{ bgcolor: "white", flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: "hidden" }}>
                        {isAirportToLatLong ? (
                            <LocationAutocomplete
                                value={airportData}
                                onChange={setAirportData}
                                label=""
                                isRequired={false}
                            />
                        ) : (
                            <Box sx={{ display: "flex", height: "100%" }}>
                                <TextField
                                    placeholder="Lat (N13-08.1)"
                                    value={latData}
                                    onChange={(e) => setLatData(e.target.value)}
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiOutlinedInput-root": { borderRadius: 0 },
                                        borderRight: "1px solid #eee"
                                    }}
                                />
                                <TextField
                                    placeholder="Long (E077-36.6)"
                                    value={longData}
                                    onChange={(e) => setLongData(e.target.value)}
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiOutlinedInput-root": { borderRadius: 0 }
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* SWAP BUTTON */}
                <IconButton
                    onClick={() => setIsAirportToLatLong(!isAirportToLatLong)}
                    sx={{
                        bgcolor: "white",
                        "&:hover": { bgcolor: "#e0e0e0" },
                        boxShadow: 1,
                        flexShrink: 0
                    }}
                >
                    <SwapHorizIcon sx={{ color: "#1976d2" }} />
                </IconButton>

                {/* TO SECTION */}
                <Box sx={{ display: "flex", alignItems: "stretch", bgcolor: "#1976d2", borderRadius: 1, flex: "1 1 300px" }}>
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", color: "white", fontWeight: "bold", borderRight: "1px solid rgba(255,255,255,0.2)" }}>To:</Box>
                    <Box sx={{ bgcolor: "white", flex: 1, borderTopRightRadius: 4, borderBottomRightRadius: 4, overflow: "hidden" }}>
                        {!isAirportToLatLong ? (
                            <LocationAutocomplete
                                value={airportData}
                                onChange={setAirportData}
                                label=""
                                isRequired={false}
                            />
                        ) : (
                            <Box sx={{ display: "flex", height: "100%" }}>
                                <TextField
                                    placeholder="Lat (N12-58.2)"
                                    value={latData}
                                    onChange={(e) => setLatData(e.target.value)}
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiOutlinedInput-root": { borderRadius: 0 },
                                        borderRight: "1px solid #eee"
                                    }}
                                />
                                <TextField
                                    placeholder="Long (E077-40.3)"
                                    value={longData}
                                    onChange={(e) => setLongData(e.target.value)}
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiOutlinedInput-root": { borderRadius: 0 }
                                    }}
                                />
                            </Box>
                        )}
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
                        py: 1.5,
                        "&:hover": { bgcolor: "#1565c0" },
                        flexShrink: 0
                    }}
                >
                    Calculate
                </Button>
            </Box>

            {showResult && distance !== null && (
                <Box sx={{ bgcolor: "#eef5fa", position: "relative" }}>
                    <IconButton onClick={() => setShowResult(false)} sx={{ position: "absolute", right: 8, top: 8, color: "#666" }}><CloseIcon /></IconButton>
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h6" gutterBottom>The distance is</Typography>
                        <Typography variant="h2" sx={{ fontWeight: "bold", my: 2 }}>
                            {getDisplayDistance()}{" "}<Typography component="span" variant="h4" sx={{ fontWeight: "normal" }}>{getUnitLabel()}</Typography>
                        </Typography>
                        <RadioGroup row value={unit} onChange={(e) => setUnit(e.target.value as any)} sx={{ justifyContent: "center", mt: 2 }}>
                            <FormControlLabel value="nautical" control={<Radio />} label="Nautical Miles" />
                            <FormControlLabel value="miles" control={<Radio />} label="Miles" />
                            <FormControlLabel value="kilometers" control={<Radio />} label="Kilometers" />
                        </RadioGroup>
                    </Box>

                    <TableContainer component={Paper} square elevation={0}>
                        <Table>
                            <TableHead sx={{ bgcolor: "#6c757d" }}>
                                <TableRow>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Details</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nearest Airport (if Lat/Long)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ bgcolor: "white" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
                                    <TableCell sx={{ color: "#1976d2" }}>
                                        {isAirportToLatLong ? (
                                            <>{airportData?.code} - {airportData?.name}</>
                                        ) : (
                                            <>{latData}, {longData}</>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!isAirportToLatLong && nearestAirport ? (
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: "bold" }}>{nearestAirport.code}</Typography>
                                                <Typography variant="caption">{nearestAirport.name} ({formatDistanceInUnit(nearestDistance)})</Typography>
                                            </Box>
                                        ) : "N/A"}
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
                                    <TableCell sx={{ color: "#1976d2" }}>
                                        {!isAirportToLatLong ? (
                                            <>{airportData?.code} - {airportData?.name}</>
                                        ) : (
                                            <>{latData}, {longData}</>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isAirportToLatLong && nearestAirport ? (
                                            <Box>
                                                <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: "bold" }}>{nearestAirport.code}</Typography>
                                                <Typography variant="caption">{nearestAirport.name} ({formatDistanceInUnit(nearestDistance)})</Typography>
                                            </Box>
                                        ) : "N/A"}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </>
    );
};

// ============ MAIN WRAPPER WITH MODE SELECTION ============
const AirportDistanceCalculator = () => {
    const [mode, setMode] = useState<"airport" | "helicopter" | "custom">("airport");

    return (
        <Card sx={{ mt: 4, overflow: "hidden" }} className="distance_view">
            {/* Mode Selection Header */}
            <Box sx={{ bgcolor: "#0d2d6c", p: 2 }}>
                <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
                    Distance Calculator
                </Typography>
                <RadioGroup
                    row
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "airport" | "helicopter" | "custom")}
                >
                    <FormControlLabel
                        value="airport"
                        control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#1976d2" } }} />}
                        label={<Typography sx={{ color: "white" }}>Airport Mode</Typography>}
                    />
                    <FormControlLabel
                        value="helicopter"
                        control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#1976d2" } }} />}
                        label={<Typography sx={{ color: "white" }}>Helicopter Mode</Typography>}
                    />
                    <FormControlLabel
                        value="custom"
                        control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#1976d2" } }} />}
                        label={<Typography sx={{ color: "white" }}>Custom Mode</Typography>}
                    />
                </RadioGroup>
            </Box>

            {/* Render selected calculator */}
            {mode === "airport" && <AirportCalculator />}
            {mode === "helicopter" && <HelicopterCalculator />}
            {mode === "custom" && <CustomCalculator />}
        </Card>
    );
};

export default AirportDistanceCalculator;
