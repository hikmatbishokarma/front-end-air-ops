// AviationNSOPForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  TextField,
  Grid,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Stack,
  Avatar,
  MenuItem,
  Radio,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import moment from "moment";
import { useSnackbar } from "@/app/providers";
import useGql from "../../../lib/graphql/gql";
import { GET_PASSENGER_DETAILS } from "../../../lib/graphql/queries/passenger-detail";
import { GET_AIRPORT_BY_ICAO } from "../../../lib/graphql/queries/airports";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CountryAutocomplete from "@/components/country-autocomplete";

interface LogoColors {
  primary: string;
  accent: string;
}

const softCard = {
  borderRadius: "20px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.2)",
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(2px)",
};

const sectionTitle = (text: string, icon: any) => (
  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
    <Avatar variant="rounded" sx={{ width: 28, height: 28 }}>
      {icon}
    </Avatar>
    <Typography variant="subtitle1" fontWeight={700}>
      {text}
    </Typography>
  </Stack>
);

export default function PassengerDetails({
  logoColors = { primary: "#0A58CA", accent: "#E11D48" }, // blue & red
  quotation,
  quotationNo,
  onSaveSector = (formData) => { },
  onPreview = (allFormData) => { },
}: {
  // --- Data Props ---
  quotation: any;
  quotationNo: string | undefined;

  // --- Optional Default Props ---
  logoColors?: LogoColors;

  // --- Action Handlers ---
  // Default value is provided in the function body, but the type is the signature
  onSaveSector?: (formData: any) => void;
  onPreview?: (allFormData: any) => void;
}) {
  const showSnackbar = useSnackbar();

  // State to hold the fetched trip data
  const [tripInfo, setTripInfo] = useState<any>(null);
  const [savedSectors, setSavedSectors] = useState({});
  const [allSectorsSaved, setAllSectorsSaved] = useState(false);

  const getPassengerDetails = async (quotation: any, quotationNo: string) => {
    try {
      const result = await useGql({
        query: GET_PASSENGER_DETAILS,
        variables: {
          filter: {
            quotationNo: { eq: quotationNo },
            ...(quotation != null && { quotation: { eq: quotation } }),
          },
        },
        queryName: "passengerDetails",
        queryType: "query",
      });

      if (result?.errors) {
        showSnackbar(
          result?.errors?.[0]?.message || "some thing went wrong",
          "error"
        );
      } else return result[0];
    } catch (error: any) {
      showSnackbar(error?.message || "some thing went wrong", "error");
    }
  };

  const defaultValues = useMemo(() => {
    const makePassenger = () => ({
      name: "",
      gender: "",
      age: 0,
      aadharId: "",
      weight: 0,
      nationality: "India",
      baggageCount: 0,
      baggageWeight: 0,
    });

    const makeMeal = () => ({
      category: "",
      type: "",
      portions: 0,
      item: "",
      instructions: "",
    });

    const makeTravel = () => ({
      category: "",
      type: "",
      seatingCapacity: 0,
      vehicleChoice: "",
      dropAt: "",
    });

    const makeGroundHandler = () => ({
      fullName: "",
      companyName: "",
      contactNumber: "",
      alternateContactNumber: "",
      email: "",
    });

    // Provide a clear structure for TypeScript to infer
    return {
      sectors: [
        {
          source: {
            code: "",
            name: "",
            lat: "",
            long: "",
            city: "",
            country: "",
          },
          destination: {
            code: "",
            name: "",
            lat: "",
            long: "",
            city: "",
            country: "",
          },
          depatureDate: "",
          depatureTime: "",
          arrivalTime: "",
          arrivalDate: "",
          pax: 0,
          flightTime: "",
          passengers: [makePassenger()],
          meals: [makeMeal()],
          travel: makeTravel(),
          sourceGroundHandler: makeGroundHandler(),
          destinationGroundHandler: makeGroundHandler(),
        },
      ],
    };
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  // Use a useEffect hook to fetch data when the component loads or the ID changes
  useEffect(() => {
    const fetchData = async () => {
      if (quotationNo) {
        const data = await getPassengerDetails(quotation, quotationNo);
        if (data) {
          setTripInfo(data); // Set the fetched data to a state variable
          const formattedData = {
            sectors: data.sectors.map((s: any) => ({
              ...s,
              passengers:
                s.passengers?.map((p: any) => ({
                  ...p,
                  nationality: p.nationality || "India",
                })) || [],
              meals: s.meals || [],
              travel: s.travel || {},
              sourceGroundHandler: s.sourceGroundHandler || {},
              destinationGroundHandler: s.destinationGroundHandler || {},
              source: s.source || {}, // Ensure source is an object
              destination: s.destination || {}, // Ensure destination is an object
            })),
          };
          reset(formattedData);
        }
      }
    };
    fetchData();
  }, [quotationNo, reset]);

  const { fields: sectorFields } = useFieldArray({
    control,
    name: "sectors",
  });

  // Keep only one sector expanded at a time
  const [expanded, setExpanded] = useState<number | null>(0);
  const handleAccordionChange =
    (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? index : null);
    };

  // Non-destructive clone helper: fills only empty targets
  const fillIfEmpty = (target: any, source: any) => {
    if (target == null || typeof target !== "object") return source;
    if (Array.isArray(target) && Array.isArray(source)) {
      const out = [...target];
      const max = Math.max(target.length, source.length);
      for (let i = 0; i < max; i++) {
        if (
          target[i] == null ||
          target[i] === "" ||
          (typeof target[i] === "object" && Object.keys(target[i]).length === 0)
        ) {
          out[i] =
            source[i] !== undefined
              ? JSON.parse(JSON.stringify(source[i]))
              : target[i];
        } else if (
          typeof target[i] === "object" &&
          typeof source[i] === "object"
        ) {
          out[i] = fillIfEmpty(target[i], source[i]);
        }
      }
      return out;
    }
    const out = { ...target };
    for (const k of Object.keys(source ?? {})) {
      if (
        out[k] === "" ||
        out[k] == null ||
        (typeof out[k] === "object" &&
          !Array.isArray(out[k]) &&
          Object.keys(out[k]).length === 0)
      ) {
        out[k] =
          source[k] !== undefined
            ? JSON.parse(JSON.stringify(source[k]))
            : undefined;
      } else if (typeof out[k] === "object" && typeof source[k] === "object") {
        out[k] = fillIfEmpty(out[k], source[k]);
      }
    }
    return out;
  };

  // Clone (from Sector 1) → fills only empty fields in target sector
  const cloneFromFirstSector = (targetIndex: number) => {
    const src = getValues(`sectors.0`);
    if (!src) return;

    const tgt = getValues(`sectors.${targetIndex}`);

    // Only clone passengers, meals, travel (never overwrite meta)
    const mergedPassengers = fillIfEmpty(
      tgt.passengers ?? [],
      src.passengers ?? []
    );
    const mergedMeals = fillIfEmpty(tgt.meals ?? [], src.meals ?? []);
    const mergedTravel = fillIfEmpty(tgt.travel ?? {}, src.travel ?? {});

    setValue(`sectors.${targetIndex}.passengers`, mergedPassengers, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`sectors.${targetIndex}.meals`, mergedMeals, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`sectors.${targetIndex}.travel`, mergedTravel, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const saveSector = (sectorIndex: number) => {
    const all = getValues();
    const payload = all.sectors?.[sectorIndex];

    // Create a deep copy to avoid modifying the original form state
    const cleanPayload = JSON.parse(JSON.stringify(payload));

    // Remove __typename from objects
    delete cleanPayload.__typename;

    // Remove __typename from nested objects
    delete cleanPayload.travel.__typename;

    // New: Remove __typename from source and destination
    delete cleanPayload.source.__typename;
    delete cleanPayload.destination.__typename;

    if (cleanPayload.sourceGroundHandler) delete cleanPayload.sourceGroundHandler.__typename;
    if (cleanPayload.destinationGroundHandler) delete cleanPayload.destinationGroundHandler.__typename;

    // Check if passengers exist and remove __typename
    if (cleanPayload.passengers && Array.isArray(cleanPayload.passengers)) {
      cleanPayload.passengers.forEach((p: any) => delete p.__typename);
    }

    // Check if meals exist and remove __typename
    if (cleanPayload.meals && Array.isArray(cleanPayload.meals)) {
      cleanPayload.meals.forEach((m: any) => delete m.__typename);
    }

    onSaveSector({
      where: { quotation, quotationNo },
      data: { sector: cleanPayload },
    });

    // Mark this sector as saved
    setSavedSectors((prev) => ({ ...prev, [sectorIndex]: true }));

    // Check if this is the last sector
    const isLastSector = sectorIndex === sectorFields.length - 1;

    // Close the current accordion and open the next one if it exists
    if (!isLastSector) {
      setExpanded(sectorIndex + 1);
    } else {
      // If it's the last one, close the accordion
      setExpanded(null);
    }
  };

  const sectors = useMemo(() => {
    if (!tripInfo || !tripInfo.sectors) return [];

    return tripInfo.sectors.map((s: any, index: number) => {
      // Combine date and time into moment objects
      const depDateTime = moment(
        `${s.depatureDate ?? ""} ${s.depatureTime ?? ""}`,
        "YYYY-MM-DD HH:mm"
      );
      const arrDateTime = moment(
        `${s.arrivalDate ?? ""} ${s.arrivalTime ?? ""}`,
        "YYYY-MM-DD HH:mm"
      );

      // Calculate duration
      let flightTime = "";
      if (depDateTime.isValid() && arrDateTime.isValid()) {
        const totalMinutes = arrDateTime.diff(depDateTime, "minutes");
        if (totalMinutes >= 0) {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          flightTime = `${hours}h ${minutes}m`;
        }
      }

      // This is a simplified version of the logic from your original defaultValues
      return {
        id: index + 1,
        source: {
          code: "",
          name: "",
          lat: "",
          long: "",
          city: "",
          country: "",
        },
        destination: {
          code: "",
          name: "",
          lat: "",
          long: "",
          city: "",
          country: "",
        },
        depatureDate: s.depatureDate ?? "",
        depatureTime: s.depatureTime ?? "",
        arrivalTime: s.arrivalTime ?? "",
        arrivalDate: s.arrivalDate ?? "",
        pax: s?.paxNumber ?? "",
        flightTime,

        passengers: s.passengers,
        meals: s.meals,
        travel: s.travel,
        sourceGroundHandler: s.sourceGroundHandler,
        destinationGroundHandler: s.destinationGroundHandler,
      };
    });
  }, [tripInfo]);

  // Check if all sectors have been saved to enable the Preview button
  useEffect(() => {
    console.log(
      "sectorrr",
      Object.keys(savedSectors).length === sectorFields.length
    );

    if (Object.keys(savedSectors).length === sectorFields.length) {
      setAllSectorsSaved(true);
    } else {
      setAllSectorsSaved(false);
    }
  }, [savedSectors, sectorFields.length]);

  return (
    <Box
      className="passenger_add_pax"
      sx={{
        p: { xs: 1.5, md: 3 },
        background:
          "linear-gradient(135deg, rgba(10,88,202,0.06), rgba(225,29,72,0.06))",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          ...softCard,
          borderColor: "transparent",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88))",
        }}
      >
        <CardHeader
          className="paasenger_details_point"
          title={
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              flexWrap="wrap"
              useFlexGap
            >
              <FlightTakeoffIcon sx={{ color: logoColors.primary }} className="takeofficon" />
              <Typography variant="h6" fontWeight={800}>
                Passenger,Catering & Travel -{" "}
                {tripInfo?.quotation?.aircraft?.name}
              </Typography>
              <Chip className="chip-details"
                label={tripInfo?.quotation?.aircraft?.code}
                size="small"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  bgcolor: `${logoColors.primary}15`,
                  color: logoColors.primary,
                  borderColor: `${logoColors.primary}40`,
                }}
                variant="outlined"
              />
              <Chip className="chip-details"
                label={quotationNo}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: `${logoColors.accent}15`,
                  color: logoColors.accent,
                  borderColor: `${logoColors.accent}40`,
                }}
                variant="outlined"
              />
            </Stack>
          }
          subheader={
            <Typography
              variant="body2"
              sx={{ opacity: 0.8 }}
              className="passenger_catering"
            >
              Add passenger details, catering, and travel/cab for each sector.
              You can <b>clone</b> details from Sector 1 (fills only empty
              fields).
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 0, pb: 2 }}>
          <form onSubmit={handleSubmit(() => { })} noValidate autoComplete="off">
            <Stack spacing={2.5}>
              {sectorFields.map((sector, sectorIndex) => {
                return (
                  <Accordion
                    key={sector.id}
                    expanded={expanded === sectorIndex}
                    onChange={handleAccordionChange(sectorIndex)}
                    sx={{
                      ...softCard,
                      "&::before": { display: "none" },
                      borderColor: "rgba(0,0,0,0.04)",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        px: 2,
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          gap: 1.5,
                          flexWrap: "wrap",
                        },
                      }}
                    >
                      {/* Sector Badge */}
                      <Chip
                        size="small"
                        label={`Sector ${sectorIndex + 1}`}
                        sx={{
                          fontWeight: 800,
                          letterSpacing: 0.4,
                          bgcolor: `${logoColors.primary}10`,
                          color: logoColors.primary,
                          borderColor: `${logoColors.primary}30`,
                        }}
                        variant="outlined"
                      />
                      {/* Route */}
                      {/* <Controller
                        control={control}
                        // name={`sectors.${sectorIndex}.source`}
                        name={`sectors.${sectorIndex}.source.code`}
                        render={({ field }) => (
                          <Chip
                            label={field.value || "—"}
                            color="default"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        )}
                      /> */}

                      <Controller
                        control={control}
                        name={`sectors.${sectorIndex}.source`}
                        render={({ field }) => {
                          const code = field.value?.code || "—";
                          const name =
                            field.value?.city || field.value?.name || "";

                          return (
                            <>
                              <Typography variant="body2" fontWeight={700}>
                                {code}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {name}
                              </Typography>
                            </>
                          );
                        }}
                      />

                      <Typography
                        component="span"
                        fontWeight={800}
                        sx={{ mx: 0.5 }}
                      >
                        →
                      </Typography>
                      {/* <Controller
                        control={control}
                        // name={`sectors.${sectorIndex}.destination`}
                        name={`sectors.${sectorIndex}.destination.code`}
                        render={({ field }) => (
                          <Chip
                            label={field.value || "—"}
                            color="default"
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        )}
                      /> */}

                      <Controller
                        control={control}
                        name={`sectors.${sectorIndex}.destination`}
                        render={({ field }) => {
                          const code = field.value?.code || "—";
                          const name =
                            field.value?.city || field.value?.name || "";

                          return (
                            <>
                              <Typography variant="body2" fontWeight={700}>
                                {code}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {name}
                              </Typography>
                            </>
                          );
                        }}
                      />

                      <Divider
                        flexItem
                        orientation="vertical"
                        sx={{ mx: 1, display: { xs: "none", md: "block" } }}
                      />
                      {/* Times */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mt: { xs: 1, md: 0 } }}
                      >
                        <Controller
                          control={control}
                          name={`sectors.${sectorIndex}.depatureDate`}
                          render={({ field }) => (
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {field.value
                                ? moment(field.value).format("ddd, MMM D")
                                : "—"}
                            </Typography>
                          )}
                        />

                        <Controller
                          control={control}
                          name={`sectors.${sectorIndex}.depatureTime`}
                          render={({ field }) => (
                            // <Chip
                            //   size="small"
                            //   label={`DEP ${field.value || "--:--"}`}
                            //   sx={{ opacity: 0.8 }}
                            //   variant="outlined"
                            // />

                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {`${field.value || "--:--"}`}
                            </Typography>
                          )}
                        />

                        <Controller
                          control={control}
                          name={`sectors.${sectorIndex}.flightTime`}
                          render={({ field }) => (
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              ------ {`${field.value || "--:--"}`} ------
                            </Typography>
                          )}
                        />

                        <Controller
                          control={control}
                          name={`sectors.${sectorIndex}.arrivalDate`}
                          render={({ field }) => (
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {field.value
                                ? moment(field.value).format("ddd, MMM D")
                                : "—"}
                            </Typography>
                          )}
                        />

                        <Controller
                          control={control}
                          name={`sectors.${sectorIndex}.arrivalTime`}
                          render={({ field }) => (
                            // <Chip
                            //   size="small"
                            //   label={`ARR ${field.value || "--:--"}`}
                            //   sx={{ opacity: 0.8 }}
                            //   variant="outlined"
                            // />

                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              {`${field.value || "--:--"}`}
                            </Typography>
                          )}
                        />
                      </Stack>
                      <Box sx={{ flex: 1 }} />
                      {/* Clone from Sector 1 (available for all sectors > 0) */}
                      {sectorIndex > 0 && (
                        <Tooltip title="Clone from Sector 1 (fills only empty fields)">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              cloneFromFirstSector(sectorIndex);
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 0 }}>
                      {/* Passengers */}
                      <Box sx={{ mt: 1.5 }}>
                        {sectionTitle(
                          "Passengers",
                          <AirlineSeatReclineNormalIcon />
                        )}
                        <PassengerList
                          control={control}
                          sectorIndex={sectorIndex}
                          logoColors={logoColors}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Meals / Catering */}
                      <Box>
                        {sectionTitle("Catering", <RestaurantMenuIcon />)}
                        <MealList
                          control={control}
                          sectorIndex={sectorIndex}
                          logoColors={logoColors}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Travel / Cab */}
                      <Box>
                        {sectionTitle(
                          "Travel / Cab (Airport ⇄ Hotel)",
                          <LocalTaxiIcon />
                        )}
                        <TravelFields
                          control={control}
                          sectorIndex={sectorIndex}
                        />
                      </Box>

                      {/* Ground Handlers (Always visible now) */}
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        {sectionTitle("Ground Handling", <LocalTaxiIcon />)}

                        {/* Source Ground Handler */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1, fontWeight: 600 }}
                          >
                            Departure Handler ({sectorFields[sectorIndex].source?.name}) / {sectorFields[sectorIndex].source?.code}
                          </Typography>
                          <GroundHandlerSelector
                            control={control}
                            sectorIndex={sectorIndex}
                            type="sourceGroundHandler"
                            airportCode={sectorFields[sectorIndex].source?.code}
                            airportName={sectorFields[sectorIndex].source?.name}
                            setValue={setValue} // Passing setValue to update form
                          />
                        </Box>

                        {/* Destination Ground Handler */}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1, fontWeight: 600 }}
                          >
                            Arrival Handler ({sectorFields[sectorIndex].destination?.name}) / {sectorFields[sectorIndex].destination?.code}
                          </Typography>
                          <GroundHandlerSelector
                            control={control}
                            sectorIndex={sectorIndex}
                            type="destinationGroundHandler"
                            airportCode={sectorFields[sectorIndex].destination?.code}
                            airportName={sectorFields[sectorIndex].destination?.name}
                            setValue={setValue} // Passing setValue to update form
                          />
                        </Box>
                      </Box>

                      {/* Save Sector */}
                      <CardActions sx={{ mt: 2, justifyContent: "flex-end" }}>
                        <Button
                          startIcon={<SaveIcon />}
                          variant="contained"
                          onClick={() => saveSector(sectorIndex)}
                          disabled={isSubmitting}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            bgcolor: logoColors.primary,
                            "&:hover": { bgcolor: "#0847a0" },
                          }}
                        >
                          Save Sector {sectorIndex + 1}
                        </Button>
                      </CardActions>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  disabled={!allSectorsSaved}
                  // disabled={true}
                  onClick={() => onPreview(quotationNo)}
                  sx={(theme) => ({
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: allSectorsSaved
                      ? logoColors.accent
                      : theme.palette.action.disabledBackground,
                    "&:hover": {
                      bgcolor: allSectorsSaved
                        ? "#cc1b40"
                        : theme.palette.action.disabledBackground,
                    },
                  })}
                >
                  Save & Preview
                </Button>
              </CardActions>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

function PassengerList({ control, sectorIndex, logoColors }: any) {
  const {
    fields: passengerFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sectors.${sectorIndex}.passengers`,
  });

  const addPassenger = () => {
    append({
      name: "",
      gender: "",
      age: "",
      aadharId: "",
      weight: "",
      nationality: "India",
      baggageCount: "",
      baggageWeight: "",
    });
  };

  return (
    <Stack spacing={1.5}>
      {passengerFields.map((p, i) => (
        <Card
          key={p.id}
          sx={{
            ...softCard,
            px: 2,
            py: 1.5,
            borderLeft: `4px solid ${logoColors.accent}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94))",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={`Passenger ${i + 1}`}
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: `${logoColors.accent}10`,
                color: logoColors.accent,
                borderColor: `${logoColors.accent}40`,
              }}
              variant="outlined"
            />
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Remove passenger">
              <span>
                <IconButton
                  size="small"
                  onClick={() => remove(i)}
                  disabled={passengerFields.length <= 1}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <Grid container spacing={1.5}>
            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.name`}
                rules={{
                  required: "Name is required",
                  minLength: { value: 2, message: "Too short" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2.5}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.gender`}
                rules={{ required: "Required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Gender"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.age`}
                rules={{
                  required: "Required",
                  min: { value: 0, message: "Invalid" },
                  max: { value: 120, message: "Invalid" },
                  pattern: { value: /^[0-9]{1,3}$/, message: "Numbers only" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Age"
                    fullWidth
                    size="small"
                    type="number"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    } // <--- ensures number in state
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3.5}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.aadharId`}
                rules={{
                  required: "Required",
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: "12-digit Aadhar",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Aadhar ID"
                    placeholder="1234 5678 9012"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* Row 2: Weight, Nationality, Baggage */}
            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.weight`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pax Weight (kg)"
                    type="number"
                    fullWidth
                    size="small"
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.nationality`}
                render={({ field }) => (
                  <CountryAutocomplete
                    value={field.value}
                    onChange={(val: any) => field.onChange(val)}
                    label="Nationality"
                    error={false}
                    helperText=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.baggageCount`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="No. of Bags"
                    type="number"
                    fullWidth
                    size="small"
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.passengers.${i}.baggageWeight`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Baggage Weight (kg)"
                    type="number"
                    fullWidth
                    size="small"
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </Card>
      ))}

      <Box>
        <Button
          startIcon={<AddIcon />}
          onClick={addPassenger}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            borderColor: `${logoColors.primary}40`,
          }}
          variant="outlined"
        >
          Add Passenger
        </Button>
      </Box>
    </Stack>
  );
}

function MealList({ control, sectorIndex, logoColors }: any) {
  const {
    fields: mealFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sectors.${sectorIndex}.meals`,
  });

  const addMeal = () => {
    append({
      category: "",
      type: "",
      portions: 0,
      item: "",
      instructions: "",
    });
  };

  return (
    <Stack spacing={1.5}>
      {mealFields.map((m, i) => (
        <Card
          key={m.id}
          sx={{
            ...softCard,
            px: 2,
            py: 1.5,
            borderLeft: `4px solid ${logoColors.primary}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94))",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={`Meal ${i + 1}`}
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: `${logoColors.primary}10`,
                color: logoColors.primary,
                borderColor: `${logoColors.primary}40`,
              }}
              variant="outlined"
            />
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Remove meal row">
              <span>
                <IconButton
                  size="small"
                  onClick={() => remove(i)}
                  disabled={mealFields.length <= 1}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <Grid container spacing={1.5}>
            <Grid item xs={12} md={2.5}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.meals.${i}.category`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category"
                    placeholder="Breakfast / Lunch / Snacks"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.meals.${i}.type`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Type"
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="Veg">Veg</MenuItem>
                    <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                    <MenuItem value="Both">Both</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.meals.${i}.portions`}
                rules={{
                  min: {
                    value: 0,
                    message: "portions must be at least 0",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Portions"
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    } // <--- ensures number in state
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.meals.${i}.item`}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Item"
                    placeholder="Sandwich / Salad / Fruits"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2.5}>
              <Controller
                control={control}
                name={`sectors.${sectorIndex}.meals.${i}.instructions`}
                render={({ field }) => (
                  <TextField
                    className="passenger_insturctions"
                    {...field}
                    label="Instructions"
                    placeholder="Jain / No onion garlic / Spicy"
                    fullWidth
                    size="small"
                    multiline // Add this prop to make it multi-line
                    rows={2} // Optional: Specify the number of visible rows
                  />
                )}
              />
            </Grid>
          </Grid>
        </Card>
      ))}

      <Box>
        <Button
          startIcon={<AddIcon />}
          onClick={addMeal}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            borderColor: `${logoColors.primary}40`,
          }}
          variant="outlined"
        >
          Add Meal
        </Button>
      </Box>
    </Stack>
  );
}

function TravelFields({ control, sectorIndex }: any) {
  return (
    <Grid container spacing={1.5}>
      <Grid item xs={12} md={2.5}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.travel.category`}
          render={({ field }) => (
            <TextField
              {...field}
              label="Category"
              placeholder="Arrival / Departure / Local"
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.travel.type`}
          render={({ field }) => (
            <TextField
              {...field}
              label="Type"
              placeholder="Sedan / SUV / Van"
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.travel.seatingCapacity`}
          rules={{
            min: {
              value: 0,
              message: "portions must be at least 0",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Seating Capacity"
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 0 }}
              onChange={(e) =>
                field.onChange((e.target as HTMLInputElement).valueAsNumber)
              } // <--- ensures number in state
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={2.5}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.travel.vehicleChoice`}
          render={({ field }) => (
            <TextField
              {...field}
              label="Vehicle Choice"
              placeholder="Innova / Crysta / Tempo Traveller"
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.travel.dropAt`}
          render={({ field }) => (
            <TextField
              {...field}
              label="Drop at"
              placeholder="Hotel / FBO / Terminal"
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

// Selector Component that handles both ZZZZ (Manual) and Standard (Dropdown)
function GroundHandlerSelector({ control, sectorIndex, type, airportCode, airportName, setValue }: any) {
  const isPrivate = airportCode === "ZZZZ";
  const [handlers, setHandlers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Use manual fetching properly
  const fetchHandlers = async () => {
    if (!airportCode || isPrivate) return;
    setLoading(true);
    try {
      const result = await useGql({
        query: GET_AIRPORT_BY_ICAO,
        variables: { icao: airportCode },
        queryName: "airportByIcao",
        queryType: "query-without-edge",
      });
      if (result?.groundHandlersInfo) { // result is the data object directly due to query-without-edge
        setHandlers(result.groundHandlersInfo);
      } else {
        setHandlers([]);
      }
    } catch (e) {
      console.error("Failed to fetch handlers", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandlers();
  }, [airportCode]);

  const [selectedHandlerIndex, setSelectedHandlerIndex] = useState<number | null>(null);

  // Watch the current value of the company name to auto-select the card
  const currentCompanyName = useWatch({
    control,
    name: `sectors.${sectorIndex}.${type}.companyName`,
  });

  useEffect(() => {
    if (handlers.length > 0 && currentCompanyName) {
      const idx = handlers.findIndex(h => h.companyName === currentCompanyName);
      if (idx !== -1) {
        setSelectedHandlerIndex(idx);
      }
    }
  }, [handlers, currentCompanyName]);

  const onHandlerSelect = (index: number) => {
    setSelectedHandlerIndex(index);
    const handler = handlers[index];
    if (handler) {
      // Update all fields
      setValue(`sectors.${sectorIndex}.${type}.fullName`, handler.fullName || "");
      setValue(`sectors.${sectorIndex}.${type}.companyName`, handler.companyName || "");
      setValue(`sectors.${sectorIndex}.${type}.contactNumber`, handler.contactNumber || "");
      setValue(`sectors.${sectorIndex}.${type}.alternateContactNumber`, handler.alternateContactNumber || "");
      setValue(`sectors.${sectorIndex}.${type}.email`, handler.email || "");
    }
  };

  // 1. If standard airport and no handlers -> Show Message
  if (!isPrivate && !loading && handlers.length === 0) {
    return (
      <Typography variant="body2" color="error.main" sx={{ fontStyle: 'italic', pl: 1 }}>
        No ground handlers found. Please add ground handler in airports <b>{airportName}</b>.
      </Typography>
    );
  }

  // 2. If standard airport -> Show Horizontal List ONLY (No inputs)
  if (!isPrivate) {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          Select Available Handler:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
          {handlers.map((h, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                p: 1.5,
                minWidth: 280,
                display: "flex",
                alignItems: "flex-start",
                cursor: "pointer",
                bgcolor: selectedHandlerIndex === idx ? "#f0f7ff" : "white",
                borderColor: selectedHandlerIndex === idx ? "primary.main" : "divider",
                transition: "all 0.2s",
              }}
              onClick={() => onHandlerSelect(idx)}
            >
              <Radio
                checked={selectedHandlerIndex === idx}
                size="small"
                sx={{ mt: -0.5, ml: -0.5 }}
              />
              <Box sx={{ ml: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {h.companyName}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  <b>Name:</b> {h.fullName || "N/A"}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  <b>Phone:</b> {h.contactNumber || "N/A"}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  <b>Email:</b> {h.email || "N/A"}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  <b>Alt:</b> {h.alternateContactNumber || "N/A"}
                </Typography>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  // 3. If Private (ZZZZ) -> Show Manual Inputs
  return (
    <Grid container spacing={1.5}>
      <Grid item xs={12} md={3}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.${type}.fullName`}
          render={({ field }) => (
            <TextField
              {...field}
              label={"Full Name"}
              fullWidth
              size="small"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.${type}.contactNumber`}
          rules={{
            required: "Phone is required",
            pattern: {
              value: /^[0-9+\-\s()]*$/,
              message: "Invalid phone format",
            },
            minLength: {
              value: 10,
              message: "Min 10 digits",
            },
            maxLength: {
              value: 15,
              message: "Max 15 digits",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Phone"
              fullWidth
              size="small"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.${type}.alternateContactNumber`}
          rules={{
            pattern: {
              value: /^[0-9+\-\s()]*$/,
              message: "Invalid phone format",
            },
            minLength: {
              value: 7,
              message: "Min 7 digits",
            },
            maxLength: {
              value: 15,
              message: "Max 15 digits",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Alternate Contact No."
              fullWidth
              size="small"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <Controller
          control={control}
          name={`sectors.${sectorIndex}.${type}.email`}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              size="small"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
