import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Divider,
  Chip,
  Avatar,
  ListItemButton,
  List,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TicketCard from "../components/SupportTicketCard";

/**
 * Props:
 * tickets: TicketListItem[]
 * selectedId: string | null
 * onSelect: (id: string) => void
 */
export default function SupportTicketListPane({
  tickets = [],
  selectedId,
  onSelect,
}: any) {
  return (
    <Box
      sx={{
        width: 380,
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2, gap: 1, display: "flex", alignItems: "center" }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Recent Tickets
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
          My open tickets ({tickets.filter((t) => t.status === "OPEN").length})
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <List disablePadding>
          {tickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              selected={selectedId === t.id}
              onClick={() => onSelect(t.id)}
            />
          ))}
        </List>
        ;
      </Box>
    </Box>
  );
}
