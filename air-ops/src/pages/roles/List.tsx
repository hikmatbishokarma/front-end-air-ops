import {
  BooleanField,
  Datagrid,
  EditButton,
  List,
  TextField,
} from 'react-admin';

export const RolesList = () => {
  return (
    <List>
      <Datagrid bulkActionButtons={false}>
        <TextField source='roleType' title='Role Type' />
        <TextField source='name' title='Role Name' />
        <TextField source='description' title='Description' />
        <BooleanField source='status' title='Status' />

        <EditButton />
      </Datagrid>
    </List>
  );
};
