import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/app/providers";
import useGql from "@/lib/graphql/gql";
import { GET_SUPPORT_TICKETS, GET_SUPPORT_TICKET } from "@/lib/graphql/queries/support-ticket";

interface TicketQueryArgs {
    filter?: any;
    page?: number;
    rowsPerPage?: number;
}

export const useSupportTickets = ({
    filter = {},
    page = 0,
    rowsPerPage = 10,
}: TicketQueryArgs = {}) => {
    const [ticketList, setTicketList] = useState<any[]>([]);
    const [ticketTotalCount, setTicketTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { session } = useSession();
    const operatorId = session?.user.operator?.id || null;

    // Stringify filter to avoid object reference issues
    const filterString = JSON.stringify(filter);

    const getTickets = useCallback(async () => {
        const parsedFilter = JSON.parse(filterString);
        const finalFilter = {
            ...parsedFilter,
            ...(operatorId && { operator: { id: { eq: operatorId } } }),
        };

        setLoading(true);
        try {
            const result = await useGql({
                query: GET_SUPPORT_TICKETS,
                queryName: "tickets",
                queryType: "query-with-count",
                variables: {
                    filter: finalFilter,
                    paging: { offset: page * rowsPerPage, limit: rowsPerPage },
                    sorting: [{ field: "updatedAt", direction: "DESC" }],
                },
            });

            setTicketTotalCount(result?.totalCount || 0);
            setTicketList(result.data || []);
        } catch (error) {
            console.error("Error fetching support tickets:", error);
            setTicketTotalCount(0);
            setTicketList([]);
        } finally {
            setLoading(false);
        }
    }, [filterString, page, rowsPerPage, operatorId]);

    useEffect(() => {
        getTickets();
    }, [getTickets]);

    return { ticketList, ticketTotalCount, loading, refetch: getTickets };
};

export const useSupportTicketById = (id: string) => {
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const getTicketById = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const result = await useGql({
                query: GET_SUPPORT_TICKET,
                queryName: "ticket",
                queryType: "query-without-edge",
                variables: { id },
            });

            // The result is the ticket object directly, not result.data
            setTicket(result);
        } catch (err) {
            console.error("Error fetching support ticket by ID:", err);
            setError(err);
            setTicket(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getTicketById();
    }, [getTicketById]);

    return { ticket, loading, error, refetch: getTicketById };
};
