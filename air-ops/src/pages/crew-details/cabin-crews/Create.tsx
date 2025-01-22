import { Create } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const CabinCrewsCreate = () => {
  return (
    <Create redirect="list">
      <CrewDetailsChildren />
    </Create>
  );
};
