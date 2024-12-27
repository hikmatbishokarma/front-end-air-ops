import { Datagrid, List,BooleanField, EditButton, RichTextField } from "react-admin"


export const TermsAndConditionsList=()=>{
    return (
        <List>
            <Datagrid bulkActionButtons={false}>
            <RichTextField source="termsAndConditions" title="Terms and Conditions"/>
           
            <BooleanField source="status" title="Status"/>
            <EditButton />
            </Datagrid>

        </List>
    )
}