// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Box,
//   Autocomplete,
//   Alert,
// } from "@mui/material";
// import { GET_ROLES } from "../../lib/graphql/queries/role";
// import useGql from "../../lib/graphql/gql";
// import { CREATE_USER } from "../../lib/graphql/queries/user";

// interface FormData {
//   name: string;
//   email: string;
//   role: string;
// }

// export const UserCreate = ({ setOpen, setIsUserCreate }) => {
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>();

//   const [roles, setRoles] = useState<any>();
//   const [apiError, setApiError] = React.useState("");

//   const CreateUser = async (formData) => {
//     try {
//       const data = await useGql({
//         query: CREATE_USER,
//         queryName: "",
//         queryType: "mutation",
//         variables: { input: { user: formData } },
//       });

//       if (!data || data.errors) {
//         throw new Error(data?.errors?.[0]?.message || "Something went wrong");
//       }
//     } catch (error) {
//       setApiError(error.message);
//     }
//   };

//   const onSubmit = (data: FormData) => {
//     const formattedData = {
//       ...data,
//     };
//     CreateUser(formattedData);
//     <Alert severity="success">User created successfully.</Alert>;
//     setOpen(false);
//     setIsUserCreate(true);
//   };

//   const getRoles = async () => {
//     try {
//       const data = await useGql({
//         query: GET_ROLES,
//         queryName: "roles",
//         queryType: "query",
//         variables: {},
//       });
//       setRoles(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(() => {
//     getRoles();
//   }, []);

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "16px",
//         maxWidth: "400px",
//         margin: "auto",
//       }}
//     >
//       {/* Name Field */}
//       <Controller
//         name="name"
//         control={control}
//         rules={{ required: "Name is required" }}
//         render={({ field }) => (
//           <TextField
//             {...field}
//             size="small"
//             label="Name"
//             fullWidth
//             error={!!errors.name}
//             helperText={errors.name?.message}
//           />
//         )}
//       />

//       {/* Email Field */}
//       <Controller
//         name="email"
//         control={control}
//         rules={{
//           required: "Email is required",
//           pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
//         }}
//         render={({ field }) => (
//           <TextField
//             {...field}
//             size="small"
//             label="Email"
//             fullWidth
//             error={!!errors.email}
//             helperText={errors.email?.message}
//           />
//         )}
//       />

//       <Controller
//         name="role"
//         control={control}
//         render={({ field }) => (
//           <Autocomplete
//             {...field}
//             options={roles}
//             getOptionLabel={(option) => option.name}
//             value={
//               field.value
//                 ? roles.find((aircraft) => aircraft.id === field.value)
//                 : null
//             }
//             onChange={(_, value) => {
//               field.onChange(value ? value.id : "");
//             }}
//             renderInput={(params) => <TextField {...params} size="small" />}
//           />
//         )}
//       />

//       {/* Submit Button */}
//       <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </Box>
//     </form>
//   );
// };

import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useSnackbar } from "../../SnackbarContext";
import { UserFormValues } from "./type";
import useGql from "../../lib/graphql/gql";
import { CREATE_USER } from "../../lib/graphql/queries/user";
import UserChildren from "./children";
import { userFormFields } from "./formFields";
import { GET_ROLES } from "../../lib/graphql/queries/role";
import { RoleType } from "../role/create";
import { useSession } from "../../SessionContext";

const UserCreate = ({ onClose, refreshList }) => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const showSnackbar = useSnackbar();
  const [roleOptions, setRoleOptions] = useState([]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<UserFormValues>();

  const [formFields, setFormFields] = useState<any[]>([]);

  const CreateUser = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_USER,
        queryName: "",
        queryType: "mutation",
        variables: { input: { user: formData } },
      });

      if (!data || data.errors) {
        showSnackbar(data?.errors?.[0]?.message, "error");
      } else showSnackbar("Created Successfully", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to create categories!", "error");
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    const formattedData = {
      ...data,
      operatorId,
    };

    // Handle roles to extract only the ids
    if (formattedData.roles) {
      formattedData.roles = formattedData.roles.map((role: any) => role.id); // Assuming each role has an `id`
    }

    await CreateUser(formattedData);
    await refreshList();
    onClose();
  };

  const getRoles = async () => {
    try {
      const data = await useGql({
        query: GET_ROLES,
        queryName: "roles",
        queryType: "query",
        variables: { filter: { type: { neq: RoleType.SUPER_ADMIN } } },
      });
      // setRoleOptions(data);

      // Update the userFormFields with roles options
      const updatedFields = userFormFields.map((field) => {
        if (field.name === "roles") {
          return { ...field, options: data };
        }
        return field;
      });

      setFormFields(updatedFields);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <div>
      <UserChildren
        control={control}
        onSubmit={handleSubmit(onSubmit)}
        // fields={userFormFields}
        fields={formFields}
      />
    </div>
  );
};

export default UserCreate;
