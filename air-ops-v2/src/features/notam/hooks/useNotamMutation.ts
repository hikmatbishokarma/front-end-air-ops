import { useCallback } from "react";
import { useSnackbar } from "@/app/providers";
import { useSession } from "@/app/providers";
import { useGqlMutation } from "../../../shared/hooks/useGqlMutation";
import { CREATE_NOTAM, UPDATE_NOTAMS } from "../../../lib/graphql/queries/notam";

export const useCreateNotamMutation = () => {
    const showSnackbar = useSnackbar();
    const { session } = useSession();
    const operatorId = session?.user?.operator?.id;

    const { loading, error, mutate } = useGqlMutation();

    const createNotam = useCallback(
        async (notamData: {
            region: string;
            category: string;
            fileName: string;
            fileUrl: string;
            date?: string;
        }) => {
            try {
                const gqlParams = {
                    query: CREATE_NOTAM,
                    queryName: "createOneNotam",
                    queryType: "mutation",
                    variables: {
                        input: {
                            notam: {
                                ...(operatorId && { operatorId }),
                                region: notamData.region,
                                category: notamData.category,
                                fileName: notamData.fileName,
                                // fileUrl: notamData.fileUrl,
                                ...(notamData.date && { date: notamData.date }),
                            },
                        },
                    },
                };

                const result = await mutate(gqlParams);

                const newNotamId = result?.data?.id;

                if (newNotamId) {
                    showSnackbar(
                        `NOTAM uploaded successfully for ${notamData.region}!`,
                        "success"
                    );
                    return { success: true, notamId: newNotamId };
                }

                showSnackbar(
                    result.error?.message || "Failed to upload NOTAM!",
                    "error"
                );
                return { success: false, error: result.error };
            } catch (err: any) {
                console.error("Unexpected error in createNotam:", err);
                showSnackbar(err.message || "Failed to upload NOTAM!", "error");
                return { success: false, error: err };
            }
        },
        [operatorId, showSnackbar, mutate]
    );

    return { createNotam, loading, error };
};

export const useUpdateNotamMutation = () => {
    const showSnackbar = useSnackbar();

    const { loading, error, mutate } = useGqlMutation();

    const updateNotam = useCallback(
        async (
            id: string,
            updateData: {
                region?: string;
                category?: string;
                fileName?: string;
                // fileUrl?: string; // Removed as it's not in the DTO
                date?: string;
            }
        ) => {
            try {
                const gqlParams = {
                    query: UPDATE_NOTAMS,
                    queryName: "updateOneNotam",
                    queryType: "mutation",
                    variables: {
                        input: {
                            id,
                            update: updateData,
                        },
                    },
                };

                const result = await mutate(gqlParams);

                if (result?.data?.id) {
                    showSnackbar("NOTAM updated successfully!", "success");
                    return { success: true, notamId: result.data.id };
                }

                showSnackbar(
                    result.error?.message || "Failed to update NOTAM!",
                    "error"
                );
                return { success: false, error: result.error };
            } catch (err: any) {
                console.error("Unexpected error in updateNotam:", err);
                showSnackbar(err.message || "Failed to update NOTAM!", "error");
                return { success: false, error: err };
            }
        },
        [showSnackbar, mutate]
    );

    return { updateNotam, loading, error };
};
