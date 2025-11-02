import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import CrewDetailChildren from "../components/Children";
import {
  CrewDetailCreateProps,
  CrewDetailFormValues,
} from "../types/interface";
import { crewDetailFormFields } from "../types/formFields";
import { useCreateCrewDetail } from "../hooks/useCrewMutations";

export const CrewDetailCreate = ({
  onClose,
  refreshList,
}: CrewDetailCreateProps) => {
  const { createCrewDetail, loading } = useCreateCrewDetail();

  const { control, handleSubmit, reset } = useForm<CrewDetailFormValues>({
    defaultValues: {
      certifications: [],
      nominees: [],
    },
  });

  const {
    fields: certificationFields,
    append: addCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields: nomineeFields,
    append: addNominee,
    remove: removeNominee,
  } = useFieldArray({
    control,
    name: "nominees",
  });

  const {
    fields: bankDetailFields,
    append: addbankDetail,
    remove: removeBankDetail,
  } = useFieldArray({
    control,
    name: "bankDetails",
  });

  const onSubmit = async (formValue: CrewDetailFormValues) => {
    try {
      // Data formatting is now handled in the hook
      const result = await createCrewDetail(formValue);

      if (result.success) {
        reset(); // Reset form after successful submission
        refreshList();
        onClose(); // <-- Close dialog after creating
      }
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <CrewDetailChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={crewDetailFormFields}
      certFields={certificationFields}
      addCert={() =>
        addCert({
          name: "",
          licenceNo: "",
          dateOfIssue: "",
          issuedBy: null,
          validTill: "",
        })
      }
      removeCert={removeCert}
      nomineeFields={nomineeFields}
      addNominee={() =>
        addNominee({
          fullName: "",
          gender: "",
          relation: "",
          idProof: null,
          mobileNumber: "",
          alternateContact: "",
          address: "",
          insurance: null,
        })
      }
      removeNominee={removeNominee}
      bankDetailsFields={bankDetailFields}
      addBankDetail={() =>
        addbankDetail({
          accountPayee: "",
          bankName: "",
          accountNumber: "",
          branch: "",
          swiftCode: "",
          ifscCode: "",
          isDefault: false,
        })
      }
      removeBankDetail={removeBankDetail}
    />
  );
};
