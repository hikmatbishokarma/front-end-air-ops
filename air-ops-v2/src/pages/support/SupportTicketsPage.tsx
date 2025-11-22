import React from "react";
import { Box } from "@mui/material";

// Hook placeholders (replace with real data-fetching logic)

import { useNavigate, useParams } from "react-router";
import {
  useTicketDetail,
  useTicketsList,
} from "../../features/support/support-team/hooks/useTicketQueries";
import SupportTicketListPane from "@/features/support/support-team/pages/SupportTicketListPane";
import SupportTicketDetailPane from "@/features/support/support-team/pages/SupportTicketDetailPane";

export default function SupportTicketsPage() {
  const navigate = useNavigate();
  const { ticketId } = useParams();

  console.log("id::::", ticketId);
  const { data: tickets = [] } = useTicketsList();
  const selectedId = ticketId || (tickets[0]?.id ?? null);

  const { data: detail } = useTicketDetail(selectedId);

  const handleSelect = (ticketId) => {
    navigate(`/app/admin/support-ticket/${ticketId}`);
  };

  const handleUpload = async (file) => {
    // Replace with real upload
    return {
      id: Math.random().toString(),
      name: file.name,
      mime: file.type,
      sizeBytes: file.size,
      url: URL.createObjectURL(file),
    };
  };

  const handleSend = async ({ html, attachments }) => {
    console.log("Send reply:", { html, attachments });
    // Replace with API call
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SupportTicketListPane
        tickets={tickets}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {detail ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <SupportTicketDetailPane
            detail={detail}
            onUpload={handleUpload}
            onSend={handleSend}
          />
        </Box>
      ) : null}
    </Box>
  );
}
