import React from "react";
import { useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import ClientChildren from "./children";
import { useSession } from "../../SessionContext";
import { useSnackbar } from "../../SnackbarContext";
import { ClientType } from "../../lib/utils";

export const CreateClient = ({ handleSubDialogClose }) => {
  const { session, setSession, loading } = useSession();

  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const createFields = [
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
      pattern: {
        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: "Invalid PAN No",
      },
      required: false,
    },
    {
      name: "gstNo",
      label: "GST No",
      xs: 6,
      pattern: {
        value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        message: "Invalid GST No",
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

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      type: ClientType.PERSON,
    },
  });

  const createClient = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_CLIENT,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            client: formData,
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
      showSnackbar(error.message || "Failed to Add Enquiry From!", "error");
    }
  };

  const onSubmit = async (data) => {
    const { type, ...rest } = data;
    const formData = { ...rest };

    // if (type == "COMPANY") {
    //   formData["isCompany"] = true;
    // } else formData["isPerson"] = true;

    try {
      await createClient({ ...formData, type, operatorId }); // Wait for API call to complete
      reset(); // Reset form after successful submission
      handleSubDialogClose(); // <-- Close dialog after creating
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
      setValue={setValue} // ✅ Pass it down here
      getValues={getValues}
    />
  );
};
