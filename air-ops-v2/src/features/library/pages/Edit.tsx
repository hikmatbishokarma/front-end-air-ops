import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "@/lib/graphql/gql";

import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";

import { ILibrary, LibraryEditProps } from "../types/interfaces";
import {
  GET_LIBRARY_BY_ID,
  UPDATE_LIBRARY,
} from "@/lib/graphql/queries/library";
import LibraryChildren from "../components/Children";
import { libraryFormFields } from "../types/formField";
import { transformKeyToObject } from "@/shared/utils";

export const LibraryEdit = ({ id, onClose, refreshList }: LibraryEditProps) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const { control, handleSubmit, reset, setValue } = useForm<ILibrary>({
    defaultValues: {
      name: "",
      department: "",
      attachment: null,
    },
  });

  const [library, setManula] = useState<any>();

  const fetchLibraryById = async (Id: string | number) => {
    const response = await useGql({
      query: GET_LIBRARY_BY_ID,
      queryName: "library",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setManula(response);
    } else {
      showSnackbar("Failed to Edit library!", "error");
    }
  };

  useEffect(() => {
    fetchLibraryById(id);
  }, [id]);

  useEffect(() => {
    if (library) {
      setValue("name", library.name || "");
      setValue("department", library.department || "");
      setValue("attachment", transformKeyToObject(library.attachment));
    }
  }, [library, setValue]);

  const updateLibrary = async (Id: string | number, formData: any) => {
    try {
      const data = await useGql({
        query: UPDATE_LIBRARY,
        queryName: "updateOneLibrary",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to edit Library!", "error");
    }
  };

  const onSubmit = async (data: ILibrary) => {
    try {
      await updateLibrary(id, {
        ...data,
        operatorId,
        attachment: data?.attachment?.key,
      });
      reset();
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
