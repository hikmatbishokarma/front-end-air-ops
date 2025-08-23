import React from "react";
import { useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";

import { CREATE_REPRESENTATIVE } from "../../lib/graphql/queries/representative";
import RepresentativeChildren from "./children";
import { useSnackbar } from "../../SnackbarContext";

export const CreateRepresentative = ({ client, handleDialogClose }) => {
  const showSnackbar = useSnackbar();

  const createFields = [
    { name: "name", label: "Name", xs: 6, required: true },
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
    try {
      const data = await useGql({
        query: CREATE_REPRESENTATIVE,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            representative: formData,
          },
        },
      });

      if (!data || data?.errors) {
        showSnackbar(
          data?.errors?.[0]?.message || "Something went wrong",
          "error"
        );
      } else showSnackbar("Added successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to Add Representative!", "error");
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = { ...data, client: client.id };
      await createRepresentative(formData); // Wait for API call to complete
      reset(); // Reset form after successful submission
      handleDialogClose();
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
