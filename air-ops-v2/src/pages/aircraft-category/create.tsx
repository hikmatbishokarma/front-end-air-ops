import React from 'react'
import { Box, Button, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { Controller, useForm } from 'react-hook-form';
import { CREATE_AIRCRAFT_CATEGORY } from '../../lib/graphql/queries/aircraft-categories';
import useGql from '../../lib/graphql/gql';
import { useSnackbar } from '../../SnackbarContext';


type FormValues = {
   
    name: string;
    isActive:boolean
  };

export const AircraftCategoryCreate=({onClose,refreshList})=>{

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
          name: "",
          isActive: true
        },
      });

      const CreateCategory= async (formData) => {
        try {
          const data = await useGql({
            query: CREATE_AIRCRAFT_CATEGORY,
            queryName: "",
            queryType: "mutation",
            variables: { input: { aircraftCategory: formData } },
          });
    
          if (!data || data.errors) {
            // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
            showSnackbar(data?.errors?.[0]?.message , "error")
          }
          showSnackbar("Created Successfully" , "success")
        } catch (error) {
          showSnackbar(error.message||"Failed to create categories!", "error")
        }
      };
    
      const onSubmit = (data: FormValues) => {
        const formattedData = {
          ...data,
        };
    
        CreateCategory(formattedData);
      };
    

    return (
        <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 900, margin: "auto", mt: 4 }}
      >
        {/* Role Type & Name Fields */}
        <Grid container spacing={1} alignItems="center" sx={{ mb: 3 }}>
          
          <Grid item xs={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} size="small" label="Name" fullWidth />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={4}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                control={<Switch {...field} defaultChecked size="small" />}
                label="isActive" 
              />
              )}
            />
          
        </Grid>
       
        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    )
}