import { Create } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const PilotsCreate = () => {
  return (
    <Create redirect="list">
      <CrewDetailsChildren />
    </Create>
  );
};
