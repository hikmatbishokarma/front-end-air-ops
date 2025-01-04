import { Create } from 'react-admin';
import { CrewDetailsChildren } from '../Children';


export const EngineersCreate = () => {
  return (
    <Create redirect="list">
      <CrewDetailsChildren />
    </Create>
  );
};
