// src/pages/PassengerEditPage.tsx

import React from "react";

import { useQuery } from "@apollo/client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import PassengerDetails from "./passanger-detail";
import useGql from "../../../lib/graphql/gql";
import { UPADTE_PASSANGER_DETAIL } from "../../../lib/graphql/queries/passenger-detail";
import { useSnackbar } from "../../../SnackbarContext";

const PassengerEditPage = () => {
  const { quotationNo } = useParams();

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

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
    navigate(`/sales-confirmation-preview/${encodeURIComponent(quotationNo)}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Passenger Details
      </Typography>

      <PassengerDetails
        logoColors={{ primary: "#0A58CA", accent: "#E11D48" }}
        quotationNo={quotationNo}
        quotation={undefined}
        onSaveSector={handelSectorSave}
        onPreview={handelSaveAndPreview}
      />
    </Box>
  );
};

export default PassengerEditPage;
