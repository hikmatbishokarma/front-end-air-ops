import { useCallback, useState, useEffect } from 'react';
import useGql from '@/lib/graphql/gql';
import { useSnackbar } from '@/app/providers';
import {
    CREATE_INTIMATION,
    UPDATE_INTIMATION,
    SEND_INTIMATION,
    DELETE_INTIMATION,
    GET_INTIMATIONS_BY_TRIP,
} from '@/lib/graphql/queries/intimation';
import { useGqlMutation } from '@/shared/hooks/useGqlMutation';

export const useIntimation = (tripId?: string) => {
    const showSnackbar = useSnackbar();
    const { loading: mutationLoading, mutate } = useGqlMutation();
    const [intimations, setIntimations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch intimations
    const fetchIntimations = useCallback(async () => {
        if (!tripId) return;

        setLoading(true);
        try {
            const result = await useGql({
                query: GET_INTIMATIONS_BY_TRIP,
                variables: { tripId },
                queryName: 'getIntimationsByTrip',
                queryType: 'query-without-edge',
            });
            setIntimations(result || []);
        } catch (error: any) {
            showSnackbar(`Error fetching intimations: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [tripId, showSnackbar]);

    useEffect(() => {
        fetchIntimations();
    }, [fetchIntimations]);

    // Create intimation
    const createIntimation = useCallback(
        async (input: any) => {
            try {
                console.log('Creating intimation with input:', input); // Debug log

                const result = await mutate({
                    query: CREATE_INTIMATION,
                    queryName: 'createIntimation',
                    queryType: 'mutation',
                    variables: { input },
                });

                if (result.success) {
                    showSnackbar('Intimation draft saved successfully', 'success');
                    fetchIntimations();
                } else {
                    showSnackbar(result.error?.message || 'Failed to save intimation', 'error');
                }
                return result;
            } catch (error: any) {
                showSnackbar(`Error: ${error.message}`, 'error');
                return { success: false, error };
            }
        },
        [mutate, showSnackbar, fetchIntimations]
    );

    // Update intimation
    const updateIntimation = useCallback(
        async (id: string, input: any) => {
            try {
                const result = await mutate({
                    query: UPDATE_INTIMATION,
                    queryName: 'updateIntimation',
                    queryType: 'mutation',
                    variables: { id, input },
                });

                if (result.success) {
                    showSnackbar('Intimation updated successfully', 'success');
                    fetchIntimations();
                } else {
                    showSnackbar(result.error?.message || 'Failed to update intimation', 'error');
                }
                return result;
            } catch (error: any) {
                showSnackbar(`Error: ${error.message}`, 'error');
                return { success: false, error };
            }
        },
        [mutate, showSnackbar, fetchIntimations]
    );

    // Send intimation
    const sendIntimation = useCallback(
        async (intimationId: string) => {
            try {
                const result = await mutate({
                    query: SEND_INTIMATION,
                    queryName: 'sendIntimation',
                    queryType: 'mutation',
                    variables: { input: { intimationId } },
                });

                if (result.success) {
                    showSnackbar('Intimation sent successfully', 'success');
                    fetchIntimations();
                } else {
                    showSnackbar(result.error?.message || 'Failed to send intimation', 'error');
                }
                return result;
            } catch (error: any) {
                showSnackbar(`Error: ${error.message}`, 'error');
                return { success: false, error };
            }
        },
        [mutate, showSnackbar, fetchIntimations]
    );

    // Delete intimation
    const deleteIntimation = useCallback(
        async (id: string) => {
            try {
                const result = await mutate({
                    query: DELETE_INTIMATION,
                    queryName: 'deleteIntimation',
                    queryType: 'mutation',
                    variables: { id },
                });

                if (result.success) {
                    showSnackbar('Intimation deleted successfully', 'success');
                    fetchIntimations();
                } else {
                    showSnackbar(result.error?.message || 'Failed to delete intimation', 'error');
                }
                return result;
            } catch (error: any) {
                showSnackbar(`Error: ${error.message}`, 'error');
                return { success: false, error };
            }
        },
        [mutate, showSnackbar, fetchIntimations]
    );

    return {
        intimations,
        loading,
        creating: mutationLoading,
        updating: mutationLoading,
        sending: mutationLoading,
        deleting: mutationLoading,
        createIntimation,
        updateIntimation,
        sendIntimation,
        deleteIntimation,
        refetch: fetchIntimations,
    };
};
