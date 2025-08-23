import React, { useEffect, useState } from "react";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { GET_AIRCRAFT_CATEGORIES } from "../../lib/graphql/queries/aircraft-categories";
import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";
import {
  GET_AIRCRAFT_DETAIL_BY_ID,
  UPDATE_AIRCRAFT_DETAIL,
} from "../../lib/graphql/queries/aircraft-detail";

import {
  IaircraftCategory,
  Isepcification,
} from "../../interfaces/quote.interface";

import { StepperFormLayout } from "../../components/StepperFormLayout";
import {
  BasicInfoStep,
  MediaStep,
  SpecificationStep,
  TermsStep,
} from "./children";
import { useSession } from "../../SessionContext";

type FormData = {
  name: string;
  code: string;
  description: string;
  image: string;
  noteText: string;
  warningText: string;
  // category: any;
  specifications: Isepcification[];
  termsAndConditions: string;
  isActive: boolean;
  warningImage: string;
  flightImages: [string];
  seatLayoutImage: string;
  rangeMapImage: string;
};

export const AircraftDetailEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const methods = useForm<FormData>({});

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const [aircraftDetailData, setAircraftDetailData] = useState<FormData>();
  // const [aircraftCategories, setAircraftCategories] = useState<
  //   IaircraftCategory[]
  // >([]);

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
      // setValue("isActive", aircraftDetailData.isActive || false);
      setValue("name", aircraftDetailData.name || "");
      setValue("code", aircraftDetailData.code || "");
      setValue("description", aircraftDetailData.description || "");
      // setValue("category", aircraftDetailData.category.id || "");
      setValue("specifications", aircraftDetailData.specifications || []);
      setValue(
        "termsAndConditions",
        aircraftDetailData?.termsAndConditions?.replace(/<p><br><\/p>/g, "") ||
          ""
      );
      setValue("noteText", aircraftDetailData.noteText || "");
      setValue("warningText", aircraftDetailData.warningText || "");
      setValue("warningImage", aircraftDetailData.warningImage || "");
      setValue("flightImages", aircraftDetailData.flightImages || null);
      setValue("seatLayoutImage", aircraftDetailData.seatLayoutImage || "");
      setValue("rangeMapImage", aircraftDetailData.rangeMapImage || "");
    }
  }, [aircraftDetailData, setValue]);

  const UpdateAircraftDetail = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AIRCRAFT_DETAIL,
        queryName: "",
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

  const onSubmit = (data: FormData) => {
    const formattedData = {
      ...data,
      operatorId,
    };

    UpdateAircraftDetail(id, formattedData);
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
        {activeStep === 3 && <MediaStep control={control} />}
      </StepperFormLayout>
    </FormProvider>
  );
};
