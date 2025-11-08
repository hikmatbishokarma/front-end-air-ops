import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import SectorAccordion from "../sector/SectorAccordion";

import { useState } from "react";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { logoColors, removeTypename } from "@/shared/utils";
import { Trip, Sector } from "../../type/trip.type";
import useGql from "@/lib/graphql/gql";
import { UPDATE_TRIP_DETAILS } from "@/lib/graphql/queries/trip-detail";
import { useSnackbar } from "@/app/providers";

// Props for TripDetailsTab

const softCard = {
  borderRadius: "20px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)",
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(2px)",
};

// Props for TripDetailsTab
interface TripDetailsTabProps {
  trip: Trip;
}

export default function TripDetailsTab({ trip }: TripDetailsTabProps) {
  const [expanded, setExpanded] = useState(0);
  const showSnackbar = useSnackbar();

  const updateTripDetail = async (sectorNo: number, data: Sector) => {
    try {
      // Remove __typename if it exists (GraphQL adds this at runtime)
      const dataAsAny = data as any;
      if (dataAsAny.__typename) {
        delete dataAsAny.__typename;
      }

      const formattedData = removeTypename(dataAsAny);

      const result = await useGql({
        query: UPDATE_TRIP_DETAILS,
        queryName: "updateOneTripDetail",
        queryType: "mutation",
        variables: {
          where: {
            _id: trip.id,
          },
          data: { sector: formattedData },
        },
      });

      if (result?.errors) {
        throw new Error(result.errors[0]?.message || "Something went wrong.");
      } else {
        // Show success message
        showSnackbar("Trip details updated successfully!", "success");
        // Close the accordion that was just saved (sectorNo is 1-based, index is 0-based)
        const accordionIndex = sectorNo - 1;
        // Close the saved accordion if it's currently expanded
        if (accordionIndex === expanded) {
          setExpanded(-1);
        }
      }
    } catch (error: any) {
      // Show error message
      showSnackbar(error.message || "Failed to update trip details!", "error");
      throw error; // Re-throw to let the caller handle it if needed
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 3 },
        background:
          "linear-gradient(135deg, rgba(10,88,202,0.06), rgba(225,29,72,0.06))",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          ...softCard,
          borderColor: "transparent",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88))",
        }}
      >
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <FlightTakeoffIcon sx={{ color: logoColors.primary }} />

                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {trip?.quotation?.aircraft?.name}
                </Typography>
                <Chip
                  label={trip?.quotation?.aircraft?.code}
                  size="small"
                  sx={{
                    ml: 1,
                    fontWeight: 700,
                    bgcolor: `${logoColors.primary}15`,
                    color: logoColors.primary,
                    borderColor: `${logoColors.primary}40`,
                  }}
                  variant="outlined"
                />
              </Stack>
            </Stack>
          }
          // subheader={
          //   <Typography variant="body2" sx={{ opacity: 0.8 }}>
          //     Add Trip Details.
          //   </Typography>
          // }
          sx={{ pb: 1 }}
        />

        <CardContent sx={{ pt: 0, pb: 2 }}>
          {trip?.sectors?.map((sector, index) => (
            <SectorAccordion
              key={index}
              index={index + 1}
              sector={{ ...sector, sectorNo: index + 1 }}
              aircraft={trip?.quotation.aircraft}
              expanded={expanded === index}
              onChange={() => setExpanded(expanded === index ? -1 : index)}
              onSave={(sectorNo, data) => {
                updateTripDetail(sectorNo, data);
              }}
            />
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
