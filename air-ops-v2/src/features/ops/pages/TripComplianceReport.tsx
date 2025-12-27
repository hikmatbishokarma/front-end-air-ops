
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid,
    CircularProgress,
    Container,
    Button,
} from "@mui/material";
import moment from "moment";
import {
    GET_TRIP_DETAILS_BY_ID,
} from "../../../lib/graphql/queries/trip-detail";
import useGql from "../../../lib/graphql/gql";
import { GET_PASSENGER_DETAILS } from "../../../lib/graphql/queries/passenger-detail";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const cloudfrontBaseUrl =
    import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";


const TripComplianceReportPage = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [tripData, setTripData] = useState<any>(null);
    const [passengerData, setPassengerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Trip Details
    const fetchTripDetails = async () => {
        try {
            const response = await useGql({
                query: GET_TRIP_DETAILS_BY_ID,
                queryName: "tripDetail",
                queryType: "query-without-edge",
                variables: { id: tripId },
            });


            setTripData(response);
            return response; // Return data for chaining if needed
        } catch (error) {
            console.error("Error fetching trip details:", error);
            return null;
        }
    };

    // Fetch Passengers
    const fetchPassengers = async (quotationNo: string) => {
        try {
            const response = await useGql({
                query: GET_PASSENGER_DETAILS,
                queryName: "passengerDetails",
                queryType: "query",
                variables: {
                    filter: { quotationNo: { eq: quotationNo } },
                },
            });
            // response is the list of nodes because queryType="query" returns nodes
            setPassengerData(response || []);
        } catch (error) {
            console.error("Error fetching passengers:", error);
        }
    }


    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const trip = await fetchTripDetails();
            if (trip && trip.quotationNo) {
                await fetchPassengers(trip.quotationNo);
            }
            setLoading(false);
        };

        if (tripId) {
            init();
        }
    }, [tripId]);

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    if (!tripData) return <Box p={5}><Typography>Trip not found</Typography></Box>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Navigation */}
            <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PictureAsPdfIcon />}
                    href={`${apiBaseUrl}api/reports/trip/${tripData.tripId}/pdf`}
                    target="_blank"
                >
                    Export Full Report PDF
                </Button>
            </Box>

            {/* Header */}
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="bold">TRIP COMPLIANCE REPORT</Typography>

                </Box>

                {/* A. Trip Overview */}
                <Box sx={{ mt: 1, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">Trip Overview</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" display="block">Trip ID</Typography>
                            <Typography variant="body2" fontWeight={500}>{tripData.tripId}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" display="block">Quotation No</Typography>
                            <Typography variant="body2" fontWeight={500}>{tripData.quotationNo}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" display="block">Operation Type</Typography>
                            <Typography variant="body2" fontWeight={500}>NSOP / Charter</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" display="block">Aircraft</Typography>
                            <Typography variant="body2" fontWeight={500}>{tripData.quotation?.aircraft?.name} ({tripData.quotation?.aircraft?.code})</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" display="block">Total Sectors</Typography>
                            <Typography variant="body2" fontWeight={500}>{tripData.sectors?.length || 0}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" display="block">Date</Typography>
                            <Typography variant="body2" fontWeight={500}>{moment(tripData.createdAt).format("DD MMM YYYY")}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Sectors will go here */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Sector-Wise Compliance</Typography>

            {tripData.sectors?.map((sector: any) => (
                <Paper key={sector.sectorNo} elevation={2} sx={{ mb: 2, p: 2 }}>
                    {/* 1. Sector Header with PDF Button */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                        <Box>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">Sector {sector.sectorNo}: {sector.source?.code} ➝ {sector.destination?.code}</Typography>
                            <Box display="flex" gap={2} mt={0.5}>
                                <Typography variant="caption"><strong>DEP:</strong> {moment(sector.depatureDate).format("DD MMM YYYY")} {sector.depatureTime}</Typography>
                                <Typography variant="caption"><strong>ARR:</strong> {moment(sector.arrivalDate).format("DD MMM YYYY")} {sector.arrivalTime}</Typography>
                            </Box>
                        </Box>
                        <a
                            href={`${apiBaseUrl}api/reports/trip/${tripData.tripId}/sector/${sector.sectorNo}/pdf`}
                            target="_blank"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none',
                                color: '#0056b3',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                border: '1px solid #0056b3',
                                padding: '4px 8px',
                                borderRadius: '4px'
                            }}
                        >
                            <PictureAsPdfIcon fontSize="small" /> Export Sector PDF
                        </a>
                    </Box>

                    {/* 2. Passenger Manifest */}
                    <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ bgcolor: '#eee', px: 1, py: 0.5 }}>Passenger Manifest</Typography>
                        {(() => {
                            const paxNode = passengerData?.[0]; // Assuming one passenger detail per quotation
                            const paxSector = paxNode?.sectors?.find((s: any) => s.sectorNo === sector.sectorNo);
                            const passengers = paxSector?.passengers || [];

                            if (passengers.length > 0) {
                                return (
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.8rem' }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                                                        <th style={{ padding: '4px 8px', borderBottom: '1px solid #ddd' }}>Name</th>
                                                        <th style={{ padding: '4px 8px', borderBottom: '1px solid #ddd' }}>Gender</th>
                                                        <th style={{ padding: '4px 8px', borderBottom: '1px solid #ddd' }}>Age</th>
                                                        <th style={{ padding: '4px 8px', borderBottom: '1px solid #ddd' }}>ID Proof</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {passengers.map((pax: any, idx: number) => (
                                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                                            <td style={{ padding: '4px 8px' }}>{pax.name}</td>
                                                            <td style={{ padding: '4px 8px' }}>{pax.gender}</td>
                                                            <td style={{ padding: '4px 8px' }}>{pax.age}</td>
                                                            <td style={{ padding: '4px 8px' }}>{pax.aadharId || "N/A"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                );
                            } else {
                                return <Typography variant="body2" color="warning.main">No passenger manifest found for this sector</Typography>;
                            }
                        })()}
                    </Box>

                    {/* 3. Crew */}
                    <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ bgcolor: '#eee', px: 1, py: 0.5 }}>Crew Assignment</Typography>
                        {sector.assignedCrews?.length > 0 ? (
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.8rem' }}>
                                <tbody>
                                    {sector.assignedCrews.map((crewGroup: any, idx: number) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '4px 8px', width: '30%', fontWeight: 'bold' }}>{crewGroup.designation}</td>
                                            <td style={{ padding: '4px 8px' }}>
                                                {crewGroup.crewsInfo?.map((c: any) => c.fullName || c.displayName || "N/A").join(", ")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Box>
                        ) : <Typography variant="caption" color="error">No crew assigned</Typography>}
                    </Box>

                    {/* 4. BA Evidence */}
                    <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ bgcolor: '#eee', px: 1, py: 0.5 }}>BA Evidence</Typography>

                        {sector.baInfo && (
                            <Box mb={1} px={1}>
                                {sector.baInfo.baMachine ? (
                                    <Typography variant="body2" fontSize="0.8rem" mb={1}>
                                        <strong>BA Machine:</strong> {sector.baInfo.baMachine}
                                    </Typography>
                                ) : null}

                                {sector.baInfo.baPersons?.length > 0 ? (
                                    <Box mb={1}>
                                        <Typography variant="caption" fontWeight="bold" display="block" sx={{ textDecoration: 'underline' }}>Authorized Personnel:</Typography>
                                        {sector.baInfo.baPersons.map((p: any, idx: number) => (
                                            <Typography key={idx} variant="body2" fontSize="0.8rem">
                                                • {p.name} ({p.gender}, {p.age}y) — Cert: {p.certNo || "N/A"}
                                            </Typography>
                                        ))}
                                    </Box>
                                ) : null}
                            </Box>
                        )}
                        {sector.baInfo?.baReports?.length > 0 ? (
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                                        <th style={{ padding: '4px 8px' }}>Crew Name</th>
                                        <th style={{ padding: '4px 8px' }}>Reading</th>
                                        <th style={{ padding: '4px 8px' }}>Time</th>
                                        <th style={{ padding: '4px 8px' }}>Report</th>
                                        <th style={{ padding: '4px 8px' }}>Video</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sector.baInfo.baReports.map((ba: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '4px 8px' }}>{ba.name}</td>
                                            <td style={{ padding: '4px 8px' }}>{ba.reading || "0.000"}</td>
                                            <td style={{ padding: '4px 8px' }}>{moment(ba.conductedDate).format("DD-MM-YYYY HH:mm")}</td>
                                            <td style={{ padding: '4px 8px' }}>
                                                {/* {ba.record ? <Button size="small" href={`${cloudfrontBaseUrl}${ba.record}`} target="_blank">View</Button> : "-"} */}
                                                {ba.record ?
                                                    <a
                                                        href={`${cloudfrontBaseUrl}${ba?.record}`}
                                                        target="_blank"
                                                        style={{ textDecoration: 'none', color: '#1976d2' }}
                                                    >
                                                        View PDF
                                                    </a>
                                                    : "-"}
                                            </td>
                                            <td style={{ padding: '4px 8px' }}>
                                                {ba.video ?
                                                    <a
                                                        href={`${cloudfrontBaseUrl}${ba?.video}`}
                                                        target="_blank"
                                                        style={{ textDecoration: 'none', color: '#1976d2' }}
                                                    >
                                                        View Video
                                                    </a> : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Box>
                        ) : <Typography variant="body2" color="error">No BA Records Found</Typography>}
                    </Box>



                    {/* 5. Fuel Info */}
                    <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ bgcolor: '#eee', px: 1, py: 0.5 }}>Fuel Information</Typography>
                        {sector.fuelRecord ? (
                            <Grid container spacing={1}>
                                <Grid item xs={6} md={3}><Typography variant="body2" fontSize="0.8rem"><strong>Station:</strong> {sector.fuelRecord.fuelStation}</Typography></Grid>
                                <Grid item xs={6} md={3}><Typography variant="body2" fontSize="0.8rem"><strong>On Arr:</strong> {sector.fuelRecord.fuelOnArrival}</Typography></Grid>
                                <Grid item xs={6} md={3}><Typography variant="body2" fontSize="0.8rem"><strong>Loaded:</strong> {sector.fuelRecord.fuelLoaded}</Typography></Grid>
                                <Grid item xs={6} md={3}><Typography variant="body2" fontSize="0.8rem"><strong>Guage:</strong> {sector.fuelRecord.fuelGauge}</Typography></Grid>
                                <Grid item xs={6} md={3}>
                                    {sector.fuelRecord.fuelReceipt && (
                                        <a
                                            href={`${cloudfrontBaseUrl}${sector.fuelRecord.fuelReceipt}`}
                                            target="_blank"
                                            style={{ textDecoration: 'none', color: '#1976d2' }}
                                        >
                                            View Receipt
                                        </a>
                                    )}
                                </Grid>
                            </Grid>
                        ) : <Typography variant="body2" color="warning.main">No Fuel Record</Typography>}
                    </Box>

                    {/* 6. Documents */}
                    <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ bgcolor: '#eee', px: 1, py: 0.5 }}>Operational Documents</Typography>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                            {sector.documents?.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.8rem' }}>
                                    <tbody>
                                        {sector.documents.map((doc: any, i: number) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '4px 8px', width: '40%' }}>{doc.type || "Document"}</td>
                                                <td style={{ padding: '4px 8px' }}>
                                                    {doc.fileUrl ? (
                                                        <a href={`${cloudfrontBaseUrl}${doc.fileUrl}`} target="_blank" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                            View Document
                                                        </a>
                                                    ) : doc.externalLink ? (
                                                        <a href={doc.externalLink} target="_blank" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                            View External
                                                        </a>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <Typography variant="caption" color="error">No documents uploaded</Typography>}
                        </Box>
                    </Box>

                </Paper>
            ))}

            {/* Compliance Summary */}
            <Paper sx={{ p: 2, mt: 2, bgcolor: '#e3f2fd' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" fontSize="0.9rem">Compliance Summary</Typography>
                <Box>
                    <Typography variant="caption" display="block">✔ Report generated automatically by system</Typography>
                    <Typography variant="caption" display="block">✔ Generated on: {moment().format("DD MMM YYYY HH:mm")}</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TripComplianceReportPage;
