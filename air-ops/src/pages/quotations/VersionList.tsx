import { Datagrid, DateField, List, NumberField, TextField } from 'react-admin';

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
      <Datagrid bulkActionButtons={false} width={'100%'}>
        <TextField source='code' title='Quotation No' />
        <TextField source='state' title='State' />
        <NumberField source='version' title='Version' />
        <DateField source='createdAt' title='Created At' />
      </Datagrid>
    </List>
  );
};

export default VersionList;
