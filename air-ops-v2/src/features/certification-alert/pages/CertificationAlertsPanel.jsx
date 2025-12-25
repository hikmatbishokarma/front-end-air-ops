import { Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import { useState } from "react";
import CertificationAlertCard from "../components/CertificationAlertCard";
import CertificationDetailDialog from "../components/CertificationDetailDialog";
import { useStaffCertifications, useCertificationAlerts } from "../hooks/useCertificationAlerts";

export default function CertificationAlertsPanel() {
    const { certifications, loading, error } = useStaffCertifications();
    const alerts = useCertificationAlerts(certifications);
    const [selectedCertification, setSelectedCertification] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleCardClick = (certification) => {
        setSelectedCertification(certification);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedCertification(null);
    };

    console.log("certifications", certifications);
    console.log("alerts", alerts);
    console.log("loading", loading);
    console.log("error", error);

    if (loading) {
        return (
            <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px' }}>
                <CircularProgress size={24} />
                <Typography ml={2}>Loading certifications...</Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3, height: 400, borderRadius: '24px' }}>
                <Alert severity="error">Failed to load certification alerts: {error.message}</Alert>
            </Paper>
        );
    }

    return (
        <>
            <Paper sx={{ height: 400, display: 'flex', flexDirection: 'column', p: 3, borderRadius: '24px' }}>
                {/* Header */}
                <Box sx={{ pb: 1.5, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                        Certification Renewal Alerts ({alerts.length})
                    </Typography>
                </Box>

                {/* Scrollable Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    mx: -3,
                    px: 3,
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#d0d0d0',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#a0a0a0',
                    },
                }}>
                    {alerts.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" mt={4}>
                            No certification alerts at this time
                        </Typography>
                    ) : (
                        alerts.map((item) => (
                            <CertificationAlertCard
                                key={item.id}
                                item={item}
                                onClick={handleCardClick}
                            />
                        ))
                    )}
                </Box>
            </Paper>

            <CertificationDetailDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                certification={selectedCertification}
            />
        </>
    );
}
