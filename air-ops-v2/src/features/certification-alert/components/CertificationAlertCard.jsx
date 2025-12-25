import { Box, Typography } from "@mui/material";

export default function CertificationAlertCard({ item, onClick }) {
    const getSeverity = () => {
        const days = item.daysLeft;

        if (days <= 0) return "expired";
        if (days <= 15) return "critical";
        if (days <= 30) return "danger";
        if (days <= 60) return "warning";
        return "info";
    };

    const severity = getSeverity();
    const isCritical = item.daysLeft <= 15 && item.daysLeft > 0;

    const colors = {
        info: "#3B82F6",
        warning: "#F59E0B",
        danger: "#DC2626",
        critical: "#B91C1C",
        expired: "#7F1D1D",
    };

    const bgColors = {
        info: "rgba(59, 130, 246, 0.05)",
        warning: "rgba(245, 158, 11, 0.05)",
        danger: "rgba(230, 16, 16, 0.05)",
        critical: "rgba(227, 18, 18, 0.08)",
        expired: "rgba(127, 29, 29, 0.08)",
    };

    const icons = {
        info: "🔵",
        warning: "⚠️",
        danger: "⛔",
        critical: "🚨",
        expired: "❌",
    };

    return (
        <Box
            onClick={() => onClick(item)}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                py: 1.5,
                px: 2,
                mb: 1.5,
                borderLeft: `4px solid ${colors[severity]}`,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px',
                bgcolor: bgColors[severity],
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                // Add blinking animation for critical alerts
                ...(isCritical && {
                    animation: 'blink 2s ease-in-out infinite',
                    '@keyframes blink': {
                        '0%, 100%': {
                            opacity: 1,
                            boxShadow: '0 0 0 rgba(227, 18, 18, 0)',
                        },
                        '50%': {
                            opacity: 0.7,
                            boxShadow: '0 0 12px rgba(227, 18, 18, 0.5)',
                        },
                    },
                }),
                '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transform: 'translateX(2px)',
                },
            }}
        >
            {/* Icon - Left */}
            <Typography sx={{ fontSize: '1.25rem', minWidth: '28px', lineHeight: 1 }}>
                {icons[severity]}
            </Typography>

            {/* Certification Name and Staff Name - Center */}
            <Box sx={{ flex: 1 }}>
                {item.staffName && (
                    <Typography
                        variant="body2"
                        fontWeight="700"
                        sx={{
                            lineHeight: 1.3,
                            color: 'text.primary',
                            mb: 0.25,
                        }}
                    >
                        {item.staffName}
                    </Typography>
                )}
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1.4,
                        color: 'text.secondary',
                        fontWeight: 500,
                    }}
                >
                    {item.title}
                    {item.licenceNo && (
                        <Typography
                            component="span"
                            variant="caption"
                            sx={{
                                ml: 1,
                                color: 'text.secondary',
                                fontFamily: 'monospace',
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 0.5,
                            }}
                        >
                            #{item.licenceNo}
                        </Typography>
                    )}
                </Typography>
            </Box>

            {/* Days Left - Right */}
            <Typography
                variant="body2"
                fontWeight="700"
                sx={{
                    color: colors[severity],
                    minWidth: '70px',
                    textAlign: 'right',
                    fontSize: '0.875rem',
                }}
            >
                {item.daysLeft <= 0 ? "Expired" : `${item.daysLeft} days`}
            </Typography>
        </Box>
    );
}
