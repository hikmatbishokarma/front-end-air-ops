import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";

import { GET_AGENT_BY_ID, UPDATE_AGENT } from "../../lib/graphql/queries/agent";
import { AgentFormValues } from "./type";
import AgentChildren from "./children";
import { agentFormFields } from "./formfields";

export const AgentEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AgentFormValues>();

  const [agent, setAgent] = useState<AgentFormValues>();

  const fetchAgent = async (Id) => {
    const response = await useGql({
      query: GET_AGENT_BY_ID,
      queryName: "agent",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setAgent(response);
    }
  };

  useEffect(() => {
    fetchAgent(id);
  }, [id]);

  useEffect(() => {
    if (agent) {
      setValue("name", agent.name || "");
      setValue("email", agent.email || "");
      setValue("phone", agent.phone || "");
      setValue("companyName", agent.companyName || "");
      setValue("companyLogo", agent.companyLogo || "");
      setValue("address", agent.address || "");
      setValue("city", agent.city || "");
      setValue("country", agent.country || "");
      setValue("zipCode", agent.zipCode || "");
      setValue("supportEmail", agent.supportEmail || "");
      setValue("websiteUrl", agent.websiteUrl || "");
    }
  }, [agent, setValue]);

  const UpdateAgent = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AGENT,
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

  const onSubmit = (data: AgentFormValues) => {
    const formattedData = {
      ...data,
    };

    UpdateAgent(id, formattedData);
    refreshList();
    onClose();
  };

  return (
    <AgentChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={agentFormFields}
    />
  );
};
