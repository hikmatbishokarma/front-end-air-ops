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
  CREATE_AIRCRAFT_DETAIL,
  GET_AIRCRAFT,
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

export const AircraftDetailCreate = ({ onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const methods = useForm<AircraftDetailFormData>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      code: "",

      noteText: "",

      specifications: [],
      termsAndConditions: "",
      isActive: true,
      warningImage: null,
      flightImage: null,
      seatLayoutImage: null,
      rangeMapImage: null,
      flightInteriorImages: [],
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = methods;

  const CreateAircraftDetail = async (formData: any) => {
    try {
      const data = await useGql({
        query: CREATE_AIRCRAFT_DETAIL,
        queryName: "createOneAircraftDetail",
        queryType: "mutation",
        variables: { input: { aircraftDetail: formData } },
      });

      if (!data || data.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar(data?.errors?.[0]?.message, "error");
      } else showSnackbar("Created Successfully", "success");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = async (data: AircraftDetailFormData) => {
    const cleanedDetail: any = { ...data };

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

    await CreateAircraftDetail({ ...cleanedDetail, operatorId });
    await refreshList();
    onClose();
  };

  const {
    fields: specificationsField,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const steps = ["Basic", "Specification", "Terms And Condition", "media"];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <StepperFormLayout
        steps={steps}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        // onSubmit={handleSubmit(onSubmit)}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* {activeStep === 0 && <BasicInfoStep control={control} />} */}
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
