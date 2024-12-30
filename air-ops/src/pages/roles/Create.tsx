import { Create, SimpleForm } from 'react-admin';
import { RolesChildren } from './Children';

export const RolesCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <RolesChildren />
      </SimpleForm>
    </Create>
  );
};
