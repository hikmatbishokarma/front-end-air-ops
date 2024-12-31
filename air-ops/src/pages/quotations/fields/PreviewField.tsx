import { IconButton } from '@mui/material';

import PreviewIcon from '@mui/icons-material/Preview';
import { useRecordContext } from 'react-admin';
import { useNavigate } from 'react-router-dom';

const PreviewField = () => {
  const record = useRecordContext();
  const navigate = useNavigate();

  const handlePreviewClick = () => {
    if (record?.id) {
      navigate(`/preview/${record.id}`);
    }
  };

  return (
    <IconButton onClick={handlePreviewClick}>
      <PreviewIcon />
    </IconButton>
  );
};

export default PreviewField;
