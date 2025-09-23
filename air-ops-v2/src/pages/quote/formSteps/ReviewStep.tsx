// // src/components/formSteps/ReviewStep.tsx
// import React from "react";
// import { Box, Typography, Grid } from "@mui/material";
// import moment from "moment";

// const ReviewStep = ({ watch }) => {
//   const allFormValues = watch(); // Get all form data to display in review

//   const renderValue = (label, value) => {
//     if (value) {
//       return (
//         <Grid item xs={12}>
//           <Typography>
//             **{label}:** {value}
//           </Typography>
//         </Grid>
//       );
//     }
//     return null;
//   };

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         Review your information
//       </Typography>
//       <Grid container spacing={2}>
//         {renderValue("Category", allFormValues.category)}
//         {renderValue("Requested By", allFormValues.requestedBy)}
//         {/* ... Conditionally render other fields */}

//         {allFormValues.itinerary?.length > 0 && (
//           <Grid item xs={12}>
//             <Typography variant="h6">Itinerary Details</Typography>
//             {allFormValues.itinerary.map((sector, index) => (
//               <Box key={index} sx={{ mt: 1 }}>
//                 {renderValue("From", sector.source)}
//                 {renderValue("To", sector.destination)}
//                 {renderValue(
//                   "Departure Date",
//                   sector.depatureDate
//                     ? moment(sector.depatureDate).format("DD-MM-YYYY")
//                     : null
//                 )}
//                 {/* ... other itinerary fields */}
//               </Box>
//             ))}
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   );
// };

// export default ReviewStep;

// src/quotes/formSteps/ReviewStep.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import { FlightCategoryEnum } from "../../../lib/utils";

const ReviewStep = ({
  allFormValues,
  clients,
  representatives,
  aircrafts,
  aircraftCategories,
}) => {
  const showEnquiry = allFormValues.requestedBy || allFormValues.representative;
  const showPrices = allFormValues.prices?.length > 0;
  const showGrandTotal =
    allFormValues.grandTotal !== undefined &&
    allFormValues.grandTotal !== null &&
    allFormValues.grandTotal !== 0;

  const aircraft = allFormValues?.aircraft;

  return (
    <Box sx={{ mt: 5 }}>
      {showEnquiry && (
        <>
          {/* Enquiry Section */}
          {/* <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginTop: "24px",
            }}
          >
            Enquiry:
          </h2> */}
          <div className="space-y-2">
            <p>
              <strong>Enquiry From:</strong> {showEnquiry?.name || "N/A"}
            </p>
            {allFormValues?.representative && (
              <p>
                <strong>Representative:</strong>{" "}
                {allFormValues?.representative?.name || "N/A"}
              </p>
            )}
          </div>
        </>
      )}
      <div className="space-y-2">
        <p>
          <strong>Category:</strong>{" "}
          {FlightCategoryEnum[allFormValues.category] || "N/A"}
        </p>
        <p>
          <strong>Aircraft:</strong> {aircraft?.name || "N/A"} - (
          {aircraft?.code ?? ""})
        </p>
      </div>
      {/* Itinerary Section */}
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginTop: "24px",
        }}
      >
        Sectors:
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            border: "1px solid #ccc",
            borderCollapse: "collapse",
            marginTop: "8px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#DDD" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Source
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Destination
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Depature Date
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Depature Time
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Arrival Date
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Arrival Time
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pax</th>
            </tr>
          </thead>
          {/* <tbody>
            {allFormValues.itinerary?.length > 0 ? (
              allFormValues.itinerary.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.source}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.destination}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {moment(item.depatureDate).format("DD-MM-YYYY")}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.depatureTime}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {moment(item.arrivalDate).format("DD-MM-YYYY")}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.arrivalTime}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.paxNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  No itinerary
                </td>
              </tr>
            )}
          </tbody> */}
          <tbody>
            {allFormValues.sectors?.length > 0 ? (
              allFormValues.sectors.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {`${item?.source?.name} (${item?.source?.code})`}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {`${item?.destination?.name} (${item?.destination?.code})`}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {moment(item.depatureDate).format("DD-MM-YYYY")}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.depatureTime}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {moment(item.arrivalDate).format("DD-MM-YYYY")}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.arrivalTime}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {item.paxNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  No sectors
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPrices && showGrandTotal && (
        <>
          {/* Price Section */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginTop: "24px",
            }}
          >
            Price:
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderCollapse: "collapse",
                marginTop: "8px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#DDD" }}>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Label
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Unit(Hrs)
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Price
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Currency
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFormValues.prices?.length > 0 ? (
                  allFormValues.prices.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {item.label}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {item.unit}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {item.price}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {item.currency}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {item.total}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      No price details
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showGrandTotal && (
        <p>
          <strong>Grand Total:</strong> {allFormValues.grandTotal || 0}
        </p>
      )}
    </Box>
  );
};

export default ReviewStep;
