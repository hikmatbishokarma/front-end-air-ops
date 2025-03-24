import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { Irepresentative } from "../../interfaces/quote.interface";
import { useSnackbar } from "../../SnackbarContext";
import {
  GET_REPRESENTATIVE_BY_ID,
  UPDATE_REPRESENTATIVE,
} from "../../lib/graphql/queries/representative";
import RepresentativeChildren from "./children";

type FormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export const EditRepresentative = ({ client, id }) => {
  const showSnackbar = useSnackbar();

  const editFields = [
    { name: "name", label: "Name", xs: 6 },
    { name: "phone", label: "Phone", xs: 6 },
    { name: "email", label: "Email", xs: 6 },
    { name: "address", label: "Address", xs: 6 },
  ];

  const { control, handleSubmit, reset, setValue, setError } =
    useForm<FormData>();

  const [representative, setRepresentative] = useState<Irepresentative>();

  const fetchRepresentativeById = async (Id) => {
    const response = await useGql({
      query: GET_REPRESENTATIVE_BY_ID,
      queryName: "representative",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setRepresentative(response);
    }
  };

  useEffect(() => {
    fetchRepresentativeById(id);
  }, [id]);

  useEffect(() => {
    if (representative) {
      setValue("name", representative.name || "");
      setValue("phone", representative.phone || "");
      setValue("email", representative.email || "");
      setValue("address", representative.address || "");
    }
  }, [representative, setValue]);

  const UpdateRepresentative = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_REPRESENTATIVE,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(
        error.message || "Failed to update representative!",
        "error",
      );
    }
  };

  const onSubmit = (data: FormData) => {
    try {
      const formData = { ...data, client: client.id };
      UpdateRepresentative(id, formData);

      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <RepresentativeChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={editFields}
    />
  );
};
