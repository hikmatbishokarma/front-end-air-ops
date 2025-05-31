import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { Pattern } from "@mui/icons-material";
import { FormControl, FormLabel, RadioGroup, Select } from "@mui/material";
import useGql from "../../lib/graphql/gql";

import { useSnackbar } from "../../SnackbarContext";
import { OperatorFormValues } from "./type";
import { operatorFormFields } from "./formfields";
import OperatorChildren from "./children";
import { CREATE_OPERATOR } from "../../lib/graphql/queries/operator";

const OperatorCreate = ({ onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<OperatorFormValues>();

  const CreateOperator = async (formData) => {
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
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = async (data: OperatorFormValues) => {
    console.log("Calling mutation with:", data); // Add this
    const formattedData = {
      ...data,
    };
    await CreateOperator(formattedData); // ✅ Wait for completion
    await refreshList(); // ✅ Now refresh data
    onClose(); // ✅ Then close dialog
  };

  console.log("handleSubmit is:", handleSubmit);

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
