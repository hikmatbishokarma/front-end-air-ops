

import {
  Datagrid,
  List,
  TextField,
  BooleanField,
  EditButton,
} from 'react-admin';

export const CabinCrewsList = () => {
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
