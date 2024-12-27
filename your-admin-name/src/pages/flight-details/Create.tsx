import { RichTextInput } from "ra-input-rich-text"
import { ArrayInput, Create, SimpleFormIterator, TabbedForm, TextInput } from "react-admin"



export const FlightDetailsCreate=()=>{

    return (
        <Create>
            <TabbedForm>
                <TabbedForm.Tab label="Basic">
<TextInput source="name" label="Name"/>
<TextInput source ="code" label="Code"/>
<RichTextInput source="description"/>

                </TabbedForm.Tab>
                <TabbedForm.Tab label="Basic">
                    <ArrayInput source="specifications">
                        <SimpleFormIterator inline>
<TextInput source="icon" label="Icon"/>
<TextInput source="name" label="Name"/>
                        </SimpleFormIterator>
                    </ArrayInput>
                </TabbedForm.Tab>
            </TabbedForm>
        </Create>
    )
}
