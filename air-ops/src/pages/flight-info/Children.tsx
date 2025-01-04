import { ReactNode } from 'react';
import { RichTextInput } from 'ra-input-rich-text';
import {
  ArrayInput,
  BooleanInput,
  ImageField,
  ImageInput,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin';

export const FlightInfoChildren = (): ReactNode => {
  return (
    <TabbedForm>
      <TabbedForm.Tab label='Basic'>
        <BooleanInput source='status' label='Status' />
        <TextInput source='name' label='Name' />
        <TextInput source='code' label='Code' />
        {/* <TextInput source='image' label='Image' /> */}
        <ImageInput source="pictures" label="Related pictures" multiple>
         <ImageField source="src" title="title" />
        </ImageInput>
        <RichTextInput source='description' label='Description' />
      </TabbedForm.Tab>
      <TabbedForm.Tab label='Specifications'>
        <ArrayInput source='specifications'>
          <SimpleFormIterator inline>
            <TextInput source='icon' label='Icon' />
            <TextInput source='name' label='Name' />
          </SimpleFormIterator>
        </ArrayInput>
      </TabbedForm.Tab>
      <TabbedForm.Tab label='Terms And Conditions'>
        <RichTextInput
          source='termsAndConditions'
          label='Terms And Conditions'
        />
      </TabbedForm.Tab>
    </TabbedForm>
  );
};
