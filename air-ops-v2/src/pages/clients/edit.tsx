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
import { useSession } from "../../SessionContext";
import { Pattern } from "@mui/icons-material";

type FormData = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  type: string;
  gstNo?: string;
  panNo?: string;
};

export const EditClient = ({ id, handleSubDialogClose }) => {
  const showSnackbar = useSnackbar();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const editFields = [
    { name: "type", label: "Type", options: [], xs: 12, required: true },
    { name: "name", label: "Name", xs: 6, required: true },
    {
      name: "lastName",
      label: "Last Name",
      xs: 6,
      required: true,
      visible: (type: string) => type !== "COMPANY",
    },
    {
      name: "phone",
      label: "Phone",
      xs: 6,
      required: true,
      pattern: {
        value: /^[0-9]{10}$/, // Simple 10-digit number validation
        message: "Phone number must be 10 digits",
      },
    },
    {
      name: "email",
      label: "Email",
      xs: 6,
      required: true,
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    },
    { name: "address", label: "Address", xs: 6, required: true },
    {
      name: "panNo",
      label: "PAN No",
      xs: 6,
      Pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN" },
      required: false,
    },
    {
      name: "gstNo",
      label: "GST No",
      xs: 6,
      Pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: "Invalid PAN",
      },
      required: false,
    },
    {
      name: "billingAddress",
      label: "Billing Address",
      xs: 6,
      required: false,
    },
  ];

  const { control, handleSubmit, reset, setValue, setError, getValues } =
    useForm<FormData>({
      defaultValues: {
        type: "PERSON", // <- make sure this exists
      },
    });

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
      setValue("lastName", client.lastName || "");
      setValue("phone", client.phone || "");
      setValue("email", client.email || "");
      setValue("address", client.address || "");
      setValue("type", client.isCompany ? "COMPANY" : "PERSON");
      setValue("panNo", client.panNo || "");
      setValue("gstNo", client.gstNo || "");
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

    UpdateClient(id, { ...formData, operatorId });
    handleSubDialogClose();
  };

  return (
    <ClientChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={editFields}
      setValue={setValue} // ✅ Pass it down here
      getValues={getValues}
    />
  );
};
