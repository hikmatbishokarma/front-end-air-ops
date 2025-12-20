import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "@/lib/graphql/gql";

import { useSession } from "@/app/providers";

import { useSnackbar } from "@/app/providers";

import { CREATE_LIBRARY } from "@/lib/graphql/queries/library";
import LibraryChildren from "../components/Children";
import { ILibrary, LibraryCreateProps } from "../types/interfaces";
import { libraryFormFields } from "../types/formField";

export const LibraryCreate = ({ onClose, refreshList }: LibraryCreateProps) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const createLibrary = async (formData: any) => {
    const result = await useGql({
      query: CREATE_LIBRARY,
      queryName: "createOneLibrary",
      queryType: "mutation",
      variables: {
        input: {
          library: formData,
        },
      },
    });

    if (result) {
      showSnackbar("Library Created Successfully!", "success");
    } else {
      showSnackbar("Failed to Create Library!", "error");
    }
  };

  const { control, handleSubmit, reset } = useForm<ILibrary>({
    defaultValues: {
      name: "",
      department: "",
      attachment: null,
    },
  });

  const onSubmit = async (data: ILibrary) => {
    try {
      await createLibrary({
        ...data,
        operatorId,
        attachment: data?.attachment?.key,
      }); // Wait for API call to complete
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
