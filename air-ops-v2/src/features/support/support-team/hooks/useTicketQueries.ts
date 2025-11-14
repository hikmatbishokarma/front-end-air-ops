// /support/data/hooks.ts
import { useMemo } from "react";
import { mockTickets } from "../../mockTicket";

export function useTicketsList() {
  // Sort: OPEN → IN_PROGRESS → RESOLVED → CLOSED → newest first
  const sorted = useMemo(() => {
    const statusOrder = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2, CLOSED: 3 };
    return [...mockTickets].sort(
      (a, b) =>
        statusOrder[a.status] - statusOrder[b.status] ||
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, []);

  return { data: sorted, isLoading: false };
}

export function useTicketDetail(id) {
  return {
    data: mockTickets.find((t) => t.id === id),
    isLoading: false,
  };
}
