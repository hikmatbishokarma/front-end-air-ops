import { Edit } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const DoctorsEdit = () => {
  return (
    <Edit redirect="list">
      <CrewDetailsChildren />
    </Edit>
  );
};
