import React from "react";
import { useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import ClientChildren from "./children";

export const CreateClient = () => {
  const createFields = [
    { name: "type", label: "Type", options: [] },
    { name: "name", label: "Name", xs: 6 },
    { name: "phone", label: "Phone", xs: 6 },
    { name: "email", label: "Email", xs: 6 },
    { name: "address", label: "Address", xs: 6 },
  ];

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      type: "",
    },
  });

  const createClient = async (formData) => {
    const data = await useGql({
      query: CREATE_CLIENT,
      queryName: "clients",
      variables: {
        input: {
          client: formData,
        },
      },
    });

    console.log("submitted data:", data);
  };

  const onSubmit = async (data) => {
    const { type, ...rest } = data;
    const formData = { ...rest };
    if (type == "COMPANY") {
      formData["isCompany"] = true;
    } else formData["isPerson"] = true;
    try {
      await createClient(formData); // Wait for API call to complete
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <ClientChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={createFields}
    />
  );
};
