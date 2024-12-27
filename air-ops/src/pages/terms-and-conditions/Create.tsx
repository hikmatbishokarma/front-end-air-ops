


import { RichTextInput } from "ra-input-rich-text"
import { BooleanInput, Create, SimpleForm } from "react-admin"





export const TermsAndConditionsCreate=()=>{

    return (
        <Create>
           <SimpleForm>
                       <BooleanInput source="status" label="Status"/>
                       <RichTextInput source="termsAndConditions" label="Terms And Conditions"/>
           </SimpleForm>
        </Create>
    )
}