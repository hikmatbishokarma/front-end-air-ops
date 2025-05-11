// import React, { useEffect, useState } from "react";
// import banner from "../Asset/Images/dash_banner.png";
// import level from "../Asset/Images/level.png";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import Paper from "@mui/material/Paper";

// import { BarChart } from "@mui/x-charts/BarChart";
// import { PieChart } from "@mui/x-charts/PieChart";
// import { LineChart } from "@mui/x-charts/LineChart";
// import { axisClasses } from "@mui/x-charts/ChartsAxis";
// import { dataset, valueFormatter } from "./weather";
// import CloseIcon from "@mui/icons-material/Close";
// import useGql from "../lib/graphql/gql";
// import { GET_SALES_DASHBOARD } from "../lib/graphql/queries/dashboard";
// import { useNavigate } from "react-router";
// export default function DashboardPage() {
//   const navigate = useNavigate();

//   const [salesDashboardData, setSalesDashboardData] = useState<any>();
//   const [rows, setRows] = useState();

//   // chart
//   const chartSetting = {
//     yAxis: [
//       {
//         label: "rainfall (mm)",
//       },
//     ],
//     width: 500,
//     height: 300,
//     sx: {
//       [`.${axisClasses.left} .${axisClasses.label}`]: {
//         transform: "translate(-20px, 0)",
//       },
//     },
//   };

//   const fethSalesDashboardData = async () => {
//     try {
//       const data = await useGql({
//         query: GET_SALES_DASHBOARD,
//         queryName: "getSalesDashboardData",
//         queryType: "query-without-edge",
//         variables: {
//           range: "lastMonth",
//         },
//       });
//       console.log("data:::", data);
//       setSalesDashboardData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fethSalesDashboardData();
//   }, []);

//   return (
//     <>
//       <div className="dashboard_main_d">
//         <div className="ban_img">
//           <img src={banner} alt="" />
//         </div>
//         <div className="heading">
//           <div className="name">
//             <h2>Hello</h2>
//             <p> Welcome to Airops</p>
//           </div>
//         </div>

//         <div className="graphTotal">
//           <div className="boxes">
//             <div className="level">
//               <img src={level} alt="" />
//             </div>
//             <div className="text">
//               <p>New Quotes</p>
//               <h5>{salesDashboardData?.summary?.newQuotations}</h5>
//             </div>
//           </div>
//           <div className="boxes">
//             <div className="level">
//               <img src={level} alt="" />
//             </div>
//             <div className="text">
//               <p>Confirmed quotes</p>
//               <h5>{salesDashboardData?.summary?.confirmedQuotations}</h5>
//             </div>
//           </div>
//           <div className="boxes">
//             <div className="level">
//               <img src={level} alt="" />
//             </div>
//             <div className="text">
//               <p>Quote Sold</p>
//               <h5>{salesDashboardData?.summary?.sales}</h5>
//             </div>
//           </div>
//           <div className="boxes">
//             <div className="level">
//               <img src={level} alt="" />
//             </div>
//             <div className="text">
//               <p>Cancelled Quotes</p>
//               <h5>{salesDashboardData?.summary?.cancellations}</h5>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/*
//       <div className="chartsWork">
//         <div className="innerChart_d">
//           <BarChart
//             dataset={salesDashboardData?.salesTrend || []}
//             series={[
//               { dataKey: "sales", label: "Sales" },
//               { dataKey: "cancellations", label: "Cancellations" },
//             ]}
//             height={290}
//             // width={100}
//             xAxis={[{ scaleType: "band", dataKey: "date" }]}
//             margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
//           />
//         </div>
//         <div className="innerChart_d">
//           <PieChart
//             series={[
//               {
//                 data: salesDashboardData?.quotationStatusDistribution || [],
//               },
//             ]}
//             width={400}
//             height={250}
//           />
//         </div>
//       </div> */}
//       <TableContainer component={Paper} >
//         <Table sx={{ minWidth: 650 }} aria-label="simple table" >
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell align="right">Status</TableCell>
//               <TableCell align="right">Requester</TableCell>
//               <TableCell align="right">Itinenary</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {salesDashboardData?.latestQuotations?.map((row) => (
//               <TableRow
//                 key={row.id}
//                 sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                 onClick={() => navigate(`/quotes/edit/${row.id}`)}
//               >
//                 <TableCell component="th" scope="row">
//                   {row.revisedQuotatioNo || row.quotationNo}
//                 </TableCell>
//                 <TableCell align="right">{row.status}</TableCell>
//                 <TableCell align="right">{row.representative}</TableCell>
//                 <TableCell align="right">
//                   {row?.itinerary?.map(
//                     (item) => `${item.source}-${item.destination}`,
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// }

import React from "react";
import { Grid, Typography, Box, Card, CardContent } from "@mui/material";
import { useSession } from "../SessionContext";
import dashbanner from "../Asset/Images/dashbanner.png";

const stats = [
  { title: "Total Bookings", value: 124 },
  { title: "Pending Quotes", value: 17 },
  { title: "Confirmed Flights", value: 56 },
  { title: "Agents Onboarded", value: 12 },
];

export default function DashboardPage() {
  console.log("ENV DUMP:", import.meta.env);
  console.log(import.meta.env); // This will log all available environment variables

  console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL); // Check a specific variable

  const { session, setSession, loading } = useSession();

  const { id: agentId, name: agentName } = session?.user?.agent || {};
  const { name } = session?.user || {};

  return (
    <Box
      sx={{
        position: "relative",
        height: 250,
        borderRadius: 2,
        overflow: "hidden",
        mt: 4,
        backgroundImage: `url(${dashbanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />
      <Box sx={{ zIndex: 2, textAlign: "center", px: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 1,
            letterSpacing: 1,
          }}
        >
          Welcome to B2B Airops Dashboard
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hello, <strong>{name}</strong>! You've successfully logged in to B2B
          Airops platform.
        </Typography>
      </Box>
    </Box>
  );
}
