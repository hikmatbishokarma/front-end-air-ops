import React, { useEffect, useState } from 'react'
import { Box, Button, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { Controller, useForm } from 'react-hook-form';
import { CREATE_AIRCRAFT_CATEGORY, GET_AIRCRAFT_CATEGORY_BY_ID, UPDATE_AIRCRAFT_CATEGORY } from '../../lib/graphql/queries/aircraft-categories';
import useGql from '../../lib/graphql/gql';
import { useSnackbar } from '../../SnackbarContext';


type FormData = {
    name: string;
    isActive:boolean
  };

export const AircraftCategoryEdit=({id, onClose,refreshList})=>{

      const showSnackbar = useSnackbar();

     const {
        control,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
      } = useForm<FormData>();


      const [categoryData, setCategoryData] = useState<FormData>();

      const fetchCategoryById = async (categoryId) => {
        const response = await useGql({
          query: GET_AIRCRAFT_CATEGORY_BY_ID,
          queryName: "aircraftCategory",
          queryType: "query-without-edge",
          variables: { id: categoryId },
        });
    
        if (response) {
          setCategoryData(response);
        }
      };
    
      useEffect(() => {
        fetchCategoryById(id);
      }, [id]);
    
       useEffect(() => {
          if (categoryData) {
            setValue("isActive", categoryData.isActive || false);
            setValue("name", categoryData.name || "");
          }
        }, [categoryData, setValue]);

      const UpdateCategory= async (categoryId,formData) => {
        try {
          const data = await useGql({
            query: UPDATE_AIRCRAFT_CATEGORY,
            queryName: "",
            queryType: "mutation",
            variables: { input: {id:categoryId, update: formData } },
          });
    
          if (!data || data.data?.errors) {
            // throw new Error(data?.errors?.[0]?.message || "Something went wrong");
            showSnackbar("Something went wrong" , "error")
          }
          else showSnackbar("Updated successfully" , "success")
          refreshList();
          onClose();
    
        } catch (error) {
          showSnackbar(error.message||"Failed to create categories!", "error")
        }
      };
    
      const onSubmit = (data: FormData) => {
        const formattedData = {
          ...data,
        };
    
        UpdateCategory(id,formattedData);
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
        <Grid item xs={6}>
            <Controller
              name="name"
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