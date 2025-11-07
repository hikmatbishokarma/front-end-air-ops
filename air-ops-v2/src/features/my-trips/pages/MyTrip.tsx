// /pages/MyProfileSectors.tsx
import React, { useMemo, useState } from "react";
import {
  Container,
  Grid,
  Tabs,
  Tab,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { Sector } from "../types/sector";

import SectorDrawer from "../components/sectors/SectorDrawer";
import SectorCard from "../components/sectors/SectorCard";

const MOCK_SECTORS: Sector[] = [
  {
    _id: "68bbe3de539403cb1e214224",
    sectorNo: 1,
    source: "VOHK",
    destination: "VOYK",
    depatureDate: "2025-11-06T00:00:00.000Z",
    depatureTime: "16:00",
    arrivalDate: "2025-11-06T00:00:00.000Z",
    arrivalTime: "17:00",
    pax: 1,
    flightTime: "01 hr, 00 min",
    assignedCrews: [
      { designation: "PILOT", crews: ["c1"] },
      { designation: "CABIN_CREW", crews: ["c3"] },
      { designation: "ENGINEER", crews: ["c4"] },
      { designation: "OPERATIONS", crews: ["c6"] },
      { designation: "CAMO", crews: ["c7"] },
    ],
    documents: [
      {
        type: "Flight Plan",
        externalLink: "https://example.com/flightplan.pdf",
      },
      {
        type: "Weight & Balance (CG)",
        externalLink: "https://example.com/wb.pdf",
      },
      { type: "Tripkit", externalLink: "https://example.com/tripkit.pdf" },
      { type: "Manifest" },
      { type: "Weather Briefing" },
      { type: "NOTAMS" },
    ],
    fuelRecord: {
      fuelStation: "HP Aviation",
      uploadedDate: "2025-11-06T10:15:00.000Z",
      fuelOnArrival: "1200kg",
      fuelGauge: "3/4",
    },
  },
  {
    _id: "68bbe3de539403cb1e214224",
    sectorNo: 1,
    source: "VOHK",
    destination: "VOYK",
    depatureDate: "2025-11-06T00:00:00.000Z",
    depatureTime: "16:00",
    arrivalDate: "2025-11-06T00:00:00.000Z",
    arrivalTime: "17:00",
    pax: 1,
    flightTime: "01 hr, 00 min",
    assignedCrews: [
      { designation: "PILOT", crews: ["c1"] },
      { designation: "CABIN_CREW", crews: ["c3"] },
      { designation: "ENGINEER", crews: ["c4"] },
      { designation: "OPERATIONS", crews: ["c6"] },
      { designation: "CAMO", crews: ["c7"] },
    ],
    documents: [
      {
        type: "Flight Plan",
        externalLink: "https://example.com/flightplan.pdf",
      },
      {
        type: "Weight & Balance (CG)",
        externalLink: "https://example.com/wb.pdf",
      },
      { type: "Tripkit", externalLink: "https://example.com/tripkit.pdf" },
      { type: "Manifest" },
      { type: "Weather Briefing" },
      { type: "NOTAMS" },
    ],
    fuelRecord: {
      fuelStation: "HP Aviation",
      uploadedDate: "2025-11-06T10:15:00.000Z",
      fuelOnArrival: "1200kg",
      fuelGauge: "3/4",
    },
  },
  // add more sectors to simulate Upcoming/Active/Past
];

const MyProfileSectors: React.FC = () => {
  const [tab, setTab] = useState<"upcoming" | "active" | "past">("upcoming");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Sector | null>(null);
  const [activeInnerTab, setActiveInnerTab] = useState<
    "overview" | "crew" | "documents" | "upload"
  >("overview");

  const currentUserId = "c1"; // pilot logged in

  const openDrawer = (
    sector: Sector,
    startTab: typeof activeInnerTab = "overview"
  ) => {
    setSelected(sector);
    setActiveInnerTab(startTab);
    setOpen(true);
  };

  // For now, all mock sectors appear in Upcoming
  const sectorsToShow = useMemo(() => MOCK_SECTORS, [tab]);

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" justifyContent="center" mb={3}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{ style: { display: "none" } }} // remove underline
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              border: "1px solid #d0d0d0",
              borderRadius: "8px",
              mx: 0.5,
              px: 2,
            },
            "& .Mui-selected": {
              background: "#f3f3f3",
              borderColor: "#a9a9a9",
            },
          }}
        >
          <Tab value="upcoming" label="Upcoming" />
          <Tab value="active" label="Active" />
          <Tab value="past" label="Past" />
        </Tabs>
      </Box>
      {/* </Stack> */}

      {/* <Grid container spacing={2}>
        {sectorsToShow.map((s) => (
          <Grid item xs={8} key={s._id}>
            <SectorCard
              sector={s}
              currentUserId={currentUserId}
              onOpen={(which) => openDrawer(s, which)}
            />
          </Grid>
        ))}
      </Grid> */}

      <Grid container spacing={2}>
        {sectorsToShow.map((s) => (
          <Grid item xs={12} key={s._id}>
            <SectorCard
              sector={s}
              tripId={"4536235TYYT"}
              aircraftName={"Hacker 350"}
              currentUserId={currentUserId}
              onOpen={(which) => openDrawer(s, which)}
            />
          </Grid>
        ))}
      </Grid>

      {selected && (
        <SectorDrawer
          open={open}
          onClose={() => setOpen(false)}
          sector={selected}
          initialTab={activeInnerTab}
          currentUserId={currentUserId}
          aircraftName={"Hacker 350"}
        />
      )}
    </Container>
  );
};

export default MyProfileSectors;
