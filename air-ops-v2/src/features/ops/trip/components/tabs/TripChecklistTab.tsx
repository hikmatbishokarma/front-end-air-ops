import React, { useEffect, useState } from "react";
import useGql from "@/lib/graphql/gql"; // Adjust import path
import { gql } from "@apollo/client";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel"; // Or appropriate icon
import { useTheme } from "@mui/material/styles";

// Define the GraphQL query
const GET_TRIP_CHECKLIST = gql`
  query GetTripChecklist($tripId: String!) {
    tripChecklist(tripId: $tripId) {
      sectors {
        sectorNo
        source {
          name
          code
          city
        }
        destination {
          name
          code
          city
        }
        checklist {
          name
          status
        }
      }
    }
  }
`;

interface ChecklistItem {
    name: string;
    status: boolean;
}

interface ChecklistLocation {
    name: string;
    code: string;
    city: string;
}

interface SectorChecklist {
    sectorNo: number;
    source: ChecklistLocation;
    destination: ChecklistLocation;
    checklist: ChecklistItem[];
}

interface TripChecklistTabProps {
    tripId: string;
}

const TripChecklistTab: React.FC<TripChecklistTabProps> = ({ tripId }) => {
    const theme = useTheme();
    const [checklistData, setChecklistData] = useState<SectorChecklist[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<number | false>(0); // Default expand first (index 0)

    const fetchChecklist = async () => {
        setLoading(true);
        try {
            const response = await useGql({
                query: GET_TRIP_CHECKLIST,
                queryName: "tripChecklist",
                queryType: "query-without-edge", // Assuming this utility handles simple queries
                variables: { tripId },
            });

            if (response && response.sectors) {
                setChecklistData(response.sectors);
                // If data exists, expand the first sector (sectorNo 1 usually corresponds to index 0 logic if strict, but let's use accordion index)
                // setExpanded(0); 
            }
        } catch (err: any) {
            console.error("Error fetching checklist:", err);
            setError("Failed to load checklist.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tripId) {
            fetchChecklist();
        }
    }, [tripId]);

    const handleChange =
        (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!checklistData || checklistData.length === 0) {
        return (
            <Box p={2}>
                <Typography>No checklist data available.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            {checklistData.map((sector, index) => (
                <Accordion
                    key={sector.sectorNo}
                    expanded={expanded === index}
                    onChange={handleChange(index)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${sector.sectorNo}-content`}
                        id={`panel${sector.sectorNo}-header`}
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box
                                sx={{
                                    backgroundColor: "#E3F2FD",
                                    color: "#1976D2",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    fontSize: "0.75rem",
                                    mr: 1,
                                }}
                            >
                                Sector {sector.sectorNo}
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {sector.source?.name}/{sector.source?.code} &rarr; {sector.destination?.name}/{sector.destination?.code}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List dense>
                            {sector.checklist.map((item, idx) => (
                                <ListItem key={idx}>

                                    <ListItemText
                                        primary={
                                            <Typography style={{ color: "black" }}>
                                                {item.name}
                                            </Typography>
                                        }
                                    />
                                    <ListItemIcon>
                                        {item.status ? (
                                            <CheckCircleIcon color="success" />
                                        ) : (
                                            <CancelIcon color="error" /> // Or default color if just pending
                                        )}
                                    </ListItemIcon>
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default TripChecklistTab;
