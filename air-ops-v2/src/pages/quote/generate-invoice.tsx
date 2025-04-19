import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import InvoicePreview from "../../components/invoice-preview";
import useGql from "../../lib/graphql/gql";
import { GENERATE_INVOICE } from "../../lib/graphql/queries/invoice";
import { useSnackbar } from "../../SnackbarContext";

const GenerateInvoice = () => {
  const [searchParams] = useSearchParams();
  const quotationNo = searchParams.get("quotationNo");

  const showSnackbar = useSnackbar();
  const [previewData, setPreviewData] = useState(null);

  console.log("quotationNo", quotationNo);

  const generateInvoice = async (quotationNo) => {
    console.log("quotationNo", quotationNo);
    const result = await useGql({
      query: GENERATE_INVOICE,
      queryName: "generateInvoice",
      queryType: "query-without-edge",
      variables: {
        args: {
          quotationNo: quotationNo,
        },
      },
    });

    if (!result) {
      showSnackbar("Internal server error!", "error");
    }

    setPreviewData(result);
  };

  useEffect(() => {
    generateInvoice(quotationNo);
  }, [quotationNo]);

  return (
    <>
      <InvoicePreview
        htmlContent={previewData}
        currentQuotation={quotationNo}
      />
    </>
  );
};

export default GenerateInvoice;
