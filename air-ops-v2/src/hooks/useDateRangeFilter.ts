// src/hooks/useDateRangeFilter.ts
import { useState, useCallback } from "react";
import moment from "moment";

// --- Utility Functions (moved here from your component) ---
// Note: We use moment for consistency as your component uses it for FilterPanel props
const formatStartOfDayISO = (date: Date): string =>
  moment(date).startOf("day").toISOString();
const formatEndOfDayISO = (date: Date): string =>
  moment(date).endOf("day").toISOString();

interface DateFilterState {
  dateFilterType: string;
  customFromDate: string;
  customToDate: string;
}

interface DateFilterHookResult {
  dateFilterType: string;
  setDateFilterType: React.Dispatch<React.SetStateAction<string>>;
  customFromDate: string;
  setCustomFromDate: React.Dispatch<React.SetStateAction<string>>;
  customToDate: string;
  setCustomToDate: React.Dispatch<React.SetStateAction<string>>;
  // This function returns the calculated date portion of the filter
  getCalculatedDateFilter: () => { from: string | null; to: string | null };
  resetDateFilter: () => void;
}

export const useDateRangeFilter = (): DateFilterHookResult => {
  // 1. Core Date Filter State (now managed inside the hook)
  const [dateFilterType, setDateFilterType] = useState("anyDate");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  // 2. Logic to calculate the ISO date range
  const getCalculatedDateFilter = useCallback(() => {
    const today = new Date();
    let from: string | null = null;
    let to: string | null = null;

    switch (dateFilterType) {
      case "today":
        from = formatStartOfDayISO(today);
        to = formatEndOfDayISO(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        from = formatStartOfDayISO(yesterday);
        to = formatEndOfDayISO(yesterday);
        break;
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7);
        from = formatStartOfDayISO(lastWeekStart);
        to = formatEndOfDayISO(today);
        break;
      case "lastMonth":
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        from = formatStartOfDayISO(firstDayOfLastMonth);
        to = formatEndOfDayISO(lastDayOfLastMonth);
        break;
      case "custom":
        if (customFromDate) {
          from = formatStartOfDayISO(new Date(customFromDate));
        }
        if (customToDate) {
          to = formatEndOfDayISO(new Date(customToDate));
        }
        break;
      case "anyDate":
      default:
        from = null;
        to = null;
        break;
    }

    // Note: We skip the logic to clear custom dates if dateFilterType !== "custom",
    // as you requested to preserve the custom date UI state.

    return { from, to };
  }, [dateFilterType, customFromDate, customToDate]);

  const resetDateFilter = useCallback(() => {
    setDateFilterType("anyDate");
    setCustomFromDate("");
    setCustomToDate("");
  }, []);

  return {
    dateFilterType,
    setDateFilterType,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    getCalculatedDateFilter,
    resetDateFilter,
  };
};
