import { useEffect, useState } from "react";
import PassengerDetails from "../../../../../shared/components/passenger/passanger-detail";
import { useSnackbar } from "../../../../../SnackbarContext";
import useGql from "../../../../../lib/graphql/gql";
import {
  GET_PASSENGER_DETAILS,
  UPADTE_PASSANGER_DETAIL,
} from "../../../../../lib/graphql/queries/passenger-detail";

interface PassengerDetailProps {
  quotation: any | undefined;
  quotationNo: string;
}

export const PassengerDetailsTab = ({
  quotation,
  quotationNo,
}: PassengerDetailProps) => {
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

  return (
    <>
      <PassengerDetails
        logoColors={{ primary: "#0A58CA", accent: "#E11D48" }}
        quotation={quotation.id}
        quotationNo={quotationNo}
        onSaveSector={handelSectorSave}
      />
    </>
  );
};
