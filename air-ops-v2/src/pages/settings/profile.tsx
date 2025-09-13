// import {
//   Alert,
//   Snackbar,
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   MenuItem,
//   TextField,
//   Typography,
//   AlertColor,
//   Select,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import useGql from "../../lib/graphql/gql";
// import { GET_USER_BY_ID, UPDATE_USER } from "../../lib/graphql/queries/user";
// import { useSession } from "../../SessionContext";
// import "../main.css";
// import { useSnackbar } from "../../SnackbarContext";
// import CityAutocomplete from "../../components/city-autocomplete";
// import FileUpload from "../../components/fileupload";

// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   pinCode: string;
//   image: string;
//   dob: string;
//   gender: string;
// }

// export const UserProfile = () => {
//   const { session } = useSession();
//   const showSnackbar = useSnackbar();

//   const userId = session?.user?.id;
//   const [userInfo, setUserInfo] = useState<any>();

//   const [imageUrl, setImageUrl] = useState<string>("");

//   const handelOnProfileUpload = async (url: string) => {
//     setImageUrl(url);
//     await updateUserProfile(userId, { image: url });
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     control,
//     reset,
//   } = useForm<FormData>();

//   const userById = async (userId) => {
//     const response = await useGql({
//       query: GET_USER_BY_ID,
//       queryName: "user",
//       queryType: "query-without-edge",
//       variables: { id: userId },
//     });

//     if (response) {
//       setValue("name", response.name);
//       setValue("email", response.email);
//       setValue("phone", response.phone);
//       setValue("dob", response.dob);
//       setValue("gender", response.gender);
//       setValue("address", response.address);
//       setValue("city", response.city);
//       setValue("pinCode", response.pinCode);

//       reset({ gender: response.gender });
//       setUserInfo(response);
//       setImageUrl(response.image);
//     }
//   };

//   useEffect(() => {
//     userById(userId);
//   }, [userId, reset]);

//   const updateUserProfile = async (id, data) => {
//     try {
//       const result = await useGql({
//         query: UPDATE_USER,
//         queryType: "mutation",
//         queryName: "",
//         variables: { input: { id, update: data } },
//       });

//       if (result.data) {
//         showSnackbar("User Info updated successfully!", "success");
//       } else {
//         showSnackbar("Failed to update!", "error");
//       }
//     } catch (error) {
//       showSnackbar(error.message, "error");
//     }
//   };
//   const onSubmit = (data: FormData) => {
//     const formattedData = {
//       ...data,
//       image: imageUrl || "",
//     };
//     updateUserProfile(userId, formattedData);
//   };

//   return (
//     <div
//       className="profile_pge"
//       style={{ display: "flex", justifyContent: "space-between" }}
//     >
//       <div className="leftSide">
//         <Card
//           sx={{ maxWidth: 780, borderRadius: 3, boxShadow: 3, padding: "20px" }}
//         >
//           <h2>General information</h2>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <label htmlFor="Name">Name</label>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   variant="outlined"
//                   {...register("name", { required: "name is required" })}
//                 />
//               </Grid>
//               {/* <Grid item xs={6}>
//               <label htmlFor="Last Name">Last Name</label>
//               <TextField
//                 fullWidth
//                  size="small"
//                 variant="outlined"
//                 {...register("lastName", { required: "Last name is required" })}
//               />
//             </Grid> */}
//               <Grid item xs={6}>
//                 <label htmlFor="Email">Email</label>
//                 <TextField
//                   fullWidth
//                   disabled
//                   size="small"
//                   variant="outlined"
//                   type="email"
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^\S+@\S+\.\S+$/,
//                       message: "Invalid email format",
//                     },
//                   })}
//                   error={!!errors.email}
//                   helperText={errors.email?.message}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <label htmlFor="Phone">Phone</label>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   variant="outlined"
//                   type="tel"
//                   {...register("phone", {
//                     pattern: {
//                       value: /^[0-9]{10}$/,
//                       message: "Invalid phone number",
//                     },
//                   })}
//                   error={!!errors.phone}
//                   helperText={errors.phone?.message}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <label htmlFor="Birthday">Birthday</label>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   variant="outlined"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                   {...register("dob")}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <label htmlFor="Gender">Gender</label>

//                 <Controller
//                   name="gender"
//                   control={control}
//                   render={({ field }) => (
//                     <Select {...field} fullWidth size="small">
//                       <MenuItem value="MALE">Male</MenuItem>
//                       <MenuItem value="FEMALE">Female</MenuItem>
//                       <MenuItem value="OTHER">Other</MenuItem>
//                     </Select>
//                   )}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <h2>Address</h2>
//               </Grid>
//               <Grid item xs={10}>
//                 <label htmlFor="Address">Address</label>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   variant="outlined"
//                   type="address"
//                   {...register("address")}
//                 />
//               </Grid>
//               <Grid item xs={2}>
//                 <label htmlFor="ZIP">ZIP</label>
//                 <TextField
//                   fullWidth
//                   variant="outlined"
//                   size="small"
//                   type="zip"
//                   {...register("pinCode", {
//                     pattern: {
//                       value: /^[0-9]{5,6}$/,
//                       message: "Invalid ZIP code",
//                     },
//                   })}
//                   error={!!errors.pinCode}
//                   helperText={errors.pinCode?.message}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <label htmlFor="City">City</label>
//                 {/* <TextField
//                   fullWidth
//                   variant="outlined"
//                   size="small"
//                   type="city"
//                   {...register("city")}
//                 /> */}
//                 <Controller
//                   name="city"
//                   control={control}
//                   render={({ field }) => (
//                     <CityAutocomplete {...field} label="City" />
//                   )}
//                 />
//               </Grid>
//             </Grid>
//             <Button
//               variant="contained"
//               color="primary"
//               type="submit"
//               style={{ marginTop: "20px" }}
//             >
//               Save All
//             </Button>
//           </form>
//         </Card>
//       </div>
//       <div className="rightSide">
//         <Card
//           sx={{
//             maxWidth: 350,
//             textAlign: "center",
//             borderRadius: 3,
//             boxShadow: 3,
//           }}
//         >
//           <Box
//             sx={{
//               backgroundImage: "url(https://source.unsplash.com/random)",
//               height: 100,
//               backgroundSize: "cover",
//             }}
//           />
//           {/* <Avatar
//             src="https://source.unsplash.com/100x100/?portrait"
//             sx={{
//               width: 80,
//               height: 80,
//               margin: "-40px auto 10px",
//               border: "4px solid white",
//             }}
//           /> */}
//           <FileUpload
//             value={imageUrl}
//             onUpload={(url) => handelOnProfileUpload(url)}
//             label=""
//             category="profile"
//           />
//           <CardContent>
//             <Typography variant="h6" fontWeight="bold">
//               {userInfo?.role?.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {userInfo?.email}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {userInfo?.city}
//             </Typography>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useFormFieldOptions } from "../../hooks/useFormFieldOptions";
import { useGenderOptions } from "../../hooks/useGenderOptions";
import { useDesignationOptions } from "../../hooks/useDesignationOptions";
import useGql from "../../lib/graphql/gql";
import {
  GET_CREW_DETAIL_BY_ID,
  UPDATE_CREW_DETAIL,
} from "../../lib/graphql/queries/crew-detail";
import { CrewDetailFormValues } from "../crew-detail/interface";
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Add, Delete } from "@mui/icons-material";
import FileUpload from "../../components/fileupload";
import MediaUpload from "../../components/MediaUpload";

export const UserProfile = () => {
  const showSnackbar = useSnackbar();

  const { session } = useSession();

  const [crewDetail, setCrewDetail] = useState<
    CrewDetailFormValues | undefined
  >();

  // const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  const [tab, setTab] = useState(0);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm({
    defaultValues: crewDetail || {},
  });

  const {
    fields: nomineeFields,
    append: addNominee,
    remove: removeNominee,
  } = useFieldArray({
    control,
    name: "nominees",
  });

  const {
    fields: certificationFields,
    append: addCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const userId = session?.user?.id;
  const operatorId = session?.user.operator?.id || null;

  const fieldOptions = useFormFieldOptions();
  const genderOptions = useGenderOptions();

  const fetchCreDetailById = async (Id) => {
    const response = await useGql({
      query: GET_CREW_DETAIL_BY_ID,
      queryName: "crewDetail",
      queryType: "query-without-edge",
      variables: { id: Id },
    });

    if (response) {
      // setProfilePicUrl(response.profile || null);
      setCrewDetail(response);
    } else {
      showSnackbar("Failed to Edit Crew Detail!", "error");
    }
  };

  useEffect(() => {
    fetchCreDetailById(userId);
  }, [userId]);

  useEffect(() => {
    if (crewDetail) {
      reset(crewDetail); // ✅ Populate form fields with fetched data
    }
  }, [crewDetail, reset]);

  // const renderField = (name, label, disabled = false) => (
  //   <Grid item xs={12} sm={6} md={4}>
  //     <Controller
  //       name={name}
  //       control={control}
  //       render={({ field }) => (
  //         <TextField
  //           {...field}
  //           label={label}
  //           fullWidth
  //           size="small"
  //           disabled={disabled}
  //           InputLabelProps={{
  //             shrink: !!field.value,
  //           }}
  //         />
  //       )}
  //     />
  //   </Grid>
  // );

  const renderField = (
    name,
    label,
    disabled = false,
    options?: { label: string; value: string }[]
  ) => (
    <Grid item xs={12} sm={6} md={4}>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          options ? (
            <TextField
              {...field}
              select
              label={label}
              fullWidth
              size="small"
              disabled={disabled}
              value={field.value || ""}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              {...field}
              label={label}
              fullWidth
              size="small"
              disabled={disabled}
              InputLabelProps={{ shrink: !!field.value }}
            />
          )
        }
      />
    </Grid>
  );

  const renderDateField = (
    name: keyof CrewDetailFormValues,
    label: string,
    disabled = false
  ) => (
    <Grid item xs={12} sm={6} md={4}>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }} // Optional: add validation
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label={label}
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
                disabled,
              },
            }}
          />
        )}
      />
    </Grid>
  );

  const renderBasicTab = () => (
    <Box p={2}>
      <Grid container spacing={2}>
        {renderField("fullName", "Full Name")}
        {renderField("displayName", "Display Name")}
        {renderField("gender", "Gender", false, genderOptions)}
        {renderDateField("dateOfBirth", "Date of Birth")}
        {renderField("designation", "Designation", true)}
        {renderField("location", "Location")}
        {renderField("phone", "Phone", true)}
        {renderField("email", "Email", true)}
        {renderField("alternateContact", "Alternate Contact")}
        {renderField("education", "Education")}
        {renderField("experience", "Experience")}
        {renderField(
          "martialStatus",
          "Marital Status",
          false,
          fieldOptions.maritalStatus
        )}
        {renderDateField("anniversaryDate", "Anniversary Date")}
        {renderField("religion", "Religion", false, fieldOptions.religion)}
        {renderField("nationality", "Nationality", false, fieldOptions.country)}
        {renderField("aadhar", "Aadhar")}
        {renderField("pan", "PAN")}
        {renderField("passportNo", "Passport No")}
        {renderField("currentAddress", "Current Address")}
        {renderField("permanentAddress", "Permanent Address")}
        {renderField("bloodGroup", "Blood Group")}
      </Grid>
    </Box>
  );

  const renderNomineeTab = () => (
    <Box p={2}>
      {nomineeFields.map((field, index) => (
        <Card key={field.id} sx={{ p: 2, mb: 2 }}>
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
          <Grid container spacing={2} mt={1}>
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
                    <Select labelId="gender-label" label="Gender" {...field}>
                      {genderOptions.map((option) => (
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
            <Grid item xs={6}>
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
                    label="Proof"
                    size="medium"
                    category="idProof"
                    accept=".pdf,.doc,.docx"
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
                    label="Insurance"
                    size="medium"
                    category="idProof"
                    accept=".pdf,.doc,.docx"
                    value={field.value}
                    onUpload={(url) => field.onChange(url)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Card>
      ))}

      <IconButton
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
    </Box>
  );

  const renderCertificateTab = () => (
    <Box p={2}>
      {certificationFields &&
        certificationFields.map((item, index) => (
          <Card key={item.id} sx={{ p: 2, mb: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight="bold">Certificate {index + 1}</Typography>
              <IconButton onClick={() => removeCert(index)}>
                <Delete />
              </IconButton>
            </Box>
            <Grid container spacing={2} key={item.id} mt={1}>
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
              <Grid item xs={4}>
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
            </Grid>
          </Card>
        ))}

      <IconButton
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
    </Box>
  );

  const onSubmit = async (formData) => {
    try {
      let { __typename, certifications, nominees, ...rest } = formData;

      certifications = certifications.map(({ __typename, ...rest }) => rest);
      nominees = nominees.map(({ __typename, ...rest }) => rest);

      const formattedData = {
        ...rest,
        certifications,
        nominees,
        operatorId,
        // profile: profilePicUrl,
      };

      if (formattedData.roles) {
        formattedData.roles = formattedData.roles.map((role: any) => role.id); // Assuming each role has an `id`
      }

      const data = await useGql({
        query: UPDATE_CREW_DETAIL,
        queryName: "updateOneCrewDetail",
        queryType: "mutation",
        variables: { input: { id: userId, update: formattedData } },
      });

      if (!data || data.data?.errors) {
        showSnackbar("Something went wrong", "error");
      } else showSnackbar("Updated successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to edit Crew Detail!", "error");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{ p: 2 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* <MediaUpload
                label="Profile" // You might not want this label to show visually here if space is tight
                category="profile"
                size="small" // Essential for the avatar style
                accept="image/*"
                value={profilePicUrl} // Use the dedicated state for profile picture
                onUpload={setProfilePicUrl} // Update the dedicated state on upload
              /> */}
              +{" "}
              <Controller
                name="profile"
                control={control}
                render={({ field }) => (
                  <MediaUpload
                    label="Profile"
                    category="profile"
                    size="small"
                    accept="image/*"
                    value={field.value}
                    onUpload={(url) => field.onChange(url)}
                  />
                )}
              />
              <Typography variant="h6" fontWeight={600}>
                {crewDetail?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {crewDetail?.roles[0].name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {crewDetail?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {crewDetail?.phone}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List component="nav">
              {["Basic", "Nominee", "Certificate"].map((label, index) => (
                <ListItemButton
                  selected={tab === index}
                  onClick={() => setTab(index)}
                  key={label}
                  sx={{
                    color: tab === index ? "primary.main" : "text.primary",
                    backgroundColor:
                      tab === index ? "rgba(25, 118, 210, 0.1)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        sx={{
                          color:
                            tab === index ? "primary.main" : "text.primary",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} sm={8} md={9}>
          <Card sx={{ p: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {tab === 0 && renderBasicTab()}
              {tab === 1 && renderNomineeTab()}
              {tab === 2 && renderCertificateTab()}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || !isDirty || !isValid} // Disable if submitting, no changes, or form is invalid
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </form>
          </Card>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};
