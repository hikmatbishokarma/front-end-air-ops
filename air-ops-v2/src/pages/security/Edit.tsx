import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import { useSnackbar } from "../../SnackbarContext";
import { securityFormFields } from "./formField";
import { ISecurity } from "./interfaces";
import {
  GET_SECURITY_BY_ID,
  UPDATE_SECURITY,
} from "../../lib/graphql/queries/security";
import SecurityChildren from "./Children";

export const SecurityEdit = ({ id, onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const { control, handleSubmit, reset, setValue } = useForm<ISecurity>({
    defaultValues: {
      type: "",
      name: "",
      department: "",
      attachment: "",
    },
  });

  const [security, setManula] = useState<ISecurity>();

  const fetchSecurityById = async (Id) => {
    const response = await useGql({
      query: GET_SECURITY_BY_ID,
      queryName: "security",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setManula(response);
    } else {
      showSnackbar("Failed to Edit Security!", "error");
    }
  };

  useEffect(() => {
    fetchSecurityById(id);
  }, [id]);

  useEffect(() => {
    if (security) {
      setValue("type", security.type || "");
      setValue("name", security.name || "");
      setValue("department", security.department || "");
      setValue("attachment", security.attachment || "");
    }
  }, [security, setValue]);

  const updateSecurity = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_SECURITY,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to edit Security!", "error");
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateSecurity(id, {
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
    <SecurityChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={securityFormFields}
    />
  );
};
