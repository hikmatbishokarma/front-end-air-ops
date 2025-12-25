import { useEffect, useState } from "react";
import { Box, Button, Typography, Accordion, AccordionSummary, AccordionDetails, CircularProgress, Stack } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Check if icons are available
import { useBoardingPass } from "../../../hooks/useBoardingPass";

// Fallback icon if not available, or use standard char
const ExpandIcon = () => <span>▼</span>;

interface BoardingPassTabProps {
    trip: any;
}

export default function BoardingPassTab({ trip }: BoardingPassTabProps) {
    return (
        <Box p={2}>
            {trip.sectors?.map((sector: any, index: number) => (
                <SectorBoardingPassSection key={index} tripId={trip.tripId} sector={sector} />
            ))}
        </Box>
    );
}

function SectorBoardingPassSection({ tripId, sector }: { tripId: string; sector: any }) {
    const { fetchBoardingPasses, generateBoardingPasses, boardingPasses, loading, generating } = useBoardingPass();
    const [expanded, setExpanded] = useState(false);
    const [fetchedOnce, setFetchedOnce] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
        if (!expanded && !fetchedOnce) {
            fetchBoardingPasses(tripId, sector.sectorNo);
            setFetchedOnce(true);
        }
    }

    const handleGenerate = async () => {
        await generateBoardingPasses(tripId, sector.sectorNo);
        fetchBoardingPasses(tripId, sector.sectorNo);
        setFetchedOnce(true);
    }

    return (
        <Accordion expanded={expanded} onChange={handleExpand} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandIcon />}>
                <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        Sector {sector.sectorNo}: {sector.source.code} ➝ {sector.destination.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        {new Date(sector.depatureDate).toLocaleDateString()}
                    </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                        disabled={generating}
                    >
                        {generating ? "Generating..." : "Generate Boarding Pass"}
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
                ) : (
                    <>
                        {boardingPasses && boardingPasses.length > 0 ? (
                            <BoardingPassTable boardingPasses={boardingPasses} />
                        ) : (
                            <Typography color="text.secondary" align="center">
                                No boarding passes generated yet. Click Generate to create them.
                            </Typography>
                        )}
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
}

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import PrintIcon from "@mui/icons-material/Print"; // Future use
import { BoardingPassPreviewDialog } from "../../components/boarding-pass/BoardingPassPreviewDialog";

function BoardingPassTable({ boardingPasses }: { boardingPasses: any[] }) {
    const [selectedBp, setSelectedBp] = useState<any>(null);

    return (
        <>
            <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="boarding pass table">
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell><strong>Passenger Name</strong></TableCell>
                            <TableCell><strong>Gender</strong></TableCell>
                            <TableCell><strong>Age</strong></TableCell>
                            <TableCell><strong>Govt ID</strong></TableCell>
                            <TableCell><strong>Boarding Pass ID</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boardingPasses.map((bp) => (
                            <TableRow
                                key={bp.boardingPassId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {bp.passenger.name}
                                </TableCell>
                                <TableCell>{bp.passenger.gender}</TableCell>
                                <TableCell>{bp.passenger.age}</TableCell>
                                <TableCell>{bp.passenger.govtId}</TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {bp.boardingPassId}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Boarding Pass">
                                        <IconButton color="primary" onClick={() => setSelectedBp(bp)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Preview Dialog */}
            <BoardingPassPreviewDialog
                open={!!selectedBp}
                onClose={() => setSelectedBp(null)}
                data={selectedBp}
            />
        </>
    );
}
