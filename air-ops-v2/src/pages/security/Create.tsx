import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import CrewDetailChildren from "./Children";

import { CREATE_CREW_DETAIL } from "../../lib/graphql/queries/crew-detail";

import { useSnackbar } from "../../SnackbarContext";

import { CREATE_SECURITY } from "../../lib/graphql/queries/security";
import SecurityChildren from "./Children";
import { ISecurity } from "./interfaces";
import { securityFormFields } from "./formField";

export const SecurityCreate = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const createSecurity = async (formData) => {
    const result = await useGql({
      query: CREATE_SECURITY,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          security: formData,
        },
      },
    });

    if (result) {
      showSnackbar("Failed to Create Security!", "success");
    } else {
      showSnackbar("Failed to Create Security!", "error");
    }
  };

  const { control, handleSubmit, reset } = useForm<ISecurity>({
    defaultValues: {
      name: "",
      department: "",
      attachment: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createSecurity({ ...data, operatorId }); // Wait for API call to complete
      reset(); // Reset form after successful submission
      refreshList();
      onClose(); // <-- Close dialog after creating
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <SecurityChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={securityFormFields}
    />
  );
};
