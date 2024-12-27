import { Datagrid, List, TextField,BooleanField, EditButton } from "react-admin"


export const PriceList=()=>{
    return (
        <List>
            <Datagrid bulkActionButtons={false}>
            <TextField source="basePrice" title="Base Price"/>
            <TextField source="duration" title="Duration"/>
            <BooleanField source="status" title="Status"/>
            <EditButton />
            </Datagrid>

        </List>
    )
}