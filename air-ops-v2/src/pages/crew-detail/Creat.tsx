import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import CrewDetailChildren from "./Children";
import { CrewDetailFormValues } from "./interface";
import {
  crewDetailFormFields,
  nomineeFormFields,
  certificationFormFields,
} from "./FormFields";
import {
  CREATE_CREW,
  CREATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { useSnackbar } from "../../SnackbarContext";

export const CrewDetailCreate = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();
  const operatorId = session?.user.operator?.id || null;

  const createCrewDetail = async (formData) => {
    // const data = await useGql({
    //   query: CREATE_CREW_DETAIL,
    //   queryName: "",
    //   queryType: "mutation",
    //   variables: {
    //     input: {
    //       crewDetail: formData,
    //     },
    //   },
    // });

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

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        operatorId,
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
          issuedBy: "",
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
          idProof: "",
          mobileNumber: "",
          alternateContact: "",
          address: "",
          insurance: "",
        })
      }
      removeNominee={removeNominee}
    />
  );
};
