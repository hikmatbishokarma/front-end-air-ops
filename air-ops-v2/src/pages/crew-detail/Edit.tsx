import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useGql from "../../lib/graphql/gql";
import { CREATE_CLIENT } from "../../lib/graphql/queries/clients";
import { useSession } from "../../SessionContext";
import CrewDetailChildren from "./Children";
import {
  Certification,
  CrewDetailEditProps,
  CrewDetailFormValues,
  Nominee,
} from "./interface";
import {
  crewDetailFormFields,
  nomineeFormFields,
  certificationFormFields,
} from "./formFields";
import {
  GET_CREW_DETAIL_BY_ID,
  UPDATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { useSnackbar } from "../../SnackbarContext";
import { removeTypename, transformKeyToObject } from "../../lib/utils";

export const CrewDetailEdit = ({
  id,
  onClose,
  refreshList,
}: CrewDetailEditProps) => {
  const { session, setSession, loading } = useSession();
  const showSnackbar = useSnackbar();

  const operatorId = session?.user.operator?.id || null;

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

  const [crewDetail, setCrewDetail] = useState<any>();

  const fetchCreDetailById = async (Id: string | number) => {
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
      setValue("profile", transformKeyToObject(crewDetail.profile));
      setValue("crewId", crewDetail.crewId);
      setValue("fullName", crewDetail.fullName || "");
      setValue("displayName", crewDetail.displayName || "");
      setValue("location", crewDetail.location || "");
      setValue("email", crewDetail.email);
      setValue("martialStatus", crewDetail.martialStatus);
      setValue("anniversaryDate", crewDetail.anniversaryDate);
      setValue("religion", crewDetail.religion);
      setValue("nationality", crewDetail.nationality);
      setValue("phone", crewDetail?.phone);
      setValue("aadhar", crewDetail.aadhar || "");
      setValue("pan", crewDetail.pan || "");
      setValue("pan", crewDetail.gst || "");
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
      setValue(
        "certifications",
        crewDetail.certifications.map((item: any) => ({
          ...item,
          issuedBy: transformKeyToObject(item.issuedBy),
        })) || []
      );
      setValue(
        "nominees",
        crewDetail?.nominees.map((item: any) => ({
          ...item,
          insurance: transformKeyToObject(item.insurance),
          idProof: transformKeyToObject(item.idProof),
        })) || []
      );
      setValue("bankDetails", crewDetail.bankDetails || []);
    }
  }, [crewDetail, setValue]);

  const updateCrewDetail = async (Id: string | number, formData: any) => {
    try {
      const data = await useGql({
        query: UPDATE_CREW_DETAIL,
        queryName: "updateOneCrewDetail",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error: any) {
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

  const {
    fields: bankDetailFields,
    append: addbankDetail,
    remove: removeBankDetail,
  } = useFieldArray({
    control,
    name: "bankDetails",
  });

  const onSubmit = async (data: any) => {
    try {
      let { certifications, nominees, profile, ...rest } = data;

      certifications = certifications.map((item: Certification) => ({
        issuedBy: item?.issuedBy?.key,
      }));
      nominees = nominees.map((item: Nominee) => ({
        ...item,
        idProof: item?.idProof?.key,
        insurance: item?.insurance?.key,
      }));

      const formattedData = removeTypename({
        ...rest,
        certifications,
        nominees,
        operatorId,
        profile: profile?.key,
      });

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
