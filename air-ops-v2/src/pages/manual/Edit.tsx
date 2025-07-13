import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import CrewDetailChildren from "./Children";

import {
  GET_CREW_DETAIL_BY_ID,
  UPDATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { useSnackbar } from "../../SnackbarContext";
import { IManual } from "./interfaces";
import {
  GET_MANUAL_BY_ID,
  UPDATE_MANUAL,
} from "../../lib/graphql/queries/manual";
import { manualFormFields } from "./formField";
import ManualChildren from "./Children";

export const ManualEdit = ({ id, onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const { control, handleSubmit, reset, setValue } = useForm<IManual>({
    defaultValues: {
      name: "",
      department: "",
      attachment: "",
    },
  });

  const [manual, setManula] = useState<IManual>();

  const fetchManualById = async (Id) => {
    const response = await useGql({
      query: GET_MANUAL_BY_ID,
      queryName: "manual",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setManula(response);
    } else {
      showSnackbar("Failed to Edit Manual!", "error");
    }
  };

  useEffect(() => {
    fetchManualById(id);
  }, [id]);

  useEffect(() => {
    if (manual) {
      setValue("name", manual.name || "");
      setValue("department", manual.department || "");
      setValue("attachment", manual.attachment || "");
    }
  }, [manual, setValue]);

  const updateManual = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_MANUAL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to edit Manual!", "error");
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateManual(id, {
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
    <ManualChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={manualFormFields}
    />
  );
};
