
import { Datagrid, List, TextField,BooleanField, TopToolbar, CreateButton } from "react-admin"

const ListActions = () => {

    return (
        <TopToolbar>
           
           <CreateButton to="/generate-quote"/>
        </TopToolbar>
    );
}

export const QuotationsList=()=>{
    return (
        <List actions={<ListActions/>}>
            <Datagrid bulkActionButtons={false}>
            <TextField source="quotationNumber" title="Quotation No"/>
            <BooleanField source="status" title="Status"/>
          
            </Datagrid>

        </List>
    )
}