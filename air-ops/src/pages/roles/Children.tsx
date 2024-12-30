import { ReactNode } from 'react';
import { BooleanInput, SelectInput, TextInput } from 'react-admin';

export const RolesChildren = (): ReactNode => {
  return (
    <>
      <BooleanInput source='status' title='Status' />
      <SelectInput
        source='roleType'
        title='Role Type'
        choices={[
          { id: 'ADMIN', name: 'Admin' },
          { id: 'OPERATOR', name: 'Operator' },
        ]}
      />
      <TextInput source='name' title='Role Name' />
      <TextInput source='description' title='Description' />
    </>
  );
};
