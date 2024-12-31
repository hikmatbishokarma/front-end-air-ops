import {
  Datagrid,
  List,
  TextField,
  NumberField,
  EditButton,
  WrapperField,
} from 'react-admin';
import QuotationWorkflowField from './fields/QuotationWorkflowField';
import VersionsField from './fields/VersionsField';
import { useState } from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VersionList from './VersionList';
import PreviewField from './fields/PreviewField';

// const ListActions = () => {

//     return (
//         <TopToolbar>

//            <CreateButton to="/generate-quote"/>
//         </TopToolbar>
//     );
// }

export const QuotationsList = () => {
  const [showVersions, setShowVersions] = useState(false);
  const [currentActiveVersionCode, setCurrentActiveVersionCode] =
    useState<string>('');

  return (
    <Box>
      <List filter={{ isLatest: true }}>
        <Datagrid bulkActionButtons={false} rowClick={false}>
          <TextField source='code' title='Quotation No' />
          <QuotationWorkflowField source='state' />
          <NumberField source='version' title='Version' />
          <WrapperField label='Preview'>
            <PreviewField />
          </WrapperField>
          <WrapperField label='Version'>
            <VersionsField
              onClick={(code: string) => {
                setShowVersions(!showVersions);
                setCurrentActiveVersionCode(code);
              }}
            />
          </WrapperField>
          <EditButton />
        </Datagrid>
      </List>
      <Drawer open={showVersions} anchor='right'>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '8px',
            }}
          >
            <CloseIcon
              onClick={() => setShowVersions(false)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
        <Box width={'100%'} sx={{ m: 2 }}>
          <Typography variant='h5'>Version History</Typography>
          <VersionList code={currentActiveVersionCode} />
        </Box>
      </Drawer>
    </Box>
  );
};
