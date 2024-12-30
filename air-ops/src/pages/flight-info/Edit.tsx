import { Edit } from 'react-admin';
import { FlightInfoChildren } from './Children';

export const FlightInfoEdit = () => {
  return (
    <Edit>
      <FlightInfoChildren />
    </Edit>
  );
};
