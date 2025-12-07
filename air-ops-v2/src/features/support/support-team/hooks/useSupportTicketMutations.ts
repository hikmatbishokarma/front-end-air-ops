import { useCallback } from "react";
import { useSnackbar } from "@/app/providers";
import { useSession } from "@/app/providers";
import { useGqlMutation } from "@/shared/hooks/useGqlMutation";
import {
    CREATE_SUPPORT_TICKET,
    UPDATE_TICKET_METADATA,
    ADD_MESSAGE_TO_TICKET,
} from "@/lib/graphql/queries/support-ticket";

export const useCreateSupportTicket = () => {
    const showSnackbar = useSnackbar();
    const { session } = useSession();
    const operatorId = session?.user?.operator?.id;
    const requesterId = session?.user?.id;

    const { loading, error, mutate } = useGqlMutation();

    const createTicket = useCallback(
        async (ticketData: {
            subject: string;
            status: string;
            priority: string;
            department: string;
            message: string;
            attachments?: string[];
        }) => {
            try {
                const gqlParams = {
                    query: CREATE_SUPPORT_TICKET,
                    queryName: "createOneTicket",
                    queryType: "mutation",
                    variables: {
                        input: {
                            ticket: {
                                subject: ticketData.subject,
                                status: ticketData.status,
                                priority: ticketData.priority,
                                department: ticketData.department,
                                requester: requesterId,
                                ...(operatorId && { operatorId }),
                                // Include initial message in messages array
                                messages: [
                                    {
                                        message: ticketData.message,
                                        authorId: requesterId, // Same as requester for initial message
                                        attachments: ticketData.attachments || [],
                                    },
                                ],
                            },
                        },
                    },
                };

                const result = await mutate(gqlParams);
                const newTicketId = result?.data?.id;

                if (newTicketId) {
                    showSnackbar("Support ticket created successfully!", "success");
                    return { success: true, ticketId: newTicketId };
                }

                showSnackbar(
                    result.error?.message || "Failed to create support ticket!",
                    "error"
                );
                return { success: false, error: result.error };
            } catch (err: any) {
                console.error("Unexpected error in createTicket:", err);
                showSnackbar(err.message || "Failed to create support ticket!", "error");
                return { success: false, error: err };
            }
        },
        [operatorId, requesterId, showSnackbar, mutate]
    );

    return { createTicket, loading, error };
};

export const useUpdateSupportTicket = () => {
    const showSnackbar = useSnackbar();

    const { loading, error, mutate } = useGqlMutation();

    const updateTicket = useCallback(
        async (
            id: string,
            updateData: {
                status?: string;
                priority?: string;
                department?: string;
            }
        ) => {
            try {
                const gqlParams = {
                    query: UPDATE_TICKET_METADATA,
                    queryName: "updateTicketMetadata",
                    queryType: "mutation",
                    variables: {
                        ticketId: id,
                        updates: updateData,
                    },
                };

                const result = await mutate(gqlParams);

                if (result?.data?.id) {
                    showSnackbar("Ticket updated successfully!", "success");
                    return { success: true, ticketId: result.data.id };
                }

                showSnackbar(
                    result.error?.message || "Failed to update ticket!",
                    "error"
                );
                return { success: false, error: result.error };
            } catch (err: any) {
                console.error("Unexpected error in updateTicket:", err);
                showSnackbar(err.message || "Failed to update ticket!", "error");
                return { success: false, error: err };
            }
        },
        [showSnackbar, mutate]
    );

    return { updateTicket, loading, error };
};

export const useAddMessageToTicket = () => {
    const showSnackbar = useSnackbar();
    const { session } = useSession();
    const authorId = session?.user?.id;

    const { loading, error, mutate } = useGqlMutation();

    const addMessage = useCallback(
        async (messageData: {
            ticketId: string;
            message: string;
            attachments?: string[];
        }) => {
            try {
                const gqlParams = {
                    query: ADD_MESSAGE_TO_TICKET,
                    queryName: "addMessageToTicket",
                    queryType: "mutation",
                    variables: {
                        input: {
                            ticketId: messageData.ticketId,
                            message: messageData.message,
                            authorId: authorId, // Changed from author to authorId
                            attachments: messageData.attachments || [],
                        },
                    },
                };

                const result = await mutate(gqlParams);

                if (result?.data?.id) {
                    showSnackbar("Message sent successfully!", "success");
                    return { success: true, ticketId: result.data.id };
                }

                showSnackbar(
                    result.error?.message || "Failed to send message!",
                    "error"
                );
                return { success: false, error: result.error };
            } catch (err: any) {
                console.error("Unexpected error in addMessage:", err);
                showSnackbar(err.message || "Failed to send message!", "error");
                return { success: false, error: err };
            }
        },
        [authorId, showSnackbar, mutate]
    );

    return { addMessage, loading, error };
};
