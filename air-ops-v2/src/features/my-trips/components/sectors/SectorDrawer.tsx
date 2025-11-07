// /components/sectors/SectorDrawer.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  Stack,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { Sector } from "../../types/sector";
import { fmtDate } from "@/shared/utils";

import CrewTab from "../tabs/CrewTab";
import DocumentsTab from "../tabs/DocumentsTab";
import UploadTab from "../tabs/UploadTab";
import CloseIcon from "@mui/icons-material/Close";
import OverviewTab from "../tabs/OverviewTab";

type Props = {
  open: boolean;
  onClose: () => void;
  sector: Sector;
  initialTab?: "overview" | "crew" | "documents" | "upload";
  currentUserId: string;
  aircraftName?: string;
};

const SectorDrawer: React.FC<Props> = ({
  open,
  onClose,
  sector,
  initialTab = "overview",
  currentUserId,
  aircraftName,
}) => {
  const [tab, setTab] = useState<typeof initialTab>(initialTab);
  useEffect(() => setTab(initialTab), [initialTab, sector._id]);

  const [docs, setDocs] = useState<{ pre: any[]; post: any[] }>({
    pre: [],
    post: [],
  });

  const src = sector.source;
  const dst = sector.destination;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 680,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          zIndex: (theme) => theme.zIndex.modal + 10,
        },
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
      }}
    >
      {/* header */}
      <Box p={2} pb={1} borderBottom="1px solid #eee">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {sector.source} → {sector.destination}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {src} → {dst}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="subtitle1">
              {sector.depatureTime} – {sector.arrivalTime}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fmtDate(sector.depatureDate)} • {sector.flightTime}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
      <Divider />

      {/* tabs */}
      <Box px={2}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: "1px solid #eee",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: 14,
              minWidth: "auto",
              px: 2,
              color: "#777",
            },
            "& .Mui-selected": {
              color: "#111",
              fontWeight: 700,
            },
            "& .MuiTabs-indicator": {
              height: 2,
              backgroundColor: "#111",
              borderRadius: 1,
            },
          }}
        >
          <Tab value="overview" label="Overview" />
          <Tab value="crew" label="Crew" />
          <Tab value="documents" label="Documents" />
          <Tab value="upload" label="Upload" />
        </Tabs>
      </Box>

      {/* content */}
      <Box p={2} sx={{ overflowY: "auto" }}>
        {/* {tab === "overview" && <OverviewTab sector={sector} />} */}
        {tab === "overview" && (
          <OverviewTab sector={sector} aircraftName={aircraftName} />
        )}
        {tab === "crew" && (
          <CrewTab sector={sector} currentUserId={currentUserId} />
        )}
        {tab === "documents" && <DocumentsTab sector={sector} />}
        {tab === "upload" && (
          <UploadTab
            preflightDocs={docs.pre}
            postflightDocs={docs.post}
            setDocs={setDocs}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default SectorDrawer;
