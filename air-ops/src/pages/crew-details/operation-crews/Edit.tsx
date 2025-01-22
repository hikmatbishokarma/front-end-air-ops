import { Edit } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const OperationCrewsEdit = () => {
  return (
    <Edit redirect="list">
      <CrewDetailsChildren />
    </Edit>
  );
};
