// src/features/support/user/components/WelcomePane.tsx

import { Box, Button, Typography } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function WelcomePane({
  onCreate,
  faq,
}: {
  onCreate: () => void;
  faq?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        px: 4,
        py: 4,
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 1,
          }}
        >
          How can we help you?
        </Typography>

        <Typography
          sx={{
            fontSize: 16,
            color: "text.secondary",
            maxWidth: 500,
            lineHeight: 1.5,
          }}
        >
          Raise support requests, track ticket updates, or check FAQs. Our
          operations team will assist you as quickly as possible.
        </Typography>
      </Box>

      {/* Create Ticket CTA */}
      <Button
        variant="contained"
        startIcon={<SupportAgentIcon />}
        onClick={onCreate}
        sx={{
          textTransform: "none",
          fontSize: 15,
          borderRadius: 2,
          px: 3,
          py: 1.2,
          backgroundColor: "#0F1C51",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
          "&:hover": {
            backgroundColor: "#0A1440",
          },
        }}
      >
        Create New Support Ticket
      </Button>

      {/* FAQ Section (Optional) */}
      {faq && <Box sx={{ mt: 5 }}>{faq}</Box>}
    </Box>
  );
}
