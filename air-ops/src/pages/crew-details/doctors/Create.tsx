import { Create } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const DoctorsCreate = () => {
  return (
    <Create redirect="list">
      <CrewDetailsChildren />
    </Create>
  );
};
