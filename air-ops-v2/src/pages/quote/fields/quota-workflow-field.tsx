import React from "react";
import { QuotationStatus } from "../../../lib/utils";
import QuotationWorkflow from "../quotation-workflow";

const QuotationWorkflowField = ({
  status,
  id,
  code,
  refreshList
}: {
  status: QuotationStatus;
  id: string;
  code: string;
  refreshList: () => void; 
}) => {

  
  return <QuotationWorkflow currentState={status} id={id} code={code} refreshList={refreshList} />;
};

export default QuotationWorkflowField;
