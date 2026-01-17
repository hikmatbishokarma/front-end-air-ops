import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
    Button,
    Stack,
    Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import DescriptionIcon from "@mui/icons-material/Description";

export default function CertificationDetailDialog({ open, onClose, certification }) {
    if (!certification) return null;

    const getSeverityColor = () => {
        const days = certification.daysLeft;
        if (days <= 0) return "#DC2626";
        if (days <= 15) return "#DC2626";
        if (days <= 30) return "#F59E0B";
        if (days <= 60) return "#F59E0B";
        return "#10B981";
    };

    const getSeverityBg = () => {
        const days = certification.daysLeft;
        if (days <= 0) return "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)";
        if (days <= 15) return "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)";
        if (days <= 30) return "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)";
        if (days <= 60) return "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)";
        return "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                }
            }}
        >
            {/* Header with gradient */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    p: 3,
                    position: "relative",
                }}
            >
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
                    Certification Details
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.2)",
                        "&:hover": {
                            bgcolor: "rgba(255,255,255,0.3)",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <Stack spacing={0}>
                    {/* Staff Name Section */}
                    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#F9FAFB" }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <PersonIcon sx={{ color: "white", fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 0.5 }}>
                                    Staff Member
                                </Typography>
                                <Typography variant="h6" fontWeight="700" sx={{ mt: 0.25 }}>
                                    {certification.staffName || "N/A"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Certification Details */}
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack spacing={3}>
                            {/* Certification Type */}
                            <Box>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                    <BadgeIcon sx={{ color: "#667eea", fontSize: 20 }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 0.5 }}>
                                        Certification Type
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" fontWeight="600" sx={{ pl: { xs: 0, md: 4.5 }, mt: { xs: 0.5, md: 0 } }}>
                                    {certification.title}
                                </Typography>
                            </Box>

                            {/* License Number */}
                            {certification.licenceNo && (
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                        <VerifiedIcon sx={{ color: "#667eea", fontSize: 20 }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 0.5 }}>
                                            License Number
                                        </Typography>
                                    </Stack>
                                    <Box sx={{ pl: { xs: 0, md: 4.5 }, mt: { xs: 0.5, md: 0 } }}>
                                        <Chip
                                            label={certification.licenceNo}
                                            sx={{
                                                fontFamily: "monospace",
                                                fontWeight: 600,
                                                fontSize: "0.875rem",
                                                bgcolor: "#F3F4F6",
                                                border: "2px solid #E5E7EB",
                                                height: 36,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}

                            {/* Dates */}
                            <Box>
                                <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                                    <CalendarTodayIcon sx={{ color: "#667eea", fontSize: 20 }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 0.5 }}>
                                        Timeline
                                    </Typography>
                                </Stack>
                                <Stack spacing={1.5} sx={{ pl: { xs: 0, md: 4.5 }, mt: { xs: 1, md: 0 } }}>
                                    {certification.dateOfIssue && (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                                                Issued On
                                            </Typography>
                                            <Typography variant="body2" fontWeight="500">
                                                {formatDate(certification.dateOfIssue)}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                                            Valid Until
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600" sx={{ color: getSeverityColor() }}>
                                            {formatDate(certification.validTill)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Status Badge */}
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    background: getSeverityBg(),
                                    border: `2px solid ${getSeverityColor()}20`,
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 0.5 }}>
                                    Status
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: getSeverityColor(),
                                        fontWeight: 800,
                                        mt: 0.5,
                                    }}
                                >
                                    {certification.daysLeft <= 0
                                        ? "EXPIRED"
                                        : `${certification.daysLeft} Days Remaining`}
                                </Typography>
                            </Box>

                            {/* Issued By Document */}
                            {certification.issuedBy && (
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
                                        <DescriptionIcon sx={{ color: "#667eea", fontSize: 20 }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 600, letterSpacing: 0.5 }}>
                                            Supporting Document
                                        </Typography>
                                    </Stack>
                                    <Box sx={{ pl: { xs: 0, md: 4.5 }, mt: { xs: 1, md: 0 } }}>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            onClick={() => window.open(certification.issuedBy, "_blank")}
                                            startIcon={<DescriptionIcon />}
                                            sx={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                px: 3,
                                                py: 1.25,
                                                borderRadius: 2,
                                                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                                                "&:hover": {
                                                    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                                                },
                                            }}
                                        >
                                            View Certificate Document
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
