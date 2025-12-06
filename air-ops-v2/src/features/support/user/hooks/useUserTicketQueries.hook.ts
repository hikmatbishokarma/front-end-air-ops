// src/features/support/user/hooks/useUserTicketQueries.hook.ts

import { useCallback } from "react";
import { useSession } from "@/app/providers";
import { useSupportTickets, useSupportTicketById } from "../../support-team/hooks/useSupportTicketQueries";

/****************************************************
 * HOOK 1: get all tickets for current user
 ****************************************************/
export function useUserTickets() {
  const { session } = useSession();
  const requesterId = session?.user?.id;

  const { ticketList, ticketTotalCount, loading, refetch } = useSupportTickets({
    filter: requesterId ? { requester: { eq: requesterId } } : {},
    page: 0,
    rowsPerPage: 100, // Get all user tickets
  });

  return {
    tickets: ticketList,
    loading,
    refetch,
  };
}

/****************************************************
 * HOOK 2: get single ticket details with messages
 ****************************************************/
export function useUserTicketDetails(ticketId: string) {
  const { ticket, loading, error, refetch } = useSupportTicketById(ticketId);

  return {
    details: ticket,
    loading,
    error,
    refetch,
  };
}
