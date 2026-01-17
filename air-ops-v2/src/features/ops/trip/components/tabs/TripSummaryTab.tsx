import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Grid,
    CircularProgress,
    Button,
} from "@mui/material";
import moment from "moment";
import {
    GET_TRIP_DETAILS_BY_ID,
} from "@/lib/graphql/queries/trip-detail";
import useGql from "@/lib/graphql/gql";
import { GET_PASSENGER_DETAILS } from "@/lib/graphql/queries/passenger-detail";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useSnackbar } from "@/app/providers";

const cloudfrontBaseUrl = import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

interface TripSummaryTabProps {
    tripId: string;
}

const SECTION_TITLE_STYLE = {
    backgroundColor: '#f0f0f0',
    padding: '8px 12px',
    fontWeight: 'bold',
    borderLeft: '5px solid #0056b3',
    marginBottom: '16px',
    fontSize: '1rem',
    color: '#333'
};

const GRID_LABEL_STYLE = {
    fontSize: '0.75rem',
    color: '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    display: 'block'
};


const GRID_VALUE_STYLE = {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#000'
};

const DOCUMENT_LINK_STYLE = {
    textDecoration: 'none',
    color: '#0056b3',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
};


const TripSummaryTab: React.FC<TripSummaryTabProps> = ({ tripId }) => {
    const [tripData, setTripData] = useState<any>(null);
    const [passengerData, setPassengerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const showSnackbar = useSnackbar();


    const fetchTripDetails = async () => {
        try {
            const response = await useGql({
                query: GET_TRIP_DETAILS_BY_ID,
                queryName: "tripDetail",
                queryType: "query-without-edge",
                variables: { id: tripId },
            });
            setTripData(response);
            return response;
        } catch (error) {
            console.error("Error fetching trip details:", error);
            showSnackbar("Failed to fetch trip details", "error");
            return null;
        }
    };

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
        if (tripId) init();
    }, [tripId]);

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    if (!tripData) return <Box p={5}><Typography>Trip data not available</Typography></Box>;

    return (
        <Box sx={{
            backgroundColor: '#fff',
            p: 4,
            width: '100%',
            maxWidth: '210mm', // Approximate A4 width
            margin: '0 auto',
            border: '1px solid #ddd',
            boxShadow: 'none' // Remove heavy shadow for document look
        }}>

            {/* Header with Actions */}
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ borderBottom: '2px solid #333', pb: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#000', mb: 0.5 }}>TRIP COMPLIANCE REPORT</Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>SYSTEM GENERATED SUMMARY</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PictureAsPdfIcon />}
                    href={`${apiBaseUrl}api/reports/trip/${tripData.tripId}/pdf`}
                    target="_blank"
                    sx={{ textTransform: 'none' }}
                >
                    Export Full Report PDF
                </Button>
            </Box>

            {/* A. Trip Overview */}
            <Box sx={{ mb: 4 }}>
                <Box sx={SECTION_TITLE_STYLE}>TRIP OVERVIEW</Box>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={4}>
                        <Typography sx={GRID_LABEL_STYLE}>Trip ID</Typography>
                        <Typography sx={GRID_VALUE_STYLE}>{tripData.tripId}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography sx={GRID_LABEL_STYLE}>Quotation No</Typography>
                        <Typography sx={GRID_VALUE_STYLE}>{tripData.quotationNo}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography sx={GRID_LABEL_STYLE}>Operation Type</Typography>
                        <Typography sx={GRID_VALUE_STYLE}>{tripData.quotation?.category || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography sx={GRID_LABEL_STYLE}>Aircraft</Typography>
                        <Typography sx={GRID_VALUE_STYLE}>{tripData.quotation?.aircraft?.name} ({tripData.quotation?.aircraft?.code})</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography sx={GRID_LABEL_STYLE}>Total Sectors</Typography>
                        <Typography sx={GRID_VALUE_STYLE}>{tripData.sectors?.length || 0}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography sx={GRID_LABEL_STYLE}>Created Date</Typography>
                        <Typography sx={GRID_VALUE_STYLE}>{moment(tripData.createdAt).format("DD MMM YYYY")}</Typography>
                    </Grid>
                </Grid>
            </Box>

            {/* Sectors */}
            {tripData.sectors?.map((sector: any) => (
                <Box key={sector.sectorNo} sx={{ mb: 4 }}>
                    <Box sx={SECTION_TITLE_STYLE} display="flex" justifyContent="space-between" alignItems="center">
                        <span>
                            SECTOR {sector.sectorNo}: {sector.source?.city || sector.source?.name} ({sector.source?.code}) ➝{" "}
                            {sector.destination?.city || sector.destination?.name} ({sector.destination?.code})
                        </span>
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
                            <PictureAsPdfIcon fontSize="small" /> Export PDF
                        </a>
                    </Box>

                    {/* Sector Header Block */}
                    <Box sx={{ backgroundColor: '#fafafa', p: 2, border: '1px solid #eee', mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography sx={GRID_LABEL_STYLE}>DEPARTURE</Typography>
                                <Typography sx={GRID_VALUE_STYLE}>
                                    {moment(sector.depatureDate).format("DD MMM YYYY")} {sector.depatureTime}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={GRID_LABEL_STYLE}>ARRIVAL</Typography>
                                <Typography sx={GRID_VALUE_STYLE}>
                                    {moment(sector.arrivalDate).format("DD MMM YYYY")} {sector.arrivalTime}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 1. Passenger Manifest */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>1. Passenger Manifest</Typography>
                        {(() => {
                            const paxNode = passengerData?.[0];
                            const paxSector = paxNode?.sectors?.find((s: any) => s.sectorNo === sector.sectorNo);
                            const passengers = paxSector?.passengers || [];

                            if (passengers.length > 0) {
                                return (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Name</th>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Gender</th>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Age</th>
                                                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>ID Proof</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {passengers.map((pax: any, idx: number) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{pax.name}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{pax.gender}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{pax.age}</td>
                                                    <td style={{ padding: '8px' }}>{pax.aadharId || "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            } else {
                                return <Typography variant="body2" color="text.secondary" fontStyle="italic">No passengers listed.</Typography>;
                            }
                        })()}

                        {/* Ground Handling Info (from Passenger Data) */}
                        {(() => {
                            const paxNode = passengerData?.[0];
                            const paxSector = paxNode?.sectors?.find((s: any) => s.sectorNo === sector.sectorNo);
                            const sourceGH = paxSector?.sourceGroundHandler;
                            const destGH = paxSector?.destinationGroundHandler;

                            if (!sourceGH && !destGH) return null;

                            const renderGH = (title: string, data: any) => {
                                if (!data?.fullName && !data?.contactNumber && !data?.email) return null;
                                return (
                                    <Box sx={{ flex: 1, p: 1.5, border: '1px solid #eee', borderRadius: '4px', bgcolor: '#fafafa' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', mb: 0.5, display: 'block', textTransform: 'uppercase' }}>
                                            {title}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {data.fullName || "N/A"}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                            📞 {data.contactNumber || data.alternateContactNumber || "N/A"}
                                        </Typography>
                                        {data.email && (
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                ✉ {data.email}
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            };

                            return (
                                <Box mt={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            {renderGH(`Source Handler (${sector.source?.code || 'Departure'})`, sourceGH)}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {renderGH(`Dest. Handler (${sector.destination?.code || 'Arrival'})`, destGH)}
                                        </Grid>
                                    </Grid>
                                </Box>
                            );
                        })()}
                    </Box>

                    {/* 2. Crew */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>2. Crew Assignment</Typography>
                        {sector.assignedCrews?.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                                        <th style={{ padding: '8px', width: '30%', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Designation</th>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Crew Members</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sector.assignedCrews.map((crewGroup: any, idx: number) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '8px', borderRight: '1px solid #ddd', fontWeight: 500 }}>{crewGroup.designation}</td>
                                            <td style={{ padding: '8px' }}>
                                                {crewGroup.crewsInfo?.map((c: any) => c.fullName || c.displayName || "N/A").join(", ")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <Typography variant="body2" color="text.secondary" fontStyle="italic">No crew assigned.</Typography>}
                    </Box>

                    {/* 3. BA Evidence */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>3. BA Evidence</Typography>
                        {sector.baInfo ? (
                            <Box>
                                {sector.baInfo.baMachine && (
                                    <Box mb={1} fontSize="0.85rem">
                                        <strong>BA Machine:</strong> {sector.baInfo.baMachine}
                                    </Box>
                                )}
                                {sector.baInfo.baPersons?.length > 0 && (
                                    <Box mb={2} fontSize="0.85rem">
                                        <strong>Authorized Personnel:</strong>
                                        <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                                            {sector.baInfo.baPersons.map((p: any, i: number) => (
                                                <li key={i}>{p.name} ({p.gender}, {p.age}y) — Cert: {p.certNo || "N/A"}</li>
                                            ))}
                                        </ul>
                                    </Box>
                                )}

                                {sector.baInfo.baReports?.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Crew Name</th>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Reading</th>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Time</th>
                                                <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>Report</th>
                                                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Video</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sector.baInfo.baReports.map((ba: any, i: number) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{ba.name}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{ba.reading || "0.000"}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{moment(ba.conductedDate).format("HH:mm")}</td>
                                                    <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>
                                                        {ba.record ? (
                                                            <a href={`${cloudfrontBaseUrl}${ba.record}`} target="_blank" style={DOCUMENT_LINK_STYLE}>
                                                                View PDF
                                                            </a>
                                                        ) : "-"}
                                                    </td>
                                                    <td style={{ padding: '8px' }}>
                                                        {ba.video ? (
                                                            <a href={`${cloudfrontBaseUrl}${ba.video}`} target="_blank" style={DOCUMENT_LINK_STYLE}>
                                                                View Video
                                                            </a>
                                                        ) : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : <Typography variant="body2" color="text.secondary" fontStyle="italic">No BA reports generated.</Typography>}

                            </Box>
                        ) : <Typography variant="body2" color="text.secondary" fontStyle="italic">No BA evidence recorded.</Typography>}
                    </Box>

                    {/* 4. Fuel Info */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>4. Fuel Information</Typography>
                        {sector.fuelRecord ? (
                            <Box sx={{ border: '1px solid #ddd', p: 1.5 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Typography sx={GRID_LABEL_STYLE}>Station</Typography>
                                        <Typography sx={GRID_VALUE_STYLE}>{sector.fuelRecord.fuelStation || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography sx={GRID_LABEL_STYLE}>On Arrival</Typography>
                                        <Typography sx={GRID_VALUE_STYLE}>{sector.fuelRecord.fuelOnArrival || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography sx={GRID_LABEL_STYLE}>Loaded</Typography>
                                        <Typography sx={GRID_VALUE_STYLE}>{sector.fuelRecord.fuelLoaded || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography sx={GRID_LABEL_STYLE}>Receipt</Typography>
                                        <Typography sx={GRID_VALUE_STYLE}>
                                            {sector.fuelRecord.fuelReceipt ? (
                                                <a href={`${cloudfrontBaseUrl}${sector.fuelRecord.fuelReceipt}`} target="_blank" style={DOCUMENT_LINK_STYLE}>
                                                    View Receipt
                                                </a>
                                            ) : '-'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : <Typography variant="body2" color="text.secondary" fontStyle="italic">No fuel record found.</Typography>}
                    </Box>

                    {/* 5. Docs */}
                    <Box mb={4}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>5. Operational Documents</Typography>
                        {sector.documents?.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
                                        <th style={{ padding: '8px', borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd', width: '40%' }}>Document Type</th>
                                        <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sector.documents.map((doc: any, i: number) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>{doc.type || "Document"}</td>
                                            <td style={{ padding: '8px' }}>
                                                {doc.fileUrl ? (
                                                    <a href={`${cloudfrontBaseUrl}${doc.fileUrl}`} target="_blank" style={DOCUMENT_LINK_STYLE}>
                                                        View Document
                                                    </a>
                                                ) : doc.externalLink ? (
                                                    <a href={doc.externalLink} target="_blank" style={DOCUMENT_LINK_STYLE}>
                                                        View External
                                                    </a>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <Typography variant="body2" color="text.secondary" fontStyle="italic">No operational documents uploaded.</Typography>}
                    </Box>

                    <Divider sx={{ borderStyle: 'dashed' }} />
                </Box>
            ))}

            {/* Footer */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    ✔ Generated on: {moment().format("DD MMM YYYY HH:mm")} | AirOps Platform
                </Typography>
            </Box>

        </Box>
    );
};

export default TripSummaryTab;
