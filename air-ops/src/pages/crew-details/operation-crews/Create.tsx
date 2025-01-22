import { Create } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const OperationCrewsCreate = () => {
  return (
    <Create redirect="list">
      <CrewDetailsChildren />
    </Create>
  );
};
