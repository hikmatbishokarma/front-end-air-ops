import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";

import { useSession } from "../../SessionContext";

import { useSnackbar } from "../../SnackbarContext";

import { CREATE_LIBRARY } from "../../lib/graphql/queries/library";
import LibraryChildren from "./Children";
import { ILibrary } from "./interfaces";
import { libraryFormFields } from "./formField";

export const LibraryCreate = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.agent?.id || null;

  const createLibrary = async (formData) => {
    const result = await useGql({
      query: CREATE_LIBRARY,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          library: formData,
        },
      },
    });

    if (result) {
      showSnackbar("Failed to Create Library!", "success");
    } else {
      showSnackbar("Failed to Create Library!", "error");
    }
  };

  const { control, handleSubmit, reset } = useForm<ILibrary>({
    defaultValues: {
      name: "",
      department: "",
      attachment: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createLibrary({ ...data, operatorId }); // Wait for API call to complete
      reset(); // Reset form after successful submission
      refreshList();
      onClose(); // <-- Close dialog after creating
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <LibraryChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={libraryFormFields}
    />
  );
};
