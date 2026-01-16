import { Box, Typography, Divider, Grid } from "@mui/material";
import moment from "moment";
import FlightIcon from "@mui/icons-material/Flight";
import WorldMap from "../../../../../assets/world-map-dots.jpg";

interface BoardingPassCardProps {
    data: any;
}

export const BoardingPassCard = ({ data }: BoardingPassCardProps) => {
    const { flight, passenger, boardingPassId, groundHandlers, sectorNo } = data;

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "650px", // Reduced size
                bgcolor: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                fontFamily: "'Inter', sans-serif",
                mb: 3,
                border: "1px solid #e0e0e0",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    bgcolor: "#5E6CFF",
                    color: "white",
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "50px",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 2, fontSize: "1rem" }}>
                    BOARDING PASS
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 2, fontSize: "1rem" }}>
                    SECTOR- {sectorNo}
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                {/* Left Section */}
                <Box sx={{
                    flex: 2.2,
                    p: 3,
                    borderRight: { md: "2px dashed #e0e0e0" },
                    position: 'relative',
                    backgroundImage: `url(${WorldMap})`,
                    backgroundSize: '80%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}>
                    {/* White overlay for readability */}
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        zIndex: 0
                    }} />

                    <Box position="relative" zIndex={1}>
                        {/* Passenger Info First */}
                        <Grid container spacing={2} sx={{ mb: 1 }}>
                            <Grid item xs={4}>
                                <Typography variant="caption" color="text.secondary">PASSENGER</Typography>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#5E6CFF" }}>
                                    {passenger.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="caption" color="text.secondary">GENDER</Typography>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {passenger.gender}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="caption" color="text.secondary">AGE</Typography>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {passenger.age}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="caption" color="text.secondary">GOVT ID</Typography>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {passenger.govtId}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 1 }} />

                        {/* Flight Info Section */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            {/* FROM */}
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>FROM:</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: "#5E6CFF", lineHeight: 1 }}>
                                    {flight.fromCode}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#5E6CFF", fontWeight: 500, mb: 1 }}>
                                    {flight.fromCity}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#333" }}>
                                    {moment(flight.departureDate).format("MMM DD, YYYY")}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 800, color: "#333" }}>
                                    {flight.departureTime}
                                </Typography>
                            </Box>

                            {/* ICON */}
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" pt={1}>
                                <FlightIcon sx={{ fontSize: "3.5rem", color: "#d1d5db", transform: "rotate(90deg)" }} />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{flight.flightTime}</Typography>
                                {flight.aircraft && (
                                    <Typography variant="h5" color="text.secondary" fontWeight="bold">
                                        {flight?.aircraft?.code || flight?.aircraft?.name}
                                    </Typography>
                                )}
                            </Box>

                            {/* TO */}
                            <Box textAlign="right">
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>TO:</Typography>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: "#5E6CFF", lineHeight: 1 }}>
                                    {flight.toCode}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#5E6CFF", fontWeight: 500, mb: 1 }}>
                                    {flight.toCity}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#333" }}>
                                    {moment(flight.arrivalDate).format("MMM DD, YYYY")}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 800, color: "#333" }}>
                                    {flight.arrivalTime}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Ground Handlers - Below Flight Info */}
                        <Divider sx={{ mt: 1.5, mb: 1 }} />

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#d32f2f', letterSpacing: '0.5px', mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
                                GROUND HANDLER / COORDINATOR INFO:
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                {/* Source Handler - Below FROM */}
                                <Box>
                                    {groundHandlers?.source ? (
                                        <>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#5E6CFF', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                {groundHandlers?.source?.fullName}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: '#333' }}>
                                                {groundHandlers?.source?.contactNumber}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#5E6CFF', display: 'block', fontSize: '0.75rem' }}>
                                            N/A
                                        </Typography>
                                    )}
                                </Box>

                                {/* Destination Handler - Below TO */}
                                <Box sx={{ textAlign: 'right' }}>
                                    {groundHandlers?.destination ? (
                                        <>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#5E6CFF', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                                {groundHandlers?.destination?.fullName}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', color: '#333' }}>
                                                {groundHandlers?.destination?.contactNumber}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#5E6CFF', display: 'block', fontSize: '0.75rem' }}>
                                            N/A
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Right Stub */}
                <Box sx={{ flex: 1, p: 3, bgcolor: "#FAFAFA", display: 'flex', flexDirection: 'column' }}>
                    {/* Passenger Info at Top */}
                    <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">PASSENGER</Typography>
                        <Typography variant="h6" sx={{ color: "#5E6CFF", fontWeight: "bold", lineHeight: 1.2 }}>
                            {passenger.name}
                        </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">DATE</Typography>
                            <Typography variant="body2" fontWeight="bold">{moment(flight.departureDate).format("MMM DD")}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">DEPART</Typography>
                            <Typography variant="body2" fontWeight="bold">{flight.departureTime}</Typography>
                        </Grid>
                    </Grid>

                    {/* BP ID */}
                    <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">BP ID</Typography>
                        <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.7rem' }}>
                            {boardingPassId}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
