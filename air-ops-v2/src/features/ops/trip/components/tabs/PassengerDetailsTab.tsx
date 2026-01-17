import { useState } from "react";
import PassengerDetails from "@/shared/components/passenger/passanger-detail";
import { useSnackbar } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { UPADTE_PASSANGER_DETAIL } from "@/lib/graphql/queries/passenger-detail";
import { TRIP_CONFIRMATION_PREVIEW } from "@/lib/graphql/queries/trip-detail";
import { useNavigate } from "react-router";
import TripConfirmationPreview from "../../../components/TripConfirmationPreview";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PassengerDetailProps {
  quotation: any | undefined;
  quotationNo: string;
  tripId?: string; // tripId is needed for fetching preview
}

export const PassengerDetailsTab = ({
  quotation,
  quotationNo,
  tripId,
}: PassengerDetailProps) => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handelSectorSave = async (payload: any) => {
    try {
      const data = await useGql({
        query: UPADTE_PASSANGER_DETAIL,
        queryName: "updatePassengerDetail",
        queryType: "mutation",
        variables: payload,
      });

      if (!data || data?.errors) {
        showSnackbar(
          data?.errors?.[0]?.message || "Something went wrong",
          "error"
        );
      } else showSnackbar("Add successfully", "success");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to Add!", "error");
    }
  };

  const handelSaveAndPreview = async (quotationNo: string) => {
    // If we are in trip context (tripId matches), show preview in-place
    if (tripId) {
      try {
        const result = await useGql({
          query: TRIP_CONFIRMATION_PREVIEW,
          variables: { tripId },
          queryName: "tripConfirmationPreview",
          queryType: "query-without-edge",
        });

        if (result) {
          setPreviewHtml(result);
          setShowPreview(true);
        } else {
          // In case of error or no result, maybe fallback or show error
          showSnackbar("Failed to load preview details", "error");
        }
      } catch (e: any) {
        showSnackbar(e?.message || "Error fetching preview", "error");
      }
    } else {
      // Fallback to original behavior (redirect) if used outside of trip context (e.g. quotes)
      // Although this component seems specific to TripDetail based on file location, 
      // keeping safety check is good.
      navigate(
        `/app/sales-confirmation-preview/${encodeURIComponent(quotationNo)}`
      );
    }
  };

  if (showPreview && tripId) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setShowPreview(false)}
          sx={{ mb: 2 }}
        >
          Back to Passenger Details
        </Button>
        <TripConfirmationPreview
          htmlContent={previewHtml}
          tripId={tripId}
          quotationNo={quotationNo}
        />
      </Box>
    );
  }

  return (
    <>
      <PassengerDetails
        logoColors={{ primary: "#0A58CA", accent: "#E11D48" }}
        quotation={quotation?.id}
        quotationNo={quotationNo}
        onSaveSector={handelSectorSave}
        onPreview={handelSaveAndPreview}
      />
    </>
  );
};
