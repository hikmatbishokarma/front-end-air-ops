

import {
  Datagrid,
  List,
  TextField,
  BooleanField,
  EditButton,
} from 'react-admin';

export const OperationCrewsList = () => {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source='name' title='Name' />
        <BooleanField source='status' title='Status' />
        <EditButton />
      </Datagrid>
    </List>
  );
};
