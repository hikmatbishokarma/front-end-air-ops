import { Datagrid, List, TextField,BooleanField, EditButton } from "react-admin"


export const FlightDetailsList=()=>{
    return (
        <List>
            <Datagrid bulkActionButtons={false}>
            <TextField source="tailNo" title="Tail No"/>
            <TextField source="depatureDate" title="Depature Date Time"/>
            <BooleanField source="status" title="Status"/>
            <EditButton/>
            </Datagrid>

        </List>
    )
}