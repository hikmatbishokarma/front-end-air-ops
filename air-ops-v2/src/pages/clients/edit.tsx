import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import {
  CREATE_CLIENT,
  GET_CLIENT_BY_ID,
  UPDATE_CLIENT,
} from "../../lib/graphql/queries/clients";
import ClientChildren from "./children";
import { Iclient } from "../../interfaces/quote.interface";
import { useSnackbar } from "../../SnackbarContext";

type FormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  type: string;
};

export const EditClient = ({ id }) => {
  const showSnackbar = useSnackbar();

  console.log("EditClient:::", id);

  const editFields = [
    { name: "type", label: "Type", options: [] },
    { name: "name", label: "Name", xs: 6 },
    { name: "phone", label: "Phone", xs: 6 },
    { name: "email", label: "Email", xs: 6 },
    { name: "address", label: "Address", xs: 6 },
  ];

  const { control, handleSubmit, reset, setValue, setError } =
    useForm<FormData>();

  const [client, setClient] = useState<Iclient>();

  const fetchClientById = async (Id) => {
    const response = await useGql({
      query: GET_CLIENT_BY_ID,
      queryName: "client",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setClient(response);
    }
  };

  useEffect(() => {
    fetchClientById(id);
  }, [id]);

  useEffect(() => {
    if (client) {
      setValue("name", client.name || "");
      setValue("phone", client.phone || "");
      setValue("email", client.email || "");
      setValue("address", client.address || "");
      setValue("type", client.isCompany ? "COMPANY" : "PERSON");
    }
  }, [client, setValue]);

  const UpdateClient = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_CLIENT,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: FormData) => {
    const { type, ...rest } = data;
    const formData = { ...rest };
    if (type == "COMPANY") {
      formData["isCompany"] = true;
    } else formData["isPerson"] = true;

    UpdateClient(id, formData);
  };

  return (
    <ClientChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={editFields}
    />
  );
};
