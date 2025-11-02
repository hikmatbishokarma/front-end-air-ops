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

import useGql from "../../../lib/graphql/gql";
import { useSnackbar } from "@/app/providers";

import AirportChildren from "../components/children";
import {
  GET_AIRPORT_BY_ID,
  UPDATE_AIRPORT,
} from "../../../lib/graphql/queries/airports";

type FormData = {
  type: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city: string;
  country: string;
  state: string;
  latitude: string;
  longitude: string;
  contactNumber: string;
  openHrs: string;
  closeHrs: string;
  email: string;
  elevation: number;
  approaches: string;
  longestPrimaryRunway: string;
  runwaySurface: string;
  airportLightIntensity: string;
  airportOfEntry: string;
  fireCategory: number;
  slotsRequired: string;
  handlingMandatory: string;
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
      latitude: "",
      longitude: "",
      country: "",
      state: "",
      contactNumber: "",
      email: "",
      elevation: 0,
      approaches: "",
      longestPrimaryRunway: "",
      runwaySurface: "",
      airportLightIntensity: "",
      airportOfEntry: "",
      fireCategory: 0,
      slotsRequired: "",
      handlingMandatory: "",
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
      setValue("state", airport.state || "");
      setValue("openHrs", airport.openHrs || "");
      setValue("closeHrs", airport.closeHrs || "");
      setValue("latitude", airport.latitude || "");
      setValue("longitude", airport.longitude || "");
      setValue("contactNumber", airport.contactNumber || "");
      setValue("email", airport.email || "");
      setValue("elevation", airport.elevation || 0);
      setValue("approaches", airport.approaches || "");
      setValue("longestPrimaryRunway", airport.longestPrimaryRunway || "");
      setValue("runwaySurface", airport.runwaySurface || "");
      setValue("airportLightIntensity", airport.airportLightIntensity || "");
      setValue("airportOfEntry", airport.airportOfEntry || "");
      setValue("fireCategory", airport.fireCategory || 0);
      setValue("slotsRequired", airport.slotsRequired || "");
      setValue("handlingMandatory", airport.handlingMandatory || "");
      setValue("groundHandlersInfo", airport.groundHandlersInfo || []);
      setValue("fuelSuppliers", airport.fuelSuppliers || []);
    }
  }, [airport, setValue]);

  const UpdateAirport = async (Id, formData) => {
    try {
      const data = await useGql({
        query: UPDATE_AIRPORT,
        queryName: "updateOneAirport",
        queryType: "mutation",
        variables: { input: { id: Id, update: formData } },
      });

      console.log("data:::", data);

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
        { key: "Civil", value: "Civil" },
        { key: "Heliport", value: "Heliport" },
        { key: "Air Strip", value: "Air Strip" },
        { key: "Joint Civil / Military", value: "Joint Civil / Military" },
        { key: "Military", value: "Military" },
      ],
    },
    { name: "name", label: "Airport Name", xs: 6, required: true },
    { name: "iata_code", label: "IATA Code", xs: 6, required: true },
    { name: "icao_code", label: "ICAO Code", xs: 6, required: true },
    { name: "country", label: "Country", xs: 6, options: [], required: true },
    { name: "state", label: "State", xs: 6, options: [], required: false },
    { name: "city", label: "City", xs: 6, options: [], required: true },
    {
      name: "latitude",
      label: "Latitude",
      xs: 6,
      required: true,
    },
    {
      name: "longitude",
      label: "Longitude",
      xs: 6,
      required: true,
    },
    { name: "openHrs", label: "Open Hrs", xs: 3, required: true, type: "time" },
    {
      name: "closeHrs",
      label: "Close Hrs",
      xs: 3,
      required: true,
      type: "time",
    },
    {
      name: "elevation",
      label: "Elevation",
      xs: 6,
      required: false,
      type: "number",
    },
    {
      name: "approaches",
      label: "Approaches",
      xs: 6,
      required: false,
    },
    {
      name: "longestPrimaryRunway",
      label: "Longest Primary Runway",
      xs: 6,
      required: false,
    },
    {
      name: "runwaySurface",
      label: "Runway Surface",
      xs: 6,
      required: false,
    },
    {
      name: "airportLightIntensity",
      label: "Airport Light Intensity",
      xs: 6,
      required: false,
    },
    {
      name: "airportOfEntry",
      label: "Airport Of Entry",
      xs: 6,
      required: false,
    },
    {
      name: "fireCategory",
      label: "Fire Category",
      xs: 6,
      required: false,
      type: "number",
    },
    {
      name: "slotsRequired",
      label: "Slots Required",
      xs: 6,
      required: false,
    },
    {
      name: "handlingMandatory",
      label: "Handling Mandatory",
      xs: 6,
      required: false,
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
