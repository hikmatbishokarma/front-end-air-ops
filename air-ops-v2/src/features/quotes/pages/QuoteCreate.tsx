// src/pages/quotes/QuoteCreate.tsx
import React from "react";

import { useCreateQuote } from "../hooks/useQuoteMutations";
import { useQuoteData } from "../hooks/useQuoteData";
import QuoteForm from "../components/QuoteForm";

// Define the default state for a new form
const defaultValues = {
  category: "CHARTER",
  requestedBy: "",
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

const QuoteCreate = () => {
  const {
    aircrafts,
    representatives,
    clients,
    fetchAircrafts,
    fetchRepresentatives,
    fetchClients,
  } = useQuoteData();

  // const handleCreate = async (formData) => {
  //   try {
  //     const cleanedPayload = {
  //       ...(formData.category && { category: formData.category }),
  //       ...(formData.aircraft && { aircraft: formData?.aircraft?.id }),
  //       ...(formData.requestedBy && { requestedBy: formData.requestedBy?.id }),
  //       ...(formData.representative && {
  //         representative: formData.representative?.id,
  //       }),
  //     };

  //     // if (Array.isArray(formData.itinerary)) {
  //     //   const cleanedItinerary = formData.itinerary.filter(
  //     //     (item) => item.source && item.destination
  //     //   );
  //     //   if (cleanedItinerary.length)
  //     //     cleanedPayload.itinerary = cleanedItinerary;
  //     // }

  //     if (Array.isArray(formData?.sectors)) {
  //       const cleanedSectors = formData.sectors.filter(
  //         (item) => item.source && item.destination
  //       );
  //       if (cleanedSectors.length) cleanedPayload.sectors = cleanedSectors;
  //     }

  //     if (Array.isArray(formData.prices)) {
  //       const cleanedPrices =
  //         formData.category === "CHARTER"
  //           ? formData.prices
  //           : formData.prices.filter((item) => item.label && item.price);

  //       if (cleanedPrices.length) {
  //         cleanedPayload.prices = cleanedPrices;
  //         cleanedPayload.grandTotal = formData.grandTotal;
  //       }
  //     }

  //     const data = await useGql({
  //       query: CREATE_QUOTE,
  //       queryName: "quote",
  //       queryType: "mutation",
  //       variables: {
  //         input: {
  //           quote: { ...cleanedPayload, operatorId },
  //         },
  //       },
  //     });

  //     if (data?.errors?.length > 0) {
  //       showSnackbar("Failed To Create Quote!", "error");
  //       return { success: false };
  //     } else {
  //       showSnackbar("Created new Quote!", "success");
  //       navigate("/quotes", { state: { refresh: true } });
  //       return { success: true };
  //     }
  //   } catch (error) {
  //     showSnackbar(error?.message || "Failed To Create Quote!", "error");
  //     return { success: false };
  //   }
  // };

  // 2. Consume the hook
  const { createQuote, loading } = useCreateQuote();

  // The onSubmit prop for QuoteForm now directly calls the hook's function
  const handleCreate = async (formData: any) => {
    // All the cleaning, API calls, snackbar, and navigation logic is inside createQuote()
    const result = await createQuote(formData);
    // You can use the 'result' here if needed, e.g., to reset the form.
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
    />
  );
};

export default QuoteCreate;
