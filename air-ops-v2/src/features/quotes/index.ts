// Barrel exports for Quotes feature
export { default as QuoteList } from "./pages/List";
export { default as QuoteCreate } from "./pages/QuoteCreate";
export { default as QuoteEdit } from "./pages/QuoteEdit";
export { default as SalesConfirmationPreview } from "./pages/SalesConfirmationPreview";

export { default as QuoteDialog } from "./components/QuoteDialog";
export { default as QuotePreview } from "./components/QuotePreview";
export { default as RepresentativeDialog } from "./components/RepresentativeDialog";
export { default as SaleConfirmationPreview } from "./components/SaleConfirmationPreview";
export { default as FilterPanel } from "./components/FilterPanel";
export { default as QuoteForm } from "./components/QuoteForm";

export { useQuoteData } from "./hooks/useQuoteData";
export { useQuoteSummaryData } from "./hooks/useQuoteSummaryData";
export {
  usePassengerExistenceCheck,
  useQuotePreview,
  useQuoteListData,
} from "./hooks/useQuoteQueries";
export {
  useCreateQuote,
  useUpdateQuote,
  useConfirmSale,
  useCreateInitialPassengerDetails,
  useUpdatePassengerDetails,
} from "./hooks/useQuoteMutations";
export { useQuoteEditorData } from "./hooks/useQuoteEditorData";

export * from "./types";
