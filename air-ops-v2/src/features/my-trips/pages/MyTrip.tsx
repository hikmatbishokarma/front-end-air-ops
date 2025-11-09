// /pages/MyProfileSectors.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Grid,
  Tabs,
  Tab,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Sector } from "../types/sector";
import { useSession, useSnackbar } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { GET_TRIP_ASSIGNED_FOR_CREW } from "@/lib/graphql/queries/trip-detail";
import SectorDrawer from "../components/sectors/SectorDrawer";
import SectorCard from "../components/sectors/SectorCard";
import { transformApiDataToSectors } from "../utils/transform";

const MyProfileSectors: React.FC = () => {
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const currentUserId = session?.user?.id || null;

  const [tab, setTab] = useState<"upcoming" | "active" | "past">("upcoming");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Sector | null>(null);
  const [activeInnerTab, setActiveInnerTab] = useState<
    "overview" | "crew" | "documents" | "upload"
  >("overview");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await useGql({
        query: GET_TRIP_ASSIGNED_FOR_CREW,
        queryName: "tripAssignedForCrew",
        queryType: "query-without-edge",
        variables: {
          filter: {
            crewId: currentUserId,
            type: tab, // Pass the selected tab type to backend filter
          },
          paging: {
            limit: 10,
            offset: 0,
          },
          "sort": { "updatedAt": "desc" },
        },
      });

      // result is the tripAssignedForCrew object with { totalCount, result: [...] }
      if (result?.result && Array.isArray(result.result)) {
        const transformedSectors = transformApiDataToSectors(result.result);
        setSectors(transformedSectors);
      } else {
        setSectors([]);
      }
    } catch (error: any) {
      console.error("Error fetching trips:", error);
      showSnackbar(error.message || "Failed to fetch trips", "error");
      setSectors([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, tab, showSnackbar]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const openDrawer = (
    sector: Sector,
    startTab: typeof activeInnerTab = "overview"
  ) => {
    setSelected(sector);
    setActiveInnerTab(startTab);
    setOpen(true);
  };

  // Get unique trip data for each sector
  const getTripDataForSector = (sector: Sector) => {
    return {
      tripId: sector.tripId || "",
      aircraft: sector.aircraft,
    };
  };

  if (loading) {
    return (
      <Container sx={{ py: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 3 }}>
      <Box display="flex" justifyContent="center" mb={3}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{ style: { display: "none" } }}
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

      {sectors.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">No {tab} trips found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {sectors.map((s) => {
            const tripData = getTripDataForSector(s);
            return (
              <Grid item xs={12} key={s._id}>
                <SectorCard
                  sector={s}
                  tripId={tripData.tripId}
                  aircraft={tripData.aircraft}
                  currentUserId={currentUserId || ""}
                  onOpen={(which) => openDrawer(s, which)}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      {selected && (
        <SectorDrawer
          open={open}
          onClose={() => setOpen(false)}
          sector={selected}
          initialTab={activeInnerTab}
          currentUserId={currentUserId || ""}
          aircraft={getTripDataForSector(selected).aircraft}
        />
      )}
    </Container>
  );
};

export default MyProfileSectors;
