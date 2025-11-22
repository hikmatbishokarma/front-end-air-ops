// src/pages/quotes/QuoteEdit.tsx
import React, { useEffect, useState } from "react";

import { GET_QUOTE_BY_ID, UPDATE_QUOTE } from "@/lib/graphql/queries/quote";
import useGql from "@/lib/graphql/gql";
import { useSession } from "@/app/providers";
import { useNavigate, useParams } from "react-router";
import { Typography } from "@mui/material";

import { useQuoteData } from "../hooks/useQuoteData";
import { useSnackbar } from "@/app/providers";
import { useUpdateQuote } from "../hooks/useQuoteMutations";
import QuoteForm from "../components/QuoteForm";
import { useQuoteEditorData } from "../hooks/useQuoteEditorData";

const QuoteEdit = () => {
  const { id } = useParams();

  // const showSnackbar = useSnackbar();

  // const {
  //   aircraftCategories,
  //   aircrafts,
  //   representatives,
  //   clients,
  //   fetchAircrafts,
  //   fetchRepresentatives,
  //   fetchClients,
  // } = useQuoteData();

  // const [initialData, setInitialData] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchAllData = async () => {
  //     setLoading(true);

  //     try {
  //       // Fetch the specific quote data
  //       const quoteResponse = await useGql({
  //         query: GET_QUOTE_BY_ID,
  //         queryName: "quote",
  //         queryType: "query-without-edge",
  //         variables: { id },
  //       });

  //       if (!quoteResponse) {
  //         showSnackbar("Failed to load quote data.");
  //         setLoading(false);
  //         return;
  //       }

  //       setInitialData(quoteResponse);

  //       // Step 2: Build the promises array conditionally
  //       const fetchPromises = [fetchAircrafts()];

  //       if (quoteResponse?.requestedBy) {
  //         fetchPromises.push(fetchClients());
  //       }

  //       if (quoteResponse?.representative) {
  //         fetchPromises.push(
  //           fetchRepresentatives(quoteResponse?.requestedBy?.id)
  //         );
  //       }

  //       // Step 3: Wait for all necessary data to be loaded
  //       await Promise.all(fetchPromises);
  //     } catch (err) {
  //       console.error("Data fetching error:", err);
  //       showSnackbar("An error occurred while fetching data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllData();
  // }, [id, fetchAircrafts, fetchRepresentatives, fetchClients]); // Add functions to dependencies

  // const handleUpdate = async (formData) => {
  //   const cleanedPayload = {
  //     ...(formData.category && { category: formData.category }),
  //     ...(formData.aircraft && { aircraft: formData?.aircraft?.id }),
  //     ...(formData.requestedBy && { requestedBy: formData.requestedBy?.id }),
  //     ...(formData.representative && {
  //       representative: formData.representative?.id,
  //     }),
  //   };

  //   if (Array.isArray(formData.itinerary)) {
  //     const cleanedItinerary = formData.itinerary.filter(
  //       (item) => item.source && item.destination
  //     );
  //     if (cleanedItinerary.length) cleanedPayload.itinerary = cleanedItinerary;
  //   }

  //   if (Array.isArray(formData.prices)) {
  //     const cleanedPrices = formData.prices
  //       .filter((item) => item.label && item.price)
  //       .map(({ __typename, ...rest }) => rest); // remove __typename

  //     if (cleanedPrices.length) {
  //       cleanedPayload.prices = cleanedPrices;
  //       cleanedPayload.grandTotal = formData.grandTotal;
  //     }
  //   }

  //   await useGql({
  //     query: UPDATE_QUOTE,
  //     queryName: "",
  //     queryType: "mutation",
  //     variables: {
  //       input: {
  //         id,
  //         update: { ...cleanedPayload, operatorId, providerType: "airops" },
  //       },
  //     },
  //   });
  //   navigate("/quotes");
  // };

  const { initialData, loading, error, ...dependencyData } = useQuoteEditorData(
    id || ""
  );

  const { updateQuote, loading: isUpdating } = useUpdateQuote(id);

  // The handler is now just a wrapper for the hook function
  const handleUpdate = async (formData: any) => {
    // All cleaning and API logic is abstracted away
    await updateQuote(formData);
  };

  if (loading || isUpdating) {
    return <Typography>Loading quote data...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading quote: {error.message}
      </Typography>
    );
  }

  if (!initialData) {
    return <Typography>No quote data found.</Typography>;
  }

  return (
    <QuoteForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isEdit={true}
      {...dependencyData}
    />
  );
};

export default QuoteEdit;
