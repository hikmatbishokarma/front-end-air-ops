import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import CrewDetailChildren from "./Children";

import { CREATE_CREW_DETAIL } from "../../lib/graphql/queries/crew-detail";
import { CREATE_MANUAL } from "../../lib/graphql/queries/manual";
import { useSnackbar } from "../../SnackbarContext";
import { IManual } from "./interfaces";
import ManualChildren from "./Children";
import { manualFormFields } from "./formField";

export const ManualCreate = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.agent?.id || null;

  const createManual = async (formData) => {
    const result = await useGql({
      query: CREATE_MANUAL,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          manual: formData,
        },
      },
    });

    if (result) {
      showSnackbar("Failed to Create Manual!", "success");
    } else {
      showSnackbar("Failed to Create Manual!", "error");
    }
  };

  const { control, handleSubmit, reset } = useForm<IManual>({
    defaultValues: {
      name: "",
      department: "",
      attachment: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createManual({ ...data, operatorId }); // Wait for API call to complete
      reset(); // Reset form after successful submission
      refreshList();
      onClose(); // <-- Close dialog after creating
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <ManualChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={manualFormFields}
    />
  );
};
