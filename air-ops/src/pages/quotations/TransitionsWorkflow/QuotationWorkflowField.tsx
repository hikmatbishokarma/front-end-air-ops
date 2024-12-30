import { useRecordContext } from 'react-admin';
import QuotationWorkflow from './QuotationWorkflow';

const QuotationWorkflowField = ({ source }: { source: string }) => {
    console.log("source:",source);
  const record = useRecordContext();
  if (!record) return null;

  return (
    <QuotationWorkflow
      currentState={record[source]}
      id={record.id}
      code={record.code}
    />
  );
};

export default QuotationWorkflowField;
