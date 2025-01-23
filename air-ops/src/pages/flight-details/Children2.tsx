import { ReactNode } from 'react';

import {
  ArrayInput,
  BooleanInput,
  DateTimeInput,
  NumberInput,
  SelectInput,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin';
import { Box } from '@mui/material';
export const FlightDetailsChildren = (): ReactNode => {
  return (
    <TabbedForm>

      <TabbedForm.Tab label="Basic">
        <BooleanInput source="status" label="Status" />
        {/* Wrap fields in a container for styling */}
        <Box display="flex" gap={2}>
          <TextInput source="tailNo" label="Tail No" />
          <DateTimeInput source="depatureDate" label="Depature Date Time" />
        </Box>
      </TabbedForm.Tab>

      <TabbedForm.Tab label='PMFC(Pre Flight Medical Check)'>
        <ArrayInput source='pfmc'>
          <SimpleFormIterator>
            <Box display="flex" gap={3}>
              <SelectInput
                source='type'
                label='Type'
                choices={[
                  { id: 'PFMC1', name: 'PFMC1' },
                  { id: 'PFMC2', name: 'PFMC2' },
                ]}
              />
              <TextInput source='captain' label='Captain' />
              <TextInput source='coPilot' label='Co-Pilot' />
            </Box>
            <Box display="flex" gap={2}>
              <TextInput source='reservePilot1' label='Reserve Pilot 1' />
              <TextInput source='reservePilot2' label='Reserve Pilot 2' />
            </Box>
            <Box display="flex" gap={3}>
              <TextInput source='engineer' label='Engineer' />
              <TextInput source='cabinCrew' label='CabinCrew' />
              <TextInput source='operations' label='Operations' />
            </Box>
            <Box display="flex" gap={2}>
              <TextInput source='doctorName' label='Doctor Name' />
              <TextInput source='alternateDoctor' label='Alternate Doctor' />
            </Box>
            <Box display="flex" gap={2}>
            <TextInput
              source='report'
              label='Report'
              helperText='here comes url of the report'
            />
            <TextInput
              source='video'
              label='Video'
              helperText='here comes url of the video'
            />
            </Box>
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>

      <TabbedForm.Tab label='Sectors'>
        <ArrayInput source='sectors'>
          <SimpleFormIterator>
            <DateTimeInput source='depatureDate' label='Depature Date Time' />
            <Box display="flex" gap={2}>
            <TextInput source='departure' label='Departure(From)' />
            <TextInput source='arrival' label='Arrival(To)' />
            </Box>
            <Box display="flex" gap={2}>
            <DateTimeInput
              source='etd'
              label='Estimated Time Of Depature(ETD)'
            />
            <DateTimeInput
              source='eta'
              label='Estimated Time Of Arrival(ETA)'
            />
            </Box>
            <Box display="flex" gap={2}>
            <NumberInput source='noOfPax' label='No Of Pax' min={0} max={4} />
            <TextInput
              source='manifest'
              label='Manifest'
              helperText='here comes url of the manifest'
            />
            </Box>
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
      <TabbedForm.Tab label='Fuel'>
        <TextInput source='fuelOnArrival' label='Fuel On Arrival' />
        <TextInput source='fuelOnGage' label='Fuel On Gage' />
        <TextInput source='fuelUpload' label='Fuel Upload' />
        <TextInput
          source='fuelVoucher'
          label='Fuel Voucher'
          helperText='here comes url of the fuel voucher'
        />
      </TabbedForm.Tab>
      <TabbedForm.Tab label='tripkit'>
        <TextInput
          source='flightPlan'
          label='Flight Plan'
          helperText='here comes url of the flight plan'
        />
        <TextInput
          source='weatherBriefing'
          label='Weather Briefing'
          helperText='here comes url of the weather briefing'
        />
        <TextInput
          source='notams'
          label='Notams'
          helperText='here comes url of the notams'
        />
        <TextInput
          source='otherUploads'
          label='Other Uploads'
          helperText='here comes url of the other uploads'
        />
        <TextInput
          source='loadTrimCG'
          label='Load Trim CG'
          helperText='here comes url of the load trim cg'
        />
      </TabbedForm.Tab>
    </TabbedForm>
  );
};
