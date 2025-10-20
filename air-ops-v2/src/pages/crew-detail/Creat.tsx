import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import CrewDetailChildren from "./Children";
import { CrewDetailCreateProps, CrewDetailFormValues } from "./interface";
import {
  crewDetailFormFields,
  nomineeFormFields,
  certificationFormFields,
} from "./formFields";
import {
  CREATE_CREW,
  CREATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { useSnackbar } from "../../SnackbarContext";

export const CrewDetailCreate = ({
  onClose,
  refreshList,
}: CrewDetailCreateProps) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();
  const operatorId = session?.user.operator?.id || null;

  const createCrewDetail = async (formData: any) => {
    const result = await useGql({
      query: CREATE_CREW,
      queryName: "",
      queryType: "mutation",
      variables: {
        input: {
          crew: formData,
        },
      },
    });

    if (!result.data) showSnackbar("Failed to fetch Manual!", "error");
    console.log("submitted data:", result);
  };

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
      let { certifications, nominees, profile, ...rest } = formValue;

      const formattedData = {
        ...rest,
        certifications: certifications.map(({ ...rest }) => ({
          ...rest,
          issuedBy: rest?.issuedBy?.key,
        })),

        nominees: nominees.map(({ ...rest }) => ({
          ...rest,
          idProof: rest?.idProof?.key,
          insurance: rest?.insurance?.key,
        })),
        operatorId,
        profile: profile?.key,
      };

      if (formattedData.roles) {
        formattedData.roles = formattedData.roles.map((role: any) => role.id); // Assuming each role has an `id`
      }

      await createCrewDetail(formattedData); // Wait for API call to complete
      reset(); // Reset form after successful submission
      refreshList();
      onClose(); // <-- Close dialog after creating
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
