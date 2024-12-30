import {
  Datagrid,
  List,
  TextField,
  NumberField,
  EditButton,
} from 'react-admin';
import QuotationWorkflowField from './TransitionsWorkflow/QuotationWorkflowField';

// const ListActions = () => {

//     return (
//         <TopToolbar>

//            <CreateButton to="/generate-quote"/>
//         </TopToolbar>
//     );
// }

export const QuotationsList = () => {
  return (
    <List actions={false} filter={{ isLatest: true }}>
      <Datagrid bulkActionButtons={false} rowClick={false}>
        <TextField source='code' title='Quotation No' />
        <QuotationWorkflowField source='state' />
        {/* <TextField source='state' title='State' /> */}
        <NumberField source='version' title='Version' />
        <EditButton />
      </Datagrid>
    </List>
  );
};
