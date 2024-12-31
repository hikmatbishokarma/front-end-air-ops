import { ReactNode } from 'react';

import {
  ArrayInput,
  AutocompleteInput,
  CheckboxGroupInput,
  DateTimeInput,
  NumberInput,
  ReferenceInput,
  required,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin';

export const QuotationsChildren = (): ReactNode => {
  const filterToQuery = (searchText: string) =>
    searchText ? { code: { $regex: searchText, $options: 'i' } } : {};
  return (
    <TabbedForm>
      <TabbedForm.Tab label='Basic'>
        <ArrayInput source='segments' defaultValue={[{}]}>
          <SimpleFormIterator>
            <TextInput
              validate={[required()]}
              source='departure'
              label='Departure(From)'
            />
            <TextInput
              validate={[required()]}
              source='arrival'
              label='Arrival(To)'
            />
            <DateTimeInput
              validate={[required()]}
              source='etd'
              label='Estimated Time Of Depature(ETD)'
            />
            <DateTimeInput
              validate={[required()]}
              source='eta'
              label='Estimated Time Of Arrival(ETA)'
            />
            <NumberInput
              validate={[required()]}
              source='noOfPax'
              label='No Of Pax'
              min={0}
              max={4}
            />
            {/* <TextInput
              validate={[required()]}
              source='flight'
              label='Select Flight'
            /> */}
            <ReferenceInput source='flight' reference='flight-info'>
              {' '}
              <AutocompleteInput
                filterToQuery={filterToQuery}
                label='Select Flight'
                optionText={'code'}
              />
            </ReferenceInput>
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
      <TabbedForm.Tab label='Prices'>
        <NumberInput
          validate={[required()]}
          min={0}
          source='prices.basePrice'
          label='Base Price'
        />
        <NumberInput
          validate={[required()]}
          min={0}
          source='prices.duration'
          label='Duration'
        />
        <NumberInput
          validate={[required()]}
          min={0}
          source='prices.groundHandlingCharge'
          label='Ground Handling Charge'
        />
        <NumberInput
          validate={[required()]}
          min={0}
          source='prices.crewBeltingCharge'
          label='Crew Belting Charge'
        />
        <NumberInput
          validate={[required()]}
          min={0}
          source='prices.miscellaneousCharge'
          label='Miscellaneous Charge'
        />
        <CheckboxGroupInput
          source='prices.taxes'
          label='Taxes'
          choices={[
            { id: 'SGST', name: 'SGST' },
            { id: 'CGST', name: 'CGST' },
            { id: 'IGST', name: 'IGST' },
          ]}
        />
      </TabbedForm.Tab>
    </TabbedForm>
  );
};
