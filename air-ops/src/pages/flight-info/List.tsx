import { Datagrid, List, TextField,BooleanField, EditButton } from "react-admin"


export const FlightInfoList=()=>{
    return (
        <List>
            <Datagrid bulkActionButtons={false}>
            <TextField source="name" title="Name"/>
            <TextField source="code" title="Code"/>
            <BooleanField source="status" title="Status"/>
            <EditButton/>
            </Datagrid>

        </List>
    )
}