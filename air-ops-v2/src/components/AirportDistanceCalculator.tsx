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
import { GET_AIRPORTS } from "@/lib/graphql/queries/airports";

type Airport = {
    code: string;
    name?: string;
    city?: string;
    country?: string;
    state?: string;
    lat?: string | number;
    long?: string | number;
};

// ============ ORIGINAL AIRPORT CALCULATOR (UNCHANGED) ============
const AirportCalculator = () => {
    const [fromAirport, setFromAirport] = useState<Airport | null>(null);
    const [toAirport, setToAirport] = useState<Airport | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [unit, setUnit] = useState<"nautical" | "miles" | "kilometers">("nautical");
    const [showResult, setShowResult] = useState(false);

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

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const parseCoordinate = (coord: string | number | undefined): number | null => {
        if (typeof coord === "number") return coord;
        if (!coord) return null;

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

        const simple = parseFloat(coord);
        return isNaN(simple) ? null : simple;
    };

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
                    bgcolor: "#fff",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box className="ds_mobile_phone" sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, maxWidth: "800px" }}>
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

                    <FlightIcon className="ds_flight_iocn" sx={{ color: "#1976d2", transform: "rotate(90deg)", fontSize: 30 }} />

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

                    <Button className="calculate_style"
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
    const [allAirports, setAllAirports] = useState([]);
    const [fromNearestAirport, setFromNearestAirport] = useState<Airport | null>(null);
    const [toNearestAirport, setToNearestAirport] = useState<Airport | null>(null);
    const [fromNearestDistance, setFromNearestDistance] = useState<number | null>(null);
    const [toNearestDistance, setToNearestDistance] = useState<number | null>(null);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const result = await useGql({
                    query: GET_AIRPORTS,
                    queryName: "airports",
                    queryType: "query-with-count",
                    variables: {
                        filter: {},
                        paging: {
                            limit: 1000,
                            offset: 0,
                        },
                    },
                });


                if (result?.data) {
                    setAllAirports(result.data);
                }
            } catch (error) {
                console.error("Error fetching airports:", error);
            }
        };
        fetchAirports();
    }, []);


    console.log("allAirports::", allAirports)

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 3440.065;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    const parseCoordinate = (coord: string): number | null => {
        if (!coord) return null;
        const regex = /^([NSEW])(\d+)-([\d.]+)$/;
        const match = coord.match(regex);
        if (match) {
            const [, dir, deg, min] = match;
            let decimal = parseInt(deg, 10) + parseFloat(min) / 60;
            if (dir === "S" || dir === "W") decimal *= -1;
            return decimal;
        }
        const simple = parseFloat(coord);
        return isNaN(simple) ? null : simple;
    };

    const findNearestAirport = (lat: number, lon: number) => {
        if (!allAirports.length) return { airport: null, distance: null };
        let nearest: Airport | null = null;
        let minDistance = Infinity;
        allAirports.forEach((airport: any) => {
            const airportLat = parseCoordinate(String(airport.latitude));
            const airportLon = parseCoordinate(String(airport.longitude));
            if (airportLat !== null && airportLon !== null) {
                const dist = calculateDistance(lat, lon, airportLat, airportLon);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = airport;
                }
            }
        });
        return { airport: nearest, distance: minDistance === Infinity ? null : minDistance };
    };

    const handleCalculate = () => {
        const lat1 = parseCoordinate(fromLat);
        const lon1 = parseCoordinate(fromLong);
        const lat2 = parseCoordinate(toLat);
        const lon2 = parseCoordinate(toLong);

        if (lat1 !== null && lon1 !== null && lat2 !== null && lon2 !== null) {
            const dist = calculateDistance(lat1, lon1, lat2, lon2);
            setDistance(dist);
            const { airport: fromAirport, distance: fromDist } = findNearestAirport(lat1, lon1);
            const { airport: toAirport, distance: toDist } = findNearestAirport(lat2, lon2);
            setFromNearestAirport(fromAirport);
            setToNearestAirport(toAirport);
            setFromNearestDistance(fromDist);
            setToNearestDistance(toDist);
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
            <Box className="ds_mobile_phone" sx={{ bgcolor: "#fff", p: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField label="From Lat" value={fromLat} onChange={(e) => setFromLat(e.target.value)} placeholder="N13-08.1" size="small" sx={{ bgcolor: "white", borderRadius: 1, width: 140 }} />
                    <TextField label="From Long" value={fromLong} onChange={(e) => setFromLong(e.target.value)} placeholder="E077-36.6" size="small" sx={{ bgcolor: "white", borderRadius: 1, width: 140 }} />
                </Box>
                <FlightIcon className="ds_flight_iocn" sx={{ color: "#1976d2", transform: "rotate(90deg)", fontSize: 30 }} />
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField label="To Lat" value={toLat} onChange={(e) => setToLat(e.target.value)} placeholder="N12-58.2" size="small" sx={{ bgcolor: "white", borderRadius: 1, width: 140 }} />
                    <TextField label="To Long" value={toLong} onChange={(e) => setToLong(e.target.value)} placeholder="E077-40.3" size="small" sx={{ bgcolor: "white", borderRadius: 1, width: 140 }} />
                </Box>
                <Button className="calculate_style" variant="contained" onClick={handleCalculate} sx={{ bgcolor: "#1976d2", textTransform: "none", fontWeight: "bold", px: 4, "&:hover": { bgcolor: "#1565c0" } }}>Calculate</Button>
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

// ============ MAIN WRAPPER WITH MODE SELECTION ============
const AirportDistanceCalculator = () => {
    const [mode, setMode] = useState<"airport" | "helicopter">("airport");

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
                    onChange={(e) => setMode(e.target.value as "airport" | "helicopter")}
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
                </RadioGroup>
            </Box>

            {/* Render selected calculator */}
            {mode === "airport" ? <AirportCalculator /> : <HelicopterCalculator />}
        </Card>
    );
};

export default AirportDistanceCalculator;
