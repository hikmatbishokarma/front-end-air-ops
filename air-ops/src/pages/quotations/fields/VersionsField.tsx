import { useRecordContext } from 'react-admin';
import { IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const VersionsField = ({ onClick }: any) => {
  const record = useRecordContext();

  return (
    <IconButton onClick={() => onClick(record?.code)} color='primary'>
      <HistoryIcon />
    </IconButton>
  );
};

export default VersionsField;
