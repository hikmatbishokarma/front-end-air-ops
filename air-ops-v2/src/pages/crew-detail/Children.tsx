import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Typography,
} from "@mui/material";
import { Controller, Control, SubmitHandler, useWatch } from "react-hook-form";
import ReactQuill from "react-quill";
import Autocomplete from "@mui/material/Autocomplete";
import CityAutocomplete from "../../components/city-autocomplete";
import { BankDetail, Certification, Nominee } from "./interface";
import FileUpload from "../../components/fileupload";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useGenderOptions } from "../../hooks/useGenderOptions";
import { useMaritalStatusOptions } from "../../hooks/useMaritalStatusOptions";
import { useReligionOptions } from "../../hooks/useReligionOptions";
import { useCountryOptions } from "../../hooks/useCountryOptions";
import { useFormFieldOptions } from "../../hooks/useFormFieldOptions";
import { useDesignationOptions } from "../../hooks/useDesignationOptions";
import useGql from "../../lib/graphql/gql";
import { GET_ROLES } from "../../lib/graphql/queries/role";
import { RoleType } from "../role/create";
import MultiSelectAutoComplete from "../../components/MultiSelectAutoComplete";
import MediaUpload from "../../components/MediaUpload";
import { Add, Delete } from "@mui/icons-material";
interface FormField {
  name: string;
  label: string;
  type?: string;
  xs?: number;
  options?: any[];
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  optionsKey?: string;
}

interface ReusableFormProps {
  control: Control<any>;
  onSubmit: SubmitHandler<any>;
  fields: FormField[];
  certFields: any[];
  addCert: (item: Certification) => void;
  removeCert: (index: number) => void;
  nomineeFields: any[];
  addNominee: (item: Nominee) => void;
  removeNominee: (index: number) => void;
  bankDetailsFields: any[];
  addBankDetail: (item: BankDetail) => void;
  removeBankDetail: (index: number) => void;
}

const CrewDetailChildren: React.FC<ReusableFormProps> = ({
  control,
  onSubmit,
  fields,
  certFields,
  addCert,
  removeCert,
  nomineeFields,
  addNominee,
  removeNominee,
  bankDetailsFields,
  addBankDetail,
  removeBankDetail,
}) => {
  const fieldOptions = useFormFieldOptions();
  const genderOptions = useGenderOptions();
  const designation = useDesignationOptions();
  const [roles, setRoles] = useState<any[]>([]);

  const getRoles = async () => {
    try {
      const data = await useGql({
        query: GET_ROLES,
        queryName: "roles",
        queryType: "query",
        variables: { filter: { type: { neq: RoleType.SUPER_ADMIN } } },
      });
      // setRoleOptions(data);

      setRoles(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <Box
      className="upload-profile-crew"
      component="form"
      onSubmit={onSubmit}
      sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {/* <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Controller
              name="profile"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
                  label="Profile"
                  category="profile"
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <CityAutocomplete {...field} label="Work Location" />
              )}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="designation"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl className="crew-type-v1"
                  fullWidth
                  margin="normal"
                  size="small"
                  error={!!error}
                >
                  <InputLabel  id="type-label">Crew Type</InputLabel>
                  <Select labelId="type-label" label="Crew Type" {...field}>
                    {designation.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>
        </Grid> */}

        <Grid container spacing={1} alignItems="flex-start" sx={{ mb: 3 }}>
          {/* Profile Upload on the left */}
          <Grid item xs={4}>
            <Controller
              name="profile"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onUpload={(url) => field.onChange(url)} // Update form value with uploaded URL
                  // label="Profile"
                  category="profile"
                />
              )}
            />
          </Grid>

          {/* Work Location and Designation stacked on the right */}
          <Grid item xs={8}>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <CityAutocomplete {...field} label="Work Location" />
                  )}
                />
              </Grid>

              <Grid item>
                <Controller
                  name="designation"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!error}
                    >
                      <InputLabel id="type-label">Designation</InputLabel>
                      <Select labelId="type-label" label="Crew Type" {...field}>
                        {designation.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid>
                <Controller
                  name="roles"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <MultiSelectAutoComplete
                      value={field.value || []}
                      onChange={field.onChange}
                      label="Role"
                      options={roles}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(a, b) => a.id === b.id}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <h3>User Details</h3>
        <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          {fields.map((field) => {
            const { name, label, type, required, pattern, optionsKey } = field;

            const options = optionsKey ? fieldOptions[optionsKey] : undefined;

            return (
              <Grid item xs={field.xs || 6} key={field.name}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{
                    required: field.required
                      ? `${field.label} is required`
                      : false,
                    pattern: field.pattern,
                  }}
                  render={({
                    field: controllerField,
                    fieldState: { error },
                  }) => {
                    if (type === "select") {
                      return (
                        <FormControl
                          fullWidth
                          component="fieldset"
                          error={!!error}
                          size="small"
                          variant="outlined"
                        >
                          <InputLabel id={name}>{label}</InputLabel>
                          <Select
                            labelId={name}
                            label={label}
                            {...controllerField}
                          >
                            {options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {error && (
                            <FormHelperText>{error.message}</FormHelperText>
                          )}
                        </FormControl>
                      );
                    } else if (field?.type == "date") {
                      return (
                        <DatePicker
                          {...controllerField}
                          label={field.label}
                          format="DD-MM-YYYY"
                          value={
                            controllerField.value
                              ? moment(controllerField.value)
                              : null
                          }
                          onChange={(newValue) =>
                            controllerField.onChange(newValue)
                          }
                          maxDate={moment()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      );
                    } else
                      return (
                        <TextField
                          {...controllerField}
                          size="small"
                          // label={field.label}
                          label={field.label}
                          fullWidth
                          type={field.type || "text"}
                          error={!!error}
                          helperText={error?.message}
                          InputLabelProps={{
                            shrink: !!controllerField.value,
                          }}
                        />
                      );
                  }}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Certifications */}
        <Grid item xs={12}>
          <h3>Certifications</h3>
          {certFields &&
            certFields.map((item, index) => (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontWeight="bold">
                    Certificate {index + 1}
                  </Typography>
                  <IconButton onClick={() => removeCert(index)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Grid container spacing={2} key={item.id}>
                  <Grid item xs={6}>
                    <Controller
                      name={`certifications.${index}.name`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Name"
                          fullWidth
                          size="small"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name={`certifications.${index}.licenceNo`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Licence No"
                          fullWidth
                          size="small"
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name={`certifications.${index}.dateOfIssue`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          label="Date of Issue"
                          format="DD-MM-YYYY"
                          value={field.value ? moment(field.value) : null}
                          onChange={(newValue) => field.onChange(newValue)}
                          maxDate={moment()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name={`certifications.${index}.validTill`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          label="ValidTill"
                          format="DD-MM-YYYY"
                          value={field.value ? moment(field.value) : null}
                          onChange={(newValue) => field.onChange(newValue)}
                          // minDate={moment()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name={`certifications.${index}.issuedBy`}
                      control={control}
                      render={({ field }) => (
                        // <FileUpload
                        //   size="small"
                        //   category="Issued By"
                        //   accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        //   value={field.value}
                        //   onUpload={(url) => field.onChange(url)}
                        // />

                        <MediaUpload
                          size="medium"
                          label="Issued By"
                          category="Issued By"
                          accept=".pdf,.doc,.docx"
                          value={field.value}
                          onUpload={(url) => field.onChange(url)}
                        />
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
                  <Button color="error" onClick={() => removeCert(index)}>
                    Remove
                  </Button>
                </Grid> */}
                </Grid>
              </>
            ))}

          <IconButton className="ground-handlers"
            onClick={() =>
              addCert({
                name: "",
                licenceNo: "",
                dateOfIssue: "",
                issuedBy: "",
                validTill: "",
              })
            }
          >
            <Add />
          </IconButton>
        </Grid>

        {/* Nominees */}
        <Grid item xs={12}>
          <h3>Nominees</h3>
          {nomineeFields.map((item, index) => (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight="bold">Nominee {index + 1}</Typography>
                <IconButton onClick={() => removeNominee(index)}>
                  <Delete />
                </IconButton>
              </Box>
              <Grid container spacing={2} key={item.id}>
                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.fullName`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.gender`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl
                        fullWidth
                        component="fieldset"
                        error={!!error}
                        size="small"
                        variant="outlined" // ✅ this is needed
                      >
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          label="Gender"
                          {...field}
                        >
                          {genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <FormHelperText>{error.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.relation`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Relation"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.mobileNumber`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mobile Number"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.alternateContact`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Alternate Contact No"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`nominees.${index}.address`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.idProof`}
                    control={control}
                    render={({ field }) => (
                      <MediaUpload
                        label="Id Proof"
                        size="medium"
                        category="idProof"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        value={field.value}
                        onUpload={(url) => field.onChange(url)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`nominees.${index}.insurance`}
                    control={control}
                    render={({ field }) => (
                      <MediaUpload
                        label="Insurance Doc"
                        size="medium"
                        category="idProof"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        value={field.value}
                        onUpload={(url) => field.onChange(url)}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </>
          ))}

          <IconButton className="ground-handlers"
            onClick={() =>
              addNominee({
                fullName: "",
                gender: "",
                relation: "",
                idProof: "",
                mobileNumber: "",
                alternateContact: "",
                address: "",
                insurance: "",
              })
            }
          >
            <Add />
          </IconButton>
        </Grid>
        {/** Bank Details */}
        <Grid item xs={12}>
          <h3>Bank Details</h3>
          {bankDetailsFields.map((item, index) => (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight="bold">
                  Bank Details {index + 1}
                </Typography>
                <IconButton onClick={() => removeBankDetail(index)}>
                  <Delete />
                </IconButton>
              </Box>
              <Grid container spacing={2} key={item.id}>
                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.accountPayee`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Account Payee"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.bankName`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bank Name"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.accountNumber`}
                    control={control}
                    rules={{
                      required: "Account number is required",
                      pattern: {
                        value: /^[0-9]{9,18}$/, // ✅ only digits, length 9–18
                        message: "Account number must be 9–18 digits",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Account Number"
                        fullWidth
                        size="small"
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.branch`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Branch"
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.swiftCode`}
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                        message: "Invalid SWIFT code (8 or 11 characters)",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="SWIFT Code"
                        fullWidth
                        size="small"
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.ifscCode`}
                    control={control}
                    rules={{
                      required: "IFSC code is required",
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC code (e.g., ICIC0001234)",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="IFSC Code"
                        fullWidth
                        size="small"
                        inputProps={{ style: { textTransform: "uppercase" } }} // auto-uppercase
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`bankDetails.${index}.isDefault`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value || false} // ✅ important: Switch uses "checked"
                            onChange={(e) => field.onChange(e.target.checked)} // ✅ map event
                            color="primary"
                          />
                        }
                        label="Default Bank Account"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </>
          ))}

          <IconButton className="ground-handlers"
            onClick={() =>
              addBankDetail({
                accountPayee: "",
                bankName: "",
                accountNumber: "",
                branch: "",
                swiftCode: "",
                ifscCode: "",
                isDefault: false,
              })
            }
          >
            <Add />
          </IconButton>
        </Grid>
      </LocalizationProvider>

      <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CrewDetailChildren;
