import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "@/lib/graphql/gql";
import { useSession } from "@/app/providers";
import { CREATE_MANUAL } from "@/lib/graphql/queries/manual";
import { useSnackbar } from "@/app/providers";
import { IManual, ManualCreateProps } from "../types/interfaces";
import ManualChildren from "../components/Children";
import { manualFormFields } from "../types/formField";

export const ManualCreate = ({ onClose, refreshList }: ManualCreateProps) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

  const createManual = async (formData: any) => {
    const result = await useGql({
      query: CREATE_MANUAL,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          manual: formData,
        },
      },
    });

    if (result) {
      showSnackbar("Failed to Create Manual!", "success");
    } else {
      showSnackbar("Failed to Create Manual!", "error");
    }
  };

  const { control, handleSubmit, reset } = useForm<IManual>({
    defaultValues: {
      name: "",
      department: "",
      attachment: null,
    },
  });

  const onSubmit = async (data: IManual) => {
    try {
      await createManual({
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
    <ManualChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={manualFormFields}
    />
  );
};
