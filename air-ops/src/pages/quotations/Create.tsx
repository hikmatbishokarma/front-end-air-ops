import { Create } from 'react-admin';
import { QuotationsChildren } from './Children';

export const QuotationsCreate = () => {
  return (
    <Create>
      <QuotationsChildren />
    </Create>
  );
};
