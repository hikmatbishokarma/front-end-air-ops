import { useCallback } from "react";
import useGql from "@/lib/graphql/gql";
import { useSnackbar } from "@/app/providers";
import { useSession } from "@/app/providers";
import {
  CREATE_CREW,
  UPDATE_CREW_DETAIL,
  DELETE_CREW_DETAIL,
} from "@/lib/graphql/queries/crew-detail";
import { useGqlMutation } from "@/shared/hooks/useGqlMutation";
import { removeTypename } from "@/shared/utils";

/**
 * Interface for mutation options, allowing the component to control side-effects.
 */
interface MutationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
}

// ----------------------------------------------------------------------
// 1. CREATE CREW DETAIL (Used by CrewDetailCreate.tsx)
// ----------------------------------------------------------------------

export const useCreateCrewDetail = () => {
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;
  const { loading, error, mutate } = useGqlMutation();

  const createCrewDetail = useCallback(
    async (formData: any) => {
      try {
        // 1. DATA MAPPING/CLEANING (copied directly from Create.tsx logic)
        let { certifications, nominees, profile, roles, ...rest } = formData;

        const formattedData = {
          ...rest,
          certifications: certifications?.map((cert: any) => ({
            ...cert,
            issuedBy: cert?.issuedBy?.key,
          })),
          nominees: nominees?.map((nominee: any) => ({
            ...nominee,
            idProof: nominee?.idProof?.key,
            insurance: nominee?.insurance?.key,
          })),
          operatorId,
          profile: profile?.key,
          ...(roles && {
            roles: roles.map((role: any) => role.id), // Map roles to IDs
          }),
        };

        // 2. API CALL
        const gqlParams = {
          query: CREATE_CREW,
          queryName: "",
          queryType: "mutation",
          variables: {
            input: {
              crew: formattedData,
            },
          },
        };

        const result = await mutate(gqlParams);

        // 3. SIDE-EFFECT HANDLING (Snackbar)
        if (result.success) {
          showSnackbar("Created Crew Detail successfully!", "success");
        } else {
          showSnackbar(
            result.error?.message || "Failed to Create Crew Detail!",
            "error"
          );
        }
        return result;
      } catch (err: any) {
        // Catch any unexpected errors during data cleaning
        showSnackbar(err.message || "Failed To Create Crew Detail!", "error");
        return { success: false, error: err };
      }
    },
    [operatorId, showSnackbar, mutate]
  );

  return { createCrewDetail, loading, error };
};

// ----------------------------------------------------------------------
// 2. UPDATE CREW DETAIL (Used by CrewDetailEdit.tsx)
// ----------------------------------------------------------------------

export const useUpdateCrewDetail = (
  crewDetailId: string | number | undefined
) => {
  const showSnackbar = useSnackbar();
  const { session } = useSession();
  const operatorId = session?.user?.operator?.id || null;
  const { loading, error, mutate } = useGqlMutation();

  const updateCrewDetail = useCallback(
    async (formData: any) => {
      try {
        // 1. DATA MAPPING/CLEANING (copied directly from Edit.tsx logic)
        let { certifications, nominees, profile, roles, ...rest } = formData;

        // Match Edit.tsx logic: certifications only map issuedBy
        const formattedCertifications = certifications?.map((cert: any) => ({
          issuedBy: cert?.issuedBy?.key,
        }));

        const formattedNominees = nominees?.map((nominee: any) => ({
          ...nominee,
          idProof: nominee?.idProof?.key,
          insurance: nominee?.insurance?.key,
        }));

        const formattedData = removeTypename({
          ...rest,
          certifications: formattedCertifications,
          nominees: formattedNominees,
          operatorId,
          profile: profile?.key,
          ...(roles && {
            roles: roles.map((role: any) => role.id), // Map roles to IDs
          }),
        });

        // 2. API CALL
        const gqlParams = {
          query: UPDATE_CREW_DETAIL,
          queryName: "updateOneCrewDetail",
          queryType: "mutation",
          variables: {
            input: {
              id: crewDetailId,
              update: formattedData,
            },
          },
        };

        const result = await mutate(gqlParams);

        // 3. SIDE-EFFECT HANDLING (Snackbar)
        if (result.success) {
          showSnackbar("Updated Crew Detail successfully!", "success");
        } else {
          showSnackbar(
            result.error?.message || "Failed To Update Crew Detail!",
            "error"
          );
        }
        return result;
      } catch (err: any) {
        showSnackbar(err.message || "Failed To Update Crew Detail!", "error");
        return { success: false, error: err };
      }
    },
    [operatorId, showSnackbar, mutate, crewDetailId]
  );

  return { updateCrewDetail, loading, error };
};

// ----------------------------------------------------------------------
// 3. DELETE CREW DETAIL (Used by CrewDetailList.tsx)
// ----------------------------------------------------------------------

export const useDeleteCrewDetail = () => {
  const showSnackbar = useSnackbar();
  const { loading, error, mutate } = useGqlMutation();

  const deleteCrewDetail = useCallback(
    async (id: string | number) => {
      try {
        const gqlParams = {
          query: DELETE_CREW_DETAIL,
          queryName: "",
          queryType: "mutation",
          variables: {
            input: { id },
          },
        };

        const result = await mutate(gqlParams);

        // 3. SIDE-EFFECT HANDLING (Snackbar)
        if (result.success) {
          showSnackbar("Deleted Crew Detail successfully!", "success");
        } else {
          showSnackbar(
            result.error?.message || "Failed to Delete Crew Detail!",
            "error"
          );
        }
        return result;
      } catch (err: any) {
        showSnackbar(err.message || "Failed To Delete Crew Detail!", "error");
        return { success: false, error: err };
      }
    },
    [showSnackbar, mutate]
  );

  return { deleteCrewDetail, loading, error };
};

// ----------------------------------------------------------------------
// 4. UPDATE CREW STATUS (Used by CrewDetailList.tsx for isActive toggle)
// ----------------------------------------------------------------------

export const useUpdateCrewStatus = () => {
  const showSnackbar = useSnackbar();
  const { loading, error, mutate } = useGqlMutation();

  const updateCrewStatus = useCallback(
    async (itemId: string, newStatus: boolean) => {
      try {
        const gqlParams = {
          query: UPDATE_CREW_DETAIL,
          queryName: "updateOneCrewDetail",
          queryType: "mutation",
          variables: {
            input: {
              id: itemId,
              update: { isActive: newStatus },
            },
          },
        };

        const result = await mutate(gqlParams);

        // 3. SIDE-EFFECT HANDLING (Snackbar)
        if (result.success) {
          showSnackbar("Status changed successfully", "success");
        } else {
          showSnackbar(
            result.error?.message || "Failed to change status!",
            "error"
          );
        }
        return result;
      } catch (err: any) {
        showSnackbar(err.message || "Failed to change status!", "error");
        return { success: false, error: err };
      }
    },
    [showSnackbar, mutate]
  );

  return { updateCrewStatus, loading, error };
};
