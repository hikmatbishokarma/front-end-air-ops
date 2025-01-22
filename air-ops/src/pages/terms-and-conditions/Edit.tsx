import { RichTextInput } from "ra-input-rich-text"
import { BooleanInput, Edit, SimpleForm } from "react-admin"

export const TermsAndConditionsEdit=()=>{

    return (
        <Edit>
           <SimpleForm> 
            <BooleanInput source="status" label="Status"/>
                       <RichTextInput source="termsAndConditions" label="Terms And Conditions"/>
           </SimpleForm>
        </Edit>
    )
}