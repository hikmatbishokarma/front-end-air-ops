// src/pages/quotes/QuoteEdit.tsx
import React, { useEffect, useState } from "react";

import { GET_QUOTE_BY_ID, UPDATE_QUOTE } from "../../lib/graphql/queries/quote";
import useGql from "../../lib/graphql/gql";
import { useSession } from "../../SessionContext";
import { useNavigate, useParams } from "react-router";
import { Typography } from "@mui/material";
import QuoteForm from "./QuoteForm";
import { useQuoteData } from "../../hooks/useQuoteData";
import { useSnackbar } from "../../SnackbarContext";

const QuoteEditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const {
    aircraftCategories,
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
    fetchClients,
  } = useQuoteData();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      try {
        // Fetch the specific quote data
        const quoteResponse = await useGql({
          query: GET_QUOTE_BY_ID,
          queryName: "quote",
          queryType: "query-without-edge",
          variables: { id },
        });

        if (!quoteResponse) {
          showSnackbar("Failed to load quote data.");
          setLoading(false);
          return;
        }

        setInitialData(quoteResponse);

        // Step 2: Build the promises array conditionally
        const fetchPromises = [fetchAircrafts()];

        if (quoteResponse?.requestedBy) {
          fetchPromises.push(fetchClients());
        }

        if (quoteResponse?.representative) {
          fetchPromises.push(
            fetchRepresentatives(quoteResponse?.requestedBy?.id)
          );
        }

        // Step 3: Wait for all necessary data to be loaded
        await Promise.all(fetchPromises);
      } catch (err) {
        console.error("Data fetching error:", err);
        showSnackbar("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, fetchAircrafts, fetchRepresentatives, fetchClients]); // Add functions to dependencies

  const handleUpdate = async (formData) => {
    const cleanedPayload = {
      ...(formData.category && { category: formData.category }),
      ...(formData.aircraft && { aircraft: formData?.aircraft?.id }),
      ...(formData.requestedBy && { requestedBy: formData.requestedBy?.id }),
      ...(formData.representative && {
        representative: formData.representative?.id,
      }),
    };

    if (Array.isArray(formData.itinerary)) {
      const cleanedItinerary = formData.itinerary.filter(
        (item) => item.source && item.destination
      );
      if (cleanedItinerary.length) cleanedPayload.itinerary = cleanedItinerary;
    }

    if (Array.isArray(formData.prices)) {
      const cleanedPrices = formData.prices.filter(
        (item) => item.label && item.price
      );
      if (cleanedPrices.length) {
        cleanedPayload.prices = cleanedPrices;
        cleanedPayload.grandTotal = formData.grandTotal;
      }
    }

    await useGql({
      query: UPDATE_QUOTE,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          id,
          update: { ...cleanedPayload, operatorId, providerType: "airops" },
        },
      },
    });
    navigate("/quotes");
  };

  if (loading) {
    return <Typography>Loading quote data...</Typography>;
  }

  return (
    <QuoteForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isEdit={true}
      aircrafts={aircrafts}
      representatives={representatives}
      clients={clients}
      fetchClients={fetchClients}
      fetchRepresentatives={fetchRepresentatives}
      aircraftCategories={aircraftCategories}
    />
  );
};

export default QuoteEditTest;
