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

interface sepcification {
  title: string;
  value: string;
}

interface AircraftCategory {
  id: string;
  name: string;
}

type FormValues = {
  name: string;
  code: string;
  description: string;
  image: string;
  noteText: string;
  warningText: string;
  category: AircraftCategory | null;
  specifications: sepcification[];
  termsAndConditions: string;
  isActive: boolean;
  warningImage: string;
  flightImages: [string];
  seatLayoutImage: string;
  rangeMapImage: string;
};

export const AircraftDetailCreate = ({ onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  // const methods = useForm<FormValues>({
  //   mode: "onTouched", // or "onSubmit"
  //   reValidateMode: "onChange",
  // });

  // const {
  //   control,
  //   handleSubmit,
  //   watch,
  //   setValue,
  //   setError,
  //   formState: { errors },
  // } = useForm<FormValues>({
  //   defaultValues: {
  //     name: "",
  //     code: "",
  //     description: "",
  //     noteText: "",
  //     warningText: "",
  //     category: {},
  //     specifications: [],
  //     termsAndConditions: "",
  //     isActive: true,
  //     warningImage: "",
  //     flightImages: undefined,
  //     seatLayoutImage: "",
  //     rangeMapImage: "",
  //   },
  // });

  // const [aircraftCategories, setAircraftCategories] = useState<
  //   AircraftCategory[]
  // >([]);

  // const getAircraftCategories = async () => {
  //   try {
  //     const data = await useGql({
  //       query: GET_AIRCRAFT_CATEGORIES,
  //       queryName: "aircraftCategories",
  //       queryType: "query",
  //       variables: {},
  //     });
  //     setAircraftCategories(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   getAircraftCategories();
  // }, []);

  const methods = useForm<FormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      noteText: "",
      warningText: "",
      // category: null,
      specifications: [],
      termsAndConditions: "",
      isActive: true,
      warningImage: "",
      flightImages: undefined,
      seatLayoutImage: "",
      rangeMapImage: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const CreateAircraftDetail = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_AIRCRAFT_DETAIL,
        queryName: "",
        queryType: "mutation",
        variables: { input: { aircraftDetail: formData } },
      });

      if (!data || data.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar(data?.errors?.[0]?.message, "error");
      }
      showSnackbar("Created Successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formattedData = {
      ...data,
      // termsAndConditions: data.termsAndConditions.replace(/<p><br><\/p>/g, ""),
    };

    await CreateAircraftDetail({ ...formattedData, operatorId });
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
        {activeStep === 3 && <MediaStep control={control} />}
      </StepperFormLayout>
    </FormProvider>
  );
};
