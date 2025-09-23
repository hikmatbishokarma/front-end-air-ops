// src/pages/quotes/QuoteCreate.tsx
import React from "react";

import { CREATE_QUOTE } from "../../lib/graphql/queries/quote";
import moment from "moment";
import QuoteForm from "./QuoteForm";
import useGql from "../../lib/graphql/gql";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import { useQuoteData } from "../../hooks/useQuoteData";

// Define the default state for a new form
const defaultValues = {
  category: "CHARTER",
  requestedBy: "",
  itinerary: [
    {
      source: "",
      destination: "",
      depatureDate: "",
      depatureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      paxNumber: 0,
    },
  ],
  prices: [
    {
      label: "Charter Charges",
      unit: "01:00",
      price: 0,
      currency: "INR",
      total: 0,
    },
    {
      label: "Ground Handling",
      unit: "01:00",
      price: 0,
      currency: "INR",
      total: 0,
    },
    {
      label: "Crew BLT",
      unit: "01:00",
      price: 0,
      currency: "INR",
      total: 0,
    },
  ],
  sectors: [
    {
      source: {
        iata_code: "",
        name: "",
        city: "",
        country: "",
        lat: "",
        long: "",
      },
      destination: {
        iata_code: "",
        name: "",
        city: "",
        country: "",
        lat: "",
        long: "",
      },
      depatureDate: "",
      depatureTime: "",
      arrivalDate: "",
      arrivalTime: "",
      paxNumber: 0,
    },
  ],
  grandTotal: 0,
};

const QuoteCreateTest = () => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const navigate = useNavigate();

  const showSnackbar = useSnackbar();

  const {
    aircraftCategories,
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
    fetchClients,
  } = useQuoteData();

  const handleCreate = async (formData) => {
    try {
      const cleanedPayload = {
        ...(formData.category && { category: formData.category }),
        ...(formData.aircraft && { aircraft: formData?.aircraft?.id }),
        ...(formData.requestedBy && { requestedBy: formData.requestedBy?.id }),
        ...(formData.representative && {
          representative: formData.representative?.id,
        }),
      };

      // if (Array.isArray(formData.itinerary)) {
      //   const cleanedItinerary = formData.itinerary.filter(
      //     (item) => item.source && item.destination
      //   );
      //   if (cleanedItinerary.length)
      //     cleanedPayload.itinerary = cleanedItinerary;
      // }

      if (Array.isArray(formData?.sectors)) {
        const cleanedSectors = formData.sectors.filter(
          (item) => item.source && item.destination
        );
        if (cleanedSectors.length) cleanedPayload.sectors = cleanedSectors;
      }

      if (Array.isArray(formData.prices)) {
        const cleanedPrices =
          formData.category === "CHARTER"
            ? formData.prices
            : formData.prices.filter((item) => item.label && item.price);

        if (cleanedPrices.length) {
          cleanedPayload.prices = cleanedPrices;
          cleanedPayload.grandTotal = formData.grandTotal;
        }
      }

      const data = await useGql({
        query: CREATE_QUOTE,
        queryName: "quote",
        queryType: "mutation",
        variables: {
          input: {
            quote: { ...cleanedPayload, operatorId },
          },
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Create Quote!", "error");
        return { success: false };
      } else {
        showSnackbar("Created new Quote!", "success");
        navigate("/quotes", { state: { refresh: true } });
        return { success: true };
      }
    } catch (error) {
      showSnackbar(error?.message || "Failed To Create Quote!", "error");
      return { success: false };
    }
  };

  return (
    <QuoteForm
      initialData={defaultValues}
      onSubmit={handleCreate}
      isEdit={false}
      aircrafts={aircrafts}
      representatives={representatives}
      clients={clients}
      fetchClients={fetchClients}
      fetchRepresentatives={fetchRepresentatives}
      aircraftCategories={aircraftCategories}
    />
  );
};

export default QuoteCreateTest;
