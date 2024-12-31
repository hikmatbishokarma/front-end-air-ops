import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom'; // Import useParams

interface Segment {
  departure: string;
  arrival: string;
  etd: string;
  eta: string;
  noOfPax: number;
}
interface calculatedTaxes {
  type: string;
  percentage: number;
  value: any;
}

interface Price {
  basePrice: number;
  duration: number;
  crewBeltingCharge: number;
  miscellaneousCharge: number;
  groundHandlingCharge: number;
  totalTaxes: number;
  total: number;
  flightCost: number;
  subTotal: number;
  calculatedTaxes: calculatedTaxes[];
}

interface Specification {
  icon: string;
  name: string;
}

interface FlightDetail {
  code: string;
  name: string;
  description: string;
  specifications: Specification[];
  image: string;
}

interface PreviewData {
  segments: Segment[];
  prices: Price;
  flightDetails: FlightDetail[];
}

const PreviewQuotation: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the

  const [previewData, setPreviewData] = useState<PreviewData>({
    segments: [],
    prices: {
      basePrice: 0,
      duration: 0,
      crewBeltingCharge: 0,
      miscellaneousCharge: 0,
      groundHandlingCharge: 0,
      flightCost: 0,
      totalTaxes: 0,
      total: 0,
      subTotal: 0,
      calculatedTaxes: [],
    },
    flightDetails: [],
  });

  const fetchPreview = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/quotations/preview?id=${id}`
      );
      const data = await response.json();
      if (data) {
        setPreviewData({
          segments: data?.segments || [],
          prices: data?.prices || {},
          flightDetails: data?.flightDetails || [],
        });
      }
    } catch (error) {
      console.error('Error fetching preview data:', error);
    }
  };

  useEffect(() => {
    if (id) fetchPreview();
  }, [id]);

//   return (
//     <Grid container spacing={3}>
//       {/* Left Section - Segments */}
//       <Grid item xs={12} md={6}>
//         <Card>
//           <CardContent>
//             <Typography variant='h6' gutterBottom>
//               Segments
//             </Typography>
//             {previewData.segments.map((segment, index) => (
//               <Box key={index} mb={2}>
//                 <Typography variant='body1'>
//                   Departure: {segment.departure}
//                 </Typography>
//                 <Typography variant='body1'>
//                   Arrival: {segment.arrival}
//                 </Typography>
//                 <Typography variant='body1'>
//                   ETD: {new Date(segment.etd).toLocaleString()}
//                 </Typography>
//                 <Typography variant='body1'>
//                   ETA: {new Date(segment.eta).toLocaleString()}
//                 </Typography>
//                 <Typography variant='body1'>
//                   Passengers: {segment.noOfPax}
//                 </Typography>
//               </Box>
//             ))}
//           </CardContent>
//         </Card>
//       </Grid>

    

//       <Box
//         sx={{ padding: 2, textAlign: 'right', borderRadius: 2, maxWidth: 400 }}
//       >
//         <Typography variant='h6' gutterBottom>
//           Price Breakdown
//         </Typography>
//         <Divider />
//         <Typography>
//           Base Price / hour: ₹{previewData.prices.basePrice}
//         </Typography>
//         <Typography>Total Hours: {previewData.prices?.duration}</Typography>
//         <Divider sx={{ my: 1 }} />
//         <Typography>Flight Cost: {previewData.prices?.flightCost}</Typography>
//         <Divider sx={{ my: 1 }} />
//         <Typography>
//           Ground Handling Charges: {previewData.prices?.groundHandlingCharge}
//         </Typography>
//         <Typography>
//           CREW BLT Charges: {previewData.prices?.crewBeltingCharge}
//         </Typography>
//         <Typography>
//           Miscellaneous: {previewData.prices?.miscellaneousCharge}
//         </Typography>
//         <Divider sx={{ my: 1 }} />
//         <Typography>SubTotal: {previewData.prices?.subTotal}</Typography>
//         <Divider sx={{ my: 1 }} />
//         {previewData.prices?.calculatedTaxes.map((tax, index) => (
//           <Typography key={index}>
//             {tax.type} @{tax.percentage}: {tax.value}
//           </Typography>
//         ))}

//         <Divider sx={{ my: 1 }} />
//         <Typography variant='h6'>
//           Total Cost: {previewData.prices?.total}
//         </Typography>
//         <Divider sx={{ my: 1 }} />
//       </Box>

//       {/* Bottom Section - Flight Details */}
//       <Grid item xs={12}>
//         {previewData.flightDetails.map((flight, index) => (
//           <Card key={index} sx={{ mb: 3 }}>
//             <CardContent>
//               <Typography variant='h6' gutterBottom>
//                 Flight Details
//               </Typography>
//               <Typography variant='body1' sx={{ mb: 1 }}>
//                 <strong>Flight Code:</strong> {flight.code} - {flight.name}
//               </Typography>
//               <Box
//                 sx={{
//                   width: '100%',
//                   height: 200,
//                   backgroundImage: `url(${flight.image})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   borderRadius: 2,
//                 }}
//               ></Box>
//               <Typography
//                 variant='body1'
//                 component='div'
//                 dangerouslySetInnerHTML={{ __html: flight.description }}
//               />
//               <Typography variant='body1' sx={{ mb: 1 }}>
//                 <strong>Specifications:</strong>
//               </Typography>
//               {flight.specifications.map((spec, idx) => (
//                 <Box key={idx} display='flex' alignItems='center' mb={1}>
//                   <i className={spec.icon} style={{ marginRight: 8 }} />
//                   <Typography variant='body2'>{spec.name}</Typography>
//                 </Box>
//               ))}
//               <Divider sx={{ my: 2 }} />
//             </CardContent>
//           </Card>
//         ))}
//       </Grid>
//     </Grid>
//   );

return (
    <Grid container spacing={3}  alignItems="flex-start">
      {/* Left Section: Segments and Flight Details */}
      <Grid item xs={12} md={9}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Segments
          </Typography>
          {previewData.segments.map((segment, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  Segment {index + 1}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Departure: {segment.departure}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Arrival: {segment.arrival}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ETD: {new Date(segment.etd).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ETA: {new Date(segment.eta).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Passengers: {segment.noOfPax}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Typography variant="h6" gutterBottom>
            Flight Details
          </Typography>
          {previewData.flightDetails.map((flight, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {flight.code} - {flight.name}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    backgroundImage: `url(${flight.image})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                    backgroundRepeat: 'no-repeat',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="body2"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: flight.description }}
                />
                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                  Specifications:
                </Typography>
                {flight.specifications.map((spec, idx) => (
                  <Box key={idx} display="flex" alignItems="center" mb={1}>
                    <i className={spec.icon} style={{ marginRight: 8 }} />
                    <Typography variant="body2">{spec.name}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>

      {/* Right Section: Pricing */}
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '60%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Price Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>Base Price / hour: ₹{previewData.prices.basePrice}</Typography>
            <Typography>Total Hours: {previewData.prices?.duration}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>Flight Cost: ₹{previewData.prices?.flightCost}</Typography>
            <Typography>Ground Handling: ₹{previewData.prices?.groundHandlingCharge}</Typography>
            <Typography>Crew Charges: ₹{previewData.prices?.crewBeltingCharge}</Typography>
            <Typography>Miscellaneous: ₹{previewData.prices?.miscellaneousCharge}</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>SubTotal: ₹{previewData.prices?.subTotal}</Typography>
            <Divider sx={{ my: 1 }} />
            {previewData.prices.calculatedTaxes.map((tax, index) => (
              <Typography key={index}>
                {tax.type} @{tax.percentage}%: ₹{tax.value}
              </Typography>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Total: ₹{previewData.prices?.total}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PreviewQuotation;
