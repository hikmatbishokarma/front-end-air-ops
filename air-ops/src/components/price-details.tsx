import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface Tax {
  type: string;
  percentage: number | 'NA';
  value: number | 'NA';
}

interface PriceDetailsProps {
  basePrice: number;
  duration: number;
  groundHandlingCharge: number;
  crewBeltingCharge: number;
  miscellaneousCharge: number;
  taxes: string[]; // List of applicable tax types (e.g., CGST, SGST, etc.)
  flightCost: number;
  subTotal: number;
  calculatedTaxes: Tax[]; // Array of detailed tax calculations
  total: number; // Final total including all charges and taxes
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  basePrice,
  duration,
  groundHandlingCharge,
  crewBeltingCharge,
  miscellaneousCharge,
  taxes,
  flightCost,
  subTotal,
  calculatedTaxes,
  total 
}) => {

    
  

  return (
    <Box sx={{ padding: 2, textAlign: 'right', borderRadius: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Price Breakdown
      </Typography>
      <Divider />
      <Typography>Base Price / hour: {basePrice}</Typography>
      <Typography>Total Hours: {duration}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography>Flight Cost: {flightCost}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography>Ground Handling Charges: {groundHandlingCharge}</Typography>
      <Typography>CREW BLT Charges: {crewBeltingCharge}</Typography>
      <Typography>Miscellaneous: {miscellaneousCharge}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography>SubTotal: {subTotal}</Typography>
      <Divider sx={{ my: 1 }} />
      {calculatedTaxes.map((tax, index) => (
        <Typography key={index}>{tax.type} @{tax.percentage}: {tax.value}</Typography>
      ))}
     
      <Divider sx={{ my: 1 }} />
      <Typography variant="h6">Total Cost: {total}</Typography>
      <Divider sx={{ my: 1 }} />
    </Box>
  );
};

export default PriceDetails;
