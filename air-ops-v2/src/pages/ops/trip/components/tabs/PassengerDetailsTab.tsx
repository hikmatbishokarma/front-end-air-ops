import { useEffect, useState } from "react";
import PassengerDetails from "../../../../quote/passanger-detail";
import { useSnackbar } from "../../../../../SnackbarContext";
import useGql from "../../../../../lib/graphql/gql";
import {
  GET_PASSENGER_DETAILS,
  UPADTE_PASSANGER_DETAIL,
} from "../../../../../lib/graphql/queries/passenger-detail";

interface PassengerDetailProps {
  quotation: string | undefined;
  quotationNo: string;
}

export const PassengerDetailsTab = ({
  quotation,
  quotationNo,
}: PassengerDetailProps) => {
  const showSnackbar = useSnackbar();

  console.log("quotation:::", quotation, quotationNo);

  const [quote, setQuote] = useState<any>();

  const getPassengerDetail = async () => {
    try {
      const result = await useGql({
        query: GET_PASSENGER_DETAILS,
        variables: {
          filter: {
            quotation: { eq: quotation },
            quotationNo: { eq: quotationNo },
          },
        },
        queryName: "passengerDetails",
        queryType: "query",
      });

      if (result?.errors) {
        showSnackbar(
          result?.errors?.[0]?.message || "some thing went wrong",
          "error"
        );
      } else {
        setQuote({
          aircraft: result[0]?.quotation?.aircraft,
          itinerary: result[0]?.sectors,
          quotationNo: result[0]?.quotationNo,
          id: result[0]?.quotation?.id,
        });
      }
    } catch (error) {
      showSnackbar(error?.message || "some thing went wrong", "error");
    }
  };

  useEffect(() => {
    getPassengerDetail();
  }, [quotation, quotationNo]);

  const handelSectorSave = async (payload) => {
    try {
      const data = await useGql({
        query: UPADTE_PASSANGER_DETAIL,
        queryName: "",
        queryType: "mutation",
        variables: payload,
      });

      if (!data || data?.errors) {
        showSnackbar(
          data?.errors?.[0]?.message || "Something went wrong",
          "error"
        );
      } else showSnackbar("Add successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to Add!", "error");
    }
  };

  return (
    <>
      <PassengerDetails
        logoColors={{ primary: "#0A58CA", accent: "#E11D48" }}
        tripInfo={{ ...(quote || {}), quotationId: quote?.id }}
        onSaveSector={handelSectorSave}
      />
    </>
  );
};
