import { Edit } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const EngineersEdit = () => {
  return (
    <Edit redirect="list">
      <CrewDetailsChildren />
    </Edit>
  );
};
