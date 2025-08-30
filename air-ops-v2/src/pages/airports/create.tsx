import React, { useEffect, useState } from "react";

import { Controller, useFieldArray, useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";

import AirportChildren from "./children";
import { CREATE_AIRPORT } from "../../lib/graphql/queries/airports";

type FormValues = {
  type: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city: string;
  latitude: number;
  longitude: number;
  country: string;
  openHrs: string;
  closeHrs: string;
  contactNumber: string;
  email: string;
  groundHandlersInfo: any[];
  fuelSuppliers: any[];
};

export const AirportCreate = ({ onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: "",
      name: "",
      iata_code: "",
      icao_code: "",
      city: "",
      latitude: 0,
      longitude: 0,
      country: "",
      contactNumber: "",
      email: "",
      groundHandlersInfo: [],
      fuelSuppliers: [],
    },
  });

  const {
    fields: groundHandlersInfo,
    append: addGroundHandler,
    remove: removeGroundHandler,
  } = useFieldArray({
    control,
    name: "groundHandlersInfo",
  });

  const {
    fields: fuelSuppliers,
    append: addFuelSupplier,
    remove: removeFuelSupplier,
  } = useFieldArray({
    control,
    name: "fuelSuppliers",
  });

  const createFields = [
    {
      name: "type",
      label: "Airport Type",
      required: true,
      options: [
        { key: "CIVIL", value: "Civil Airport" },
        { key: "HELIPORT", value: "Heliport" },
        { key: "AIR_STRIP", value: "Air Strip" },
        { key: "DEFENCE", value: "Defence Airport" },
      ],
    },
    { name: "name", label: "Airport Name", required: true },
    { name: "iata_code", label: "IATA Code", required: true },
    { name: "icao_code", label: "ICAO Code", xs: 6, required: true },
    { name: "city", label: "City", xs: 6, options: [], required: true },
    { name: "country", label: "Country", xs: 6, required: true },
    { name: "openHrs", label: "Open Hrs", xs: 3, required: true, type: "time" },
    {
      name: "closeHrs",
      label: "Close Hrs",
      xs: 3,
      required: true,
      type: "time",
    },
    {
      name: "latitude",
      label: "Latitude",
      required: true,
    },
    {
      name: "longitude",
      label: "Longitude",
      required: true,
    },
    {
      name: "contactNumber",
      label: "Contact Number",

      pattern: {
        value: /^[0-9]{10}$/,
        message: "Phone number must be 10 digits",
      },
      required: true,
    },
    {
      name: "email",
      label: "Email",

      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
      required: true,
    },
  ];

  const CreateAirport = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_AIRPORT,
        queryName: "createOneAirport",
        queryType: "mutation",
        variables: { input: { airport: formData } },
      });

      if (!data || data?.errors) {
        // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
        showSnackbar(data?.errors?.[0]?.message, "error");
      } else showSnackbar("Created Successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    };

    CreateAirport(formattedData);
    refreshList();
    onClose();
  };

  return (
    <AirportChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={createFields}
      groundHandlerInfoFields={groundHandlersInfo}
      addGroundHandler={() =>
        addGroundHandler({
          fullName: "",
          companyName: "",
          contactNumber: "",
          alternateContactNumber: "",
          email: "",
        })
      }
      removeGroundHandler={removeGroundHandler}
      fuelSuppliersFields={fuelSuppliers}
      addFuelSupplier={() =>
        addFuelSupplier({
          companyName: "",
          contactNumber: "",
          alternateContactNumber: "",
          email: "",
        })
      }
      removeFuelSupplier={removeFuelSupplier}
    />
  );
};
