import React from "react";
import { useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";

import { CREATE_REPRESENTATIVE } from "../../lib/graphql/queries/representative";
import RepresentativeChildren from "./children";

export const CreateRepresentative = ({ client }) => {
  const createFields = [
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
    },
  });

  const createRepresentative = async (formData) => {
    const data = await useGql({
      query: CREATE_REPRESENTATIVE,
      queryName: "",
      variables: {
        input: {
          representative: formData,
        },
      },
    });

    console.log("submitted data:", data);
  };

  const onSubmit = async (data) => {
    try {
      const formData = { ...data, client: client.id };
      await createRepresentative(formData); // Wait for API call to complete
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <RepresentativeChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={createFields}
    />
  );
};
