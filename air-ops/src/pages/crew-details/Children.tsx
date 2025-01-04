

import { ReactNode } from "react";
import { BooleanInput, SimpleForm, TextInput } from "react-admin";

export const CrewDetailsChildren = (): ReactNode => {

    return (
        <SimpleForm>
            <TextInput source='name' label='Name'/>
            <BooleanInput source="status" label='Status'/>
        </SimpleForm>
    )
}