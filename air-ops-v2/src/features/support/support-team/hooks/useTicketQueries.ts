// /support/data/hooks.ts
import { useSupportTickets, useSupportTicketById } from "./useSupportTicketQueries";

export function useTicketsList() {
  const { ticketList, loading, refetch } = useSupportTickets({
    page: 0,
    rowsPerPage: 100, // Get all tickets
  });

  return { data: ticketList, isLoading: loading, refetch };
}

export function useTicketDetail(id: string) {
  const { ticket, loading, refetch } = useSupportTicketById(id);

  return {
    data: ticket,
    isLoading: loading,
    refetch,
  };
}
