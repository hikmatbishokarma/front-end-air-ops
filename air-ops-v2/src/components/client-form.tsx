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
} from "@mui/material";
import useGql from "../lib/graphql/gql";
import { CREATE_CLIENT } from "../lib/graphql/queries/clients";

const RequestedByDialog = ({ subDialogOpen, handleSubDialogClose }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      type: "",
    },
  });

  const createClient = async (formData) => {
    const data = await useGql({
      query: CREATE_CLIENT,
      queryName: "clients",
      variables: {
        input: {
          client: formData,
        },
      },
    });

    console.log("submitted data:", data);
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    const { type, ...rest } = data;
    const formData = { ...rest };
    if (type == "COMPANY") {
      formData["isCompany"] = true;
    } else formData["isPerson"] = true;
    try {
      await createClient(formData); // Wait for API call to complete
      handleSubDialogClose(); // Close dialog only after the API call
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle error if necessary
    }
  };

  return (
    <Dialog open={subDialogOpen} onClose={handleSubDialogClose}>
      <DialogTitle>Add Requested By Details</DialogTitle>
      <DialogContent>
      <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Select Type</FormLabel>
              <RadioGroup
                {...field}
                row // Makes the radio buttons appear in a row
              >
                <FormControlLabel
                  value="COMPANY"
                  control={<Radio />}
                  label="Company"
                />
                <FormControlLabel
                  value="PERSON"
                  control={<Radio />}
                  label="Person"
                />
              </RadioGroup>
            </FormControl>
          )}
        />
        
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
          rules={{ required: "Phone number is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone"
              fullWidth
              margin="normal"
              type="tel"
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
          render={({ field }) => (
            <TextField {...field} label="Email" fullWidth margin="normal" />
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

export default RequestedByDialog;
