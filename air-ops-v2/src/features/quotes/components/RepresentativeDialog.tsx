import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import useGql from "@/lib/graphql/gql";
import { CREATE_REPRESENTATIVE } from "@/lib/graphql/queries/representative";
import { Business } from "@mui/icons-material";

const RepresentativeDialog = ({
  subDialogOpen,
  handleSubDialogClose,
  client,
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const createRepresentative = async (formData) => {
    const data = await useGql({
      query: CREATE_REPRESENTATIVE,
      queryName: "createOneRepresentative",
      queryType: "mutation",
      variables: {
        input: {
          representative: formData,
        },
      },
    });


  };

  const onSubmit = async (data) => {


    const formData = { ...data, client: client.id };

    try {
      await createRepresentative(formData); // Wait for API call to complete
      handleSubDialogClose(); // Close dialog only after the API call
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <Dialog open={subDialogOpen} onClose={handleSubDialogClose}>
      <DialogTitle>
        <Typography variant="subtitle2" color="text.secondary">
          Adding representative for
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Business fontSize="small" color="primary" />
          <Chip
            label={client?.name}
            color="primary"
            variant="outlined"
            size="medium"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField {...field} label="Name" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Phone number must be 10 digits",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Phone"
              fullWidth
              margin="normal"
              type="tel"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Address" fullWidth margin="normal" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepresentativeDialog;
