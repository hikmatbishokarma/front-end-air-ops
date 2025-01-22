import { Edit } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const CabinCrewsEdit = () => {
  return (
    <Edit redirect="list">
      <CrewDetailsChildren />
    </Edit>
  );
};
