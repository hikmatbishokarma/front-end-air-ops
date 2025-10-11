import React, { useEffect, useState } from "react";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  GET_AIRCRAFT_DETAIL_BY_ID,
  UPDATE_AIRCRAFT_DETAIL,
} from "../../lib/graphql/queries/aircraft-detail";

import { StepperFormLayout } from "../../components/StepperFormLayout";
import {
  BasicInfoStep,
  MediaStep,
  SpecificationStep,
  TermsStep,
} from "./children";
import { useSession } from "../../SessionContext";
import { AircraftDetailFormData, FileObject } from "./interface";

const cloudfrontBaseUrl =
  import.meta.env.VITE_CLOUDFRONT_BASE_URL || "http://localhost:3000/"; // Ensure it ends with a slash if needed

// 2. Helper function to transform a single S3 key string into the RHF object
const transformKeyToObject = (
  key: string | null | undefined
): FileObject | null => {
  if (key) {
    return {
      key: key,
      url: `${cloudfrontBaseUrl}${key}`,
    };
  }
  return null;
};

// 3. Helper function to transform an array of S3 keys into an array of RHF objects
const transformKeysArray = (
  keysArray: string[] | null | undefined
): FileObject[] => {
  if (Array.isArray(keysArray)) {
    return keysArray
      .map((key) => transformKeyToObject(key))
      .filter((obj) => obj !== null) as FileObject[];
  }
  return [];
};

export const AircraftDetailEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const methods = useForm<AircraftDetailFormData>({});

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = methods;

  const [aircraftDetailData, setAircraftDetailData] = useState<any>();

  const {
    fields: specificationsField,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const fetchAircraftDetailById = async (Id) => {
    const response = await useGql({
      query: GET_AIRCRAFT_DETAIL_BY_ID,
      queryName: "aircraftDetail",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setAircraftDetailData(response);
    }
  };

  useEffect(() => {
    fetchAircraftDetailById(id);
  }, [id]);

  useEffect(() => {
    if (aircraftDetailData) {
      setValue("name", aircraftDetailData.name || "");
      setValue("code", aircraftDetailData.code || "");

      setValue("specifications", aircraftDetailData.specifications || []);
      setValue(
        "termsAndConditions",
        aircraftDetailData?.termsAndConditions?.replace(/<p><br><\/p>/g, "") ||
          ""
      );
      setValue("noteText", aircraftDetailData.noteText || "");

      setValue(
        "warningImage",
        transformKeyToObject(aircraftDetailData.warningImage)
      );
      setValue(
        "flightImage",
        transformKeyToObject(aircraftDetailData.flightImage)
      );
      setValue(
        "seatLayoutImage",
        transformKeyToObject(aircraftDetailData.seatLayoutImage)
      );
      setValue(
        "flightInteriorImages",
        transformKeysArray(aircraftDetailData.flightInteriorImages || [])
      );
    }
  }, [aircraftDetailData, setValue]);

  const UpdateAircraftDetail = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AIRCRAFT_DETAIL,
        queryName: "updateOneAircraftDetail",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
      refreshList();
      onClose();
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: AircraftDetailFormData) => {
    const cleanedDetail: any = { ...data, operatorId };

    const singleImageFields: (keyof AircraftDetailFormData)[] = [
      "flightImage",
      "warningImage",
      "seatLayoutImage",
      "rangeMapImage",
    ];

    singleImageFields.forEach((field) => {
      const value = cleanedDetail[field] as FileObject | null | undefined;

      if (typeof value === "object" && value && value.key) {
        cleanedDetail[field] = value.key;
      } else if (value === null || value === undefined) {
        // Delete property if it was null, undefined, or an empty string from RHF state
        delete cleanedDetail[field];
      }
    });

    // 2. Handle Multi-Image Array Fields (Now includes flightImages)
    const multiImageFields: (keyof AircraftDetailFormData)[] = [
      "flightInteriorImages",
    ];

    multiImageFields.forEach((field) => {
      const value = cleanedDetail[field];

      if (Array.isArray(value)) {
        // ⭐️ FIX 3: Explicitly cast value to S3FileObject[] to resolve array assignment issues
        const imageArray = value as FileObject[];

        const finalKeys = imageArray
          .map((img) => img.key)
          .filter((key) => !!key);

        if (finalKeys.length > 0) {
          cleanedDetail[field] = finalKeys; // Assigning string[] to the property
        } else {
          delete cleanedDetail[field];
        }
      } else {
        delete cleanedDetail[field];
      }
    });

    UpdateAircraftDetail(id, cleanedDetail);
    refreshList();
    onClose();
  };

  const steps = ["Basic", "Specification", "Terms And Condition", "media"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  return (
    <FormProvider {...methods}>
      <StepperFormLayout
        steps={steps}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        onSubmit={handleSubmit(onSubmit)}
      >
        {activeStep === 0 && <BasicInfoStep control={control} />}
        {activeStep === 1 && (
          <SpecificationStep
            control={control}
            specificationsField={specificationsField}
            removeSpecification={removeSpecification}
            appendSpecification={appendSpecification}
          />
        )}
        {activeStep === 2 && <TermsStep control={control} />}
        {activeStep === 3 && (
          <MediaStep
            control={control}
            setValue={setValue}
            getValues={getValues}
          />
        )}
      </StepperFormLayout>
    </FormProvider>
  );
};
