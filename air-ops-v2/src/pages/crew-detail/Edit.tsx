import React, { useEffect, useState } from "react";
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
  GET_CREW_DETAIL_BY_ID,
  UPDATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { useSnackbar } from "../../SnackbarContext";

export const CrewDetailEdit = ({ id, onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.agent?.id || null;

  const { control, handleSubmit, reset, setValue } =
    useForm<CrewDetailFormValues>({
      defaultValues: {
        designation: "",
        gender: "",
        martialStatus: "",
        religion: "",
        anniversaryDate: "",
        certifications: [],
        nationality: "",
        nominees: [],
      },
    });

  const [crewDetail, setCrewDetail] = useState<CrewDetailFormValues>();

  const fetchCreDetailById = async (Id) => {
    const response = await useGql({
      query: GET_CREW_DETAIL_BY_ID,
      queryName: "crewDetail",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setCrewDetail(response);
    } else {
      showSnackbar("Failed to Edit Crew Detail!", "error");
    }
  };

  useEffect(() => {
    fetchCreDetailById(id);
  }, [id]);

  useEffect(() => {
    if (crewDetail) {
      setValue("roles", crewDetail.roles);
      setValue("profile", crewDetail.profile);
      setValue("fullName", crewDetail.fullName || "");
      setValue("displayName", crewDetail.displayName || "");
      setValue("location", crewDetail.location || "");
      setValue("email", crewDetail.email);
      setValue("martialStatus", crewDetail.martialStatus);
      setValue("anniversaryDate", crewDetail.anniversaryDate);
      setValue("religion", crewDetail.religion);
      setValue("nationality", crewDetail.nationality);
      setValue("mobileNumber", crewDetail?.mobileNumber);
      setValue("aadhar", crewDetail.aadhar || "");
      setValue("pan", crewDetail.pan || "");
      setValue("passportNo", crewDetail.passportNo || "");
      setValue("gender", crewDetail.gender);
      setValue("dateOfBirth", crewDetail.dateOfBirth || "");
      setValue("designation", crewDetail.designation || "");
      setValue("education", crewDetail.education || "");
      setValue("experience", crewDetail.experience || "");
      setValue("alternateContact", crewDetail.alternateContact || "");
      setValue("currentAddress", crewDetail.currentAddress || "");
      setValue("permanentAddress", crewDetail.permanentAddress || "");
      setValue("bloodGroup", crewDetail.bloodGroup || "");
      setValue("certifications", crewDetail.certifications || []);
      setValue("nominees", crewDetail.nominees || []);
    }
  }, [crewDetail, setValue]);

  const updateCrewDetail = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_CREW_DETAIL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to edit Crew Detail!", "error");
    }
  };

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
      let { certifications, nominees, ...rest } = data;

      certifications = certifications.map(({ __typename, ...rest }) => rest);
      nominees = nominees.map(({ __typename, ...rest }) => rest);

      const formattedData = {
        ...rest,
        certifications,
        nominees,
        operatorId,
      };

      if (formattedData.roles) {
        formattedData.roles = formattedData.roles.map((role: any) => role.id); // Assuming each role has an `id`
      }

      await updateCrewDetail(id, formattedData);
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
