import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import useGql from "../../lib/graphql/gql";
import { useSnackbar } from "../../SnackbarContext";

import AirportChildren from "./children";
import {
  GET_AIRPORT_BY_ID,
  UPDATE_AIRPORT,
} from "../../lib/graphql/queries/airports";

type FormData = {
  type: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  openHrs: string;
  closeHrs: string;
  email: string;
  groundHandlersInfo: any[];
  fuelSuppliers: any[];
};

export const AirportEdit = ({ id, onClose, refreshList }) => {
  const showSnackbar = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      type: "",
      name: "",
      iata_code: "",
      icao_code: "",
      city: "",
      openHrs: "",
      closeHrs: "",
      latitude: 0,
      longitude: 0,
      country: "",
      contactNumber: "",
      email: "",
      groundHandlersInfo: [],
      fuelSuppliers: [],
    },
  });

  const [airport, setAirport] = useState<FormData>();

  const fetchAirportById = async (Id) => {
    const response = await useGql({
      query: GET_AIRPORT_BY_ID,
      queryName: "airport",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      setAirport(response);
    }
  };

  useEffect(() => {
    fetchAirportById(id);
  }, [id]);

  useEffect(() => {
    if (airport) {
      setValue("type", airport.type || "");
      setValue("city", airport.city || "");
      setValue("name", airport.name || "");
      setValue("iata_code", airport.iata_code || "");
      setValue("icao_code", airport.icao_code || "");
      setValue("country", airport.country || "");
      setValue("openHrs", airport.openHrs || "");
      setValue("closeHrs", airport.closeHrs || "");
      setValue("latitude", airport.latitude || 0);
      setValue("longitude", airport.longitude || 0);
      setValue("contactNumber", airport.contactNumber || "");
      setValue("email", airport.email || "");
      setValue("groundHandlersInfo", airport.groundHandlersInfo || []);
      setValue("fuelSuppliers", airport.fuelSuppliers || []);
    }
  }, [airport, setValue]);

  const UpdateAirport = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AIRPORT,
        queryName: "",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      if (!data || data.data?.errors) {
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
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      groundHandlersInfo: data?.groundHandlersInfo?.map(
        ({ __typename, ...rest }) => rest
      ),
      fuelSuppliers: data?.fuelSuppliers?.map(
        ({ __typename, ...rest }) => rest
      ),
    };

    UpdateAirport(id, formattedData);
    refreshList();
    onClose();
  };

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

  const editFields = [
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
    { name: "name", label: "Airport Name", xs: 6, required: true },
    { name: "iata_code", label: "IATA Code", xs: 6, required: true },
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

  return (
    <AirportChildren
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      fields={editFields}
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
