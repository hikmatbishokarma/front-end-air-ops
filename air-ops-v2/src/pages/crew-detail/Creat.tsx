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

export const CrewDetailCreate = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

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
    const { type, ...rest } = data;
    const formData = { ...rest };
    if (type == "COMPANY") {
      formData["isCompany"] = true;
    } else formData["isPerson"] = true;
    try {
      await createClient({ ...formData, operatorId }); // Wait for API call to complete
      reset(); // Reset form after successful submission
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
      addCert={() => addCert({ certification: "", validTill: "" })}
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
        })
      }
      removeNominee={removeNominee}
    />
  );
};
