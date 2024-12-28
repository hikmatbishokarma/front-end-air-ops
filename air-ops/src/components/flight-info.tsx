import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface Specification {
  icon: string;
  name: string;
}

interface FlightInfoProps {
  name: string;
  image: string;
  description: string;
  specifications: Specification[];
}

const FlightInfoStep: React.FC<{ flightInfo: FlightInfoProps }> = ({ flightInfo }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
      {/* Flight Name */}
      <Typography variant="h6">{flightInfo.name}</Typography>

      {/* Flight Image */}
      <Box
        sx={{
          width: '100%',
          height: 200,
          backgroundImage: `url(${flightInfo.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
        }}
      ></Box>

      {/* Flight Description */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: flightInfo.description }} />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Flight Specifications */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {flightInfo.specifications.map((spec, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className={spec.icon}></i> {/* FontAwesome Icon */}
            <Typography>{spec.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FlightInfoStep;
