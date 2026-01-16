import {
  useState,
  useEffect,
  useCallback,
  Fragment,
  useRef,
  useMemo,
} from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Control, Controller, useFormContext, useWatch } from "react-hook-form";
import { CrewMember, SectorFormValues } from "../../type/trip.type";
import { logoColors } from "@/shared/utils";
import { GET_CREW_DETAILS } from "@/lib/graphql/queries/crew-detail";
import useGql from "@/lib/graphql/gql";
import { useSession } from "@/app/providers";
import { useSnackbar } from "@/app/providers";
import { useDesignationOptions } from "@/hooks/useDesignationOptions";

interface StepCrewProps {
  control: Control<SectorFormValues>;
}

export default function StepCrew({ control }: StepCrewProps) {
  const { setValue, getValues } = useFormContext<SectorFormValues>();
  const assignedCrews = useWatch({ control, name: "assignedCrews" }) || [];
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const operatorId = session?.user?.operator?.id || null;

  // Filter designations to only show: PILOT, CABIN_CREW, ENGINEER, SECURITY, OPERATIONS, CAMO
  // Note: SECURITY and OPERATIONS may not be in useDesignationOptions, so we'll create them if needed
  const allowedDesignationValues = [
    "PILOT",
    "CABIN_CREW",
    "ENGINEER",
    "SECURITY",
    "OPERATIONS",
    "CAMO",
  ];

  // Get designations from hook and add missing ones if needed
  const designationsOptions = useDesignationOptions();

  // Memoize filtered designations to prevent infinite loops
  const designations = useMemo(() => {
    const filtered = designationsOptions.filter((d) =>
      allowedDesignationValues.includes(d.value)
    );

    // Add SECURITY and OPERATIONS if they don't exist in the hook
    const existingValues = filtered.map((d) => d.value);
    if (!existingValues.includes("SECURITY")) {
      filtered.push({ label: "Security", value: "SECURITY" });
    }
    if (!existingValues.includes("OPERATIONS")) {
      filtered.push({ label: "Operations", value: "OPERATIONS" });
    }

    // Sort to match the order requested: PILOT, CABIN_CREW, ENGINEER, SECURITY, OPERATIONS, CAMO
    const order = [
      "PILOT",
      "CABIN_CREW",
      "ENGINEER",
      "SECURITY",
      "OPERATIONS",
      "CAMO",
    ];
    return filtered.sort((a, b) => {
      const indexA = order.indexOf(a.value);
      const indexB = order.indexOf(b.value);
      return indexA - indexB;
    });
  }, [designationsOptions]);

  // Store input values and options for each designation
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [crewOptions, setCrewOptions] = useState<Record<string, CrewMember[]>>(
    {}
  );
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Track which designations have been initially fetched
  const initialFetchDone = useRef<Set<string>>(new Set());
  // Track timeouts for debouncing
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Fetch crew data for a specific designation and search term
  const fetchCrewByDesignation = useCallback(
    async (designation: string, searchTerm: string = "") => {
      const key = designation;
      setLoadingStates((prev) => ({ ...prev, [key]: true }));

      try {
        const filter: any = {
          ...(operatorId && { operatorId: { eq: operatorId } }),
          isActive: { is: true },
          designation: { eq: designation },
        };

        // Add search filter if search term exists
        if (searchTerm) {
          filter.or = [
            { fullName: { iLike: `%${searchTerm}%` } },
            { displayName: { iLike: `%${searchTerm}%` } },
            { email: { iLike: `%${searchTerm}%` } },
          ];
        }

        const result = await useGql({
          query: GET_CREW_DETAILS,
          queryName: "crewDetails",
          queryType: "query-with-count",
          variables: {
            filter,
            paging: {
              offset: 0,
              limit: 50, // Limit results for autocomplete
            },
            sorting: [{ field: "fullName", direction: "ASC" }],
          },
        });

        if (result.data) {
          // Map API response to CrewMember type
          const mappedCrew: CrewMember[] = result.data.map((crew: any) => ({
            id: crew.id,
            name: crew.displayName || crew.fullName || "",
            phone: crew.phone || undefined,
            designation: crew.designation || "",
          }));
          setCrewOptions((prev) => ({ ...prev, [key]: mappedCrew }));
        }
      } catch (error: any) {
        showSnackbar(error.message || "Failed to fetch Crew Details!", "error");
        setCrewOptions((prev) => ({ ...prev, [key]: [] }));
      } finally {
        setLoadingStates((prev) => ({ ...prev, [key]: false }));
      }
    },
    [operatorId, showSnackbar]
  );

  // Initial fetch for each designation (only once on mount)
  useEffect(() => {
    designations.forEach((d) => {
      const designation = d.value;
      if (!initialFetchDone.current.has(designation)) {
        initialFetchDone.current.add(designation);
        fetchCrewByDesignation(designation, "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Debounced search effect - only when inputValues change
  useEffect(() => {
    // Clear all existing timeouts
    Object.values(timeoutsRef.current).forEach((timeout) =>
      clearTimeout(timeout)
    );
    timeoutsRef.current = {};

    // Set up debounced search for each designation that has input
    Object.entries(inputValues).forEach(([designation, searchTerm]) => {
      // Only search if there's actual input (not empty)
      if (searchTerm.trim()) {
        timeoutsRef.current[designation] = setTimeout(() => {
          fetchCrewByDesignation(designation, searchTerm);
        }, 300); // 300ms debounce
      } else {
        // If input is cleared, fetch without search term
        timeoutsRef.current[designation] = setTimeout(() => {
          fetchCrewByDesignation(designation, "");
        }, 300);
      }
    });

    return () => {
      Object.values(timeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
      timeoutsRef.current = {};
    };
  }, [inputValues, fetchCrewByDesignation]);

  const availableDesignations = designations;

  return (
    <Box>
      <Grid container spacing={2}>
        {availableDesignations.map((d, index) => {
          const designation = d.value;
          const availableCrew = crewOptions[designation] || [];
          const isLoading = loadingStates[designation] || false;

          return (
            <Fragment key={`designation-row-${index}`}>
              <Grid item xs={12} sm={4}>
                {/* Designation Display (Read-only) */}
                <Controller
                  name={`assignedCrews.${index}.designation`}
                  control={control}
                  defaultValue={d.value}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Designation"
                      fullWidth
                      margin="normal"
                      size="small"
                      disabled
                      value={d.label}
                      inputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                {/* Crew Multi Select with Search */}
                <Controller
                  name={`assignedCrews.${index}.crews`}
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => {
                    const selectedCrew = availableCrew.filter((c: CrewMember) =>
                      field.value?.includes(c.id)
                    );

                    return (
                      <Autocomplete
                        multiple
                        filterSelectedOptions
                        options={availableCrew}
                        getOptionLabel={(option) => option.name}
                        value={selectedCrew || []}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        loading={isLoading}
                        onInputChange={(_, newInputValue) => {
                          setInputValues((prev) => ({
                            ...prev,
                            [designation]: newInputValue,
                          }));
                        }}
                        onChange={(_, newValue) => {
                          const newIds = newValue.map((c: CrewMember) => c.id);
                          field.onChange(newIds); // save only ids

                          // Sync crewAssignmentDetails for PILOT
                          if (designation === "PILOT") {
                            const currentDetails =
                              getValues(
                                `assignedCrews.${index}.crewAssignmentDetails`
                              ) || [];
                            const newDetails = newIds.map((id) => {
                              const existing = currentDetails.find(
                                (d) => d.crewId === id
                              );
                              return (
                                existing || {
                                  crewId: id,
                                  weight: "",
                                  baggage: "",
                                }
                              );
                            });
                            setValue(
                              `assignedCrews.${index}.crewAssignmentDetails`,
                              newDetails
                            );
                          }
                        }}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              label={option.name}
                              sx={{
                                borderRadius: "9999px",
                                fontWeight: 500,
                                bgcolor: `${logoColors.primary}15`,
                                color: "black",
                                borderColor: `${logoColors.primary}40`,
                              }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={`${d.label} Crew`}
                            margin="normal"
                            size="small"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isLoading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    );
                  }}
                />
              </Grid>
              {designation === "PILOT" &&
                assignedCrews[index]?.crews?.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ pl: 4, mb: 2 }}>
                      {assignedCrews[index].crews.map(
                        (crewId: string, crewIdx: number) => {
                          const crewMember = availableCrew.find(
                            (c) => c.id === crewId
                          );
                          return (
                            <Grid
                              container
                              spacing={2}
                              key={crewId}
                              sx={{ mt: 1 }}
                              alignItems="center"
                            >
                              <Grid item xs={4}>
                                <Typography variant="body2">
                                  {crewMember?.name || "Unknown Crew"}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Controller
                                  name={`assignedCrews.${index}.crewAssignmentDetails.${crewIdx}.weight`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label="Weight"
                                      size="small"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <Controller
                                  name={`assignedCrews.${index}.crewAssignmentDetails.${crewIdx}.baggage`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label="Crew Baggage"
                                      size="small"
                                      fullWidth
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                          );
                        }
                      )}
                    </Box>
                  </Grid>
                )}
            </Fragment>
          );
        })}
      </Grid>
    </Box>
  );
}
