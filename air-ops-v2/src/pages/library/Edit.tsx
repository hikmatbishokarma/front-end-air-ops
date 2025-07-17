import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";

import { useSession } from "../../SessionContext";
import { useSnackbar } from "../../SnackbarContext";

import { ILibrary } from "./interfaces";
import {
  GET_LIBRARY_BY_ID,
  UPDATE_LIBRARY,
} from "../../lib/graphql/queries/library";
import LibraryChildren from "./Children";
import { libraryFormFields } from "./formField";

export const LibraryEdit = ({ id, onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const { control, handleSubmit, reset, setValue } = useForm<ILibrary>({
    defaultValues: {
      name: "",
      department: "",
      attachment: "",
    },
  });

  const [library, setManula] = useState<ILibrary>();

  const fetchLibraryById = async (Id) => {
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
      setValue("attachment", library.attachment || "");
    }
  }, [library, setValue]);

  const updateLibrary = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_LIBRARY,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to edit Library!", "error");
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateLibrary(id, {
        ...data,
        operatorId,
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
