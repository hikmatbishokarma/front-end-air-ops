// src/hooks/useAppFilter.ts (Final Minimal Version)

import React, { useState, useEffect, useCallback } from "react";
import moment, { Moment } from "moment";

// The common filter structure managed by the hook
export interface IBaseFilter {
  createdAt?: {
    between: { lower: string; upper: string };
  };
  // Placeholder for search term applied by the hook
  searchTermValue?: { iLike: string };
}

// TFilter will hold the final, merged state
export const useAppFilter = <TFilter extends IBaseFilter>(
  initialFilter: TFilter,
  onFilterChange: (filter: TFilter) => void // Must be provided by consumer
) => {
  // --- STATE VARIABLES (ONLY COMMON ONES) ---
  const [filter, setFilter] = useState<TFilter>(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");

  // UI State for the Filter Panel
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [openFilter, setOpenFilter] = useState(false);

  // Date Input State
  const [dateFilterType, setDateFilterType] = useState("anyDate");
  const [customFromDate, setCustomFromDate] = useState<string>("");
  const [customToDate, setCustomToDate] = useState<string>("");

  // --- HELPERS (Date formatting and UI toggle) ---

  const formatStartOfDayISO = (date: Date): string =>
    moment(date).startOf("day").toISOString();
  const formatEndOfDayISO = (date: Date): string =>
    moment(date).endOf("day").toISOString();

  const handleFilterClose = () => setOpenFilter(false);
  const handleFilterOpen = (e: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(e.currentTarget);
    setOpenFilter(true);
  };

  // --- CORE FILTER CALCULATION (RETURNS DATES, DOES NOT SET FINAL FILTER) ---
  const calculateDateFilter = useCallback(() => {
    // ... (All your date calculation logic, switch statement, etc.) ...
    const today = new Date();
    let from: string | null = null;
    let to: string | null = null;

    switch (dateFilterType) {
      // ... (all date cases: today, yesterday, lastWeek, lastMonth, custom) ...
      case "today":
        from = moment().startOf("day").toISOString();
        to = moment().endOf("day").toISOString();
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
        if (customFromDate)
          from = moment(customFromDate).startOf("day").toISOString();
        if (customToDate) to = moment(customToDate).endOf("day").toISOString();
        break;
      default:
        from = "";
        to = "";
        break;
    }

    // Reset custom dates if a quick selection was made
    if (dateFilterType !== "custom") {
      setCustomFromDate("");
      setCustomToDate("");
    }

    const dateFilter: Partial<TFilter> =
      from && to
        ? ({
          createdAt: { between: { lower: from, upper: to } },
        } as Partial<TFilter>)
        : {};

    return dateFilter;
  }, [dateFilterType, customFromDate, customToDate]);

  // --- ACTION: APPLY ---
  // This action calculates the date filter and passes it to the consumer
  const handelOnApply = useCallback(() => {
    handleFilterClose();

    const dateFilter = calculateDateFilter();

    console.log("dateFilter:::", dateFilter);

    // The hook only provides the date part. The consumer MUST merge it with other filters.
    setFilter((prev) => {
      // Keep the search term and any custom filters (like department/client)
      const { searchTermValue, ...restOfCustomFilters } = prev;

      const newFilter: TFilter = {
        ...initialFilter,
        ...restOfCustomFilters, // Preserve existing custom filters
        ...dateFilter,
        ...(searchTermValue && ({ searchTermValue } as Partial<TFilter>)),
      } as TFilter;

      console.log("newFilter::::", newFilter);
      onFilterChange(newFilter);
      return newFilter;
    });
  }, [calculateDateFilter, onFilterChange, initialFilter]);

  // --- ACTION: RESET ---
  const handelOnReset = useCallback(() => {
    handleFilterClose();
    setSearchTerm("");
    setDateFilterType("anyDate");
    setCustomFromDate("");
    setCustomToDate("");

    // Reset the filter state to ONLY include the initial mandatory filter
    const resetFilter: TFilter = {
      ...initialFilter,
      searchTermValue: undefined,
      createdAt: undefined,
      // Custom ID properties must be handled by the consuming component's state reset
    } as TFilter;

    setFilter(resetFilter);
    onFilterChange(resetFilter);
  }, [initialFilter, onFilterChange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev) => {
        // Remove old search term value to avoid stale data
        const { searchTermValue: oldTerm, ...rest } = prev;

        const newFilter = {
          ...rest,
          ...(searchTerm ? { searchTermValue: { iLike: searchTerm } } : {}),
        } as TFilter;

        // Notify the consumer
        onFilterChange(newFilter);

        return newFilter;
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, onFilterChange]);

  // --- RETURN VALUES ---
  return {
    // ... (Return value remains the same, minus the custom ID properties) ...
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    handleFilterOpen,
    handleFilterClose,
    handelOnApply,
    handelOnReset,
    dateFilterType,
    setDateFilterType,
    customFromDate,
    setCustomFromDate,
    customToDate,
    setCustomToDate,
    filterAnchorEl,
    openFilter,
  };
};
