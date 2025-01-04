import { Datagrid, DateField, List, NumberField, TextField, WrapperField } from 'react-admin';
import PreviewField from './fields/PreviewField';

const VersionList = ({ code }: { code: string }) => {
  return (
    <List
      perPage={25}
      filter={{ code: code, isLatest: false }}
      sort={{ field: 'version', order: 'DESC' }}
      resource='quotations'
      actions={false}
      pagination={false}
    >
      <Datagrid bulkActionButtons={false} width={'100%'} rowClick={false}>
        <TextField source='code' title='Quotation No' />
        <TextField source='state' title='State' />
        <NumberField source='version' title='Version' />
        <WrapperField label='Preview'>
            <PreviewField />
          </WrapperField>
        <DateField source='createdAt' title='Created At' />
      </Datagrid>
    </List>
  );
};

export default VersionList;
