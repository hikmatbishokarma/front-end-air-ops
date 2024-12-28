import { ReactNode } from "react"
import { RichTextInput } from "ra-input-rich-text"
import { ArrayInput, BooleanInput, SimpleFormIterator, TabbedForm, TextInput } from "react-admin"


export const FlightInfoChildren=():ReactNode=>{
    return (
       <TabbedForm>
                      <TabbedForm.Tab label="Basic">
                           <BooleanInput source="status" label="Status"/>
                            <TextInput source="name" label="Name"/>
                            <TextInput source ="code" label="Code"/>
                            <TextInput source ="image" label="Image"/>
                            <RichTextInput source="description" label="Description"/>
      
                      </TabbedForm.Tab>
                      <TabbedForm.Tab label="Specifications">
                          <ArrayInput source="specifications">
                              <SimpleFormIterator inline>
                              <TextInput source="icon" label="Icon"/>
                              <TextInput source="name" label="Name"/>
      
                              </SimpleFormIterator>
                          </ArrayInput>
                      </TabbedForm.Tab>
                  </TabbedForm>
    )
}