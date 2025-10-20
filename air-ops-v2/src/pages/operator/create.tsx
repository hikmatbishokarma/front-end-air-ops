import React, { useState } from "react";

import { useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";

import { useSnackbar } from "../../SnackbarContext";
import { OperatorFormValues } from "./type";

import OperatorChildren from "./children";
import { CREATE_OPERATOR } from "../../lib/graphql/queries/operator";
import { OperatorCreateProps } from "./interface";
import { operatorFormFields } from "./formFields";

const OperatorCreate = ({ onClose, refreshList }: OperatorCreateProps) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<OperatorFormValues>();

  const CreateOperator = async (formData: any) => {
    try {
      const data = await useGql({
        query: CREATE_OPERATOR,
        queryName: "",
        queryType: "mutation",
        variables: { operator: formData },
      });

      if (!data || data.errors) {
        showSnackbar(data?.errors?.[0]?.message, "error");
      } else showSnackbar("Created Successfully", "success");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = async (data: OperatorFormValues) => {
    const formattedData = {
      ...data,
      companyLogo: data?.companyLogo?.key,
    };
    await CreateOperator(formattedData); // ✅ Wait for completion
    await refreshList(); // ✅ Now refresh data
    onClose(); // ✅ Then close dialog
  };

  const onInvalid = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  return (
    <div>
      <OperatorChildren
        control={control}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        fields={operatorFormFields}
      />
    </div>
  );
};

export default OperatorCreate;
