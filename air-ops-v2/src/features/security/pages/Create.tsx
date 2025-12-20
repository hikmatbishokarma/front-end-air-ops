import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "@/lib/graphql/gql";
import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";
import { CREATE_SECURITY } from "@/lib/graphql/queries/security";
import SecurityChildren from "../components/Children";
import { ISecurity, SecurityCreateProps } from "../types/interfaces";
import { securityFormFields } from "../types/formField";

export const SecurityCreate = ({
  onClose,
  refreshList,
}: SecurityCreateProps) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const createSecurity = async (formData: any) => {
    const result = await useGql({
      query: CREATE_SECURITY,
      queryName: "createOneSecurity",
      queryType: "mutation",
      variables: {
        input: {
          security: formData,
        },
      },
    });

    if (result) {
      showSnackbar("Security Created Successfully!", "success");
    } else {
      showSnackbar("Failed to Create Security!", "error");
    }
  };

  const { control, handleSubmit, reset } = useForm<ISecurity>({
    defaultValues: {
      type: "",
      name: "",
      department: "",
      attachment: null,
    },
  });

  const onSubmit = async (data: ISecurity) => {
    try {
      await createSecurity({
        ...data,
        operatorId,
        attachment: data?.attachment?.key,
      }); // Wait for API call to complete
      reset(); // Reset form after successful submission
      refreshList();
      onClose(); // <-- Close dialog after creating
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <SecurityChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={securityFormFields}
    />
  );
};
