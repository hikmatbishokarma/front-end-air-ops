import { Datagrid, List, TextField,BooleanField } from "react-admin"


export const FlightDetailList=()=>{
    return (
        <List>
            <Datagrid bulkActionButtons={false}>
            <TextField source="name" title="Name"/>
            <TextField source="code" title="Code"/>
            <BooleanField source="status" title="Status"/>
            </Datagrid>

        </List>
    )
}