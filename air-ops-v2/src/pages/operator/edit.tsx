import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";

import { OperatorFormValues } from "./type";
import OperatorChildren from "./children";
import { operatorFormFields } from "./formfields";
import {
  GET_OPERATOR_BY_ID,
  UPDATE_OPERATOR,
} from "../../lib/graphql/queries/operator";

export const OperatorEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<OperatorFormValues>();

  const [operator, setOperator] = useState<OperatorFormValues>();

  const fetchOperator = async (Id) => {
    const response = await useGql({
      query: GET_OPERATOR_BY_ID,
      queryName: "operator",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setOperator(response);
    }
  };

  useEffect(() => {
    fetchOperator(id);
  }, [id]);

  useEffect(() => {
    if (operator) {
      setValue("name", operator.name || "");
      setValue("email", operator.email || "");
      setValue("phone", operator.phone || "");
      setValue("companyName", operator.companyName || "");
      setValue("companyLogo", operator.companyLogo || "");
      setValue("address", operator.address || "");
      setValue("city", operator.city || "");
      // setValue("country", operator.country || "");
      setValue("pinCode", operator.pinCode || "");
      setValue("supportEmail", operator.supportEmail || "");
      setValue("websiteUrl", operator.websiteUrl || "");
    }
  }, [operator, setValue]);

  const UpdateOperator = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_OPERATOR,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
      refreshList();
      onClose();
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: OperatorFormValues) => {
    const formattedData = {
      ...data,
    };

    UpdateOperator(id, formattedData);
    refreshList();
    onClose();
  };

  return (
    <OperatorChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={operatorFormFields}
    />
  );
};
