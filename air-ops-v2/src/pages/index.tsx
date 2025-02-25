// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function HomePage() {

//   return (
//       <Typography>
//         Welcome to Toolpad Core!
//       </Typography>
//   );
// }
import React, { useEffect, useState } from "react";
import banner from "../Asset/Images/dash_banner.png";
import level from "../Asset/Images/level.png";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from './weather';
import CloseIcon from "@mui/icons-material/Close";
export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailSent, setShowEmailSent] = useState(false);

  const handleReset = () => {
    console.log(`Reset link sent to: ${email}`);
    setShowEmailSent(true);
  };
  // chart ˚
  const chartSetting = {
    yAxis: [
      {
        label: 'rainfall (mm)',
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };



  const [isNewQuote, setIsNewQuote] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const getQuotes = async () => {
    try {
      const data = await useGql({
        query: GET_QUOTES,
        queryName: "quotes",
        queryType: "query",
        variables: {},
      });
      setRows(() => {
        return data.map((quote: any) => {
          return {
            id: quote.id,
            refrenceNo: quote.referenceNumber,
            status: QuoteStatus[quote.status],
            requester: quote.requestedBy.name,
            // representative: quote.representative.name,
            itinerary: quote.itinerary
              .map((itinerary: any) => {
                return `${itinerary.source} - ${itinerary.destination} PAX ${itinerary.paxNumber}`;
              })
              .join(", "),
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
          };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getQuotes();
  }, []);

  return (
    <>
      <div className="dashboard_main_d">
        <div className="ban_img">
          <img src={banner} alt="" />
        </div>
        <div className="heading">
          <div className="name">
            <h2>Hello</h2>
            <p> Welcome to Airops</p>
          </div>
        </div>

        <div className="graphTotal">
          <div className="boxes">
            <div className="level">
              <img src={level} alt="" />
            </div>
            <div className="text">
              <p>Total Sales</p>
              <h5>$560K</h5>
            </div>
          </div>
          <div className="boxes">
            <div className="level">
              <img src={level} alt="" />
            </div>
            <div className="text">
              <p>Total Sales</p>
              <h5>$560K</h5>
            </div>
          </div>
          <div className="boxes">
            <div className="level">
              <img src={level} alt="" />
            </div>
            <div className="text">
              <p>Total Sales</p>
              <h5>$560K</h5>
            </div>
          </div>
          <div className="boxes">
            <div className="level">
              <img src={level} alt="" />
            </div>
            <div className="text">
              <p>Total Sales</p>
              <h5>$560K</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="chartsWork">
        <div className="innerChart_d">
          <BarChart
            series={[
              { data: [35, 44, 24, 34] },
              { data: [51, 6, 49, 30] },
              { data: [15, 25, 30, 50] },
              { data: [60, 50, 15, 25] },
            ]}
            height={290}
            // width={100}
            xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>
        <div className="innerChart_d">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            width={400}
            height={250}
          />
        </div>

      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Requester</TableCell>
              <TableCell align="right">Itinenary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => navigate(`/quotes/edit/${row.id}`)}
              >
                <TableCell component="th" scope="row">
                  {row.refrenceNo}
                </TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.requester}</TableCell>
                <TableCell align="right">{row.itinerary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>




      {/* forgot pass work modal */}

      <div>
        {/* Button to Open Modal */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Forgot Password?
        </Button>

        {/* Forgot Password Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            {/* Modal Header */}
            <Typography
              variant="h6"
              component="h2"
              textAlign="center"
              gutterBottom
            >
              Forgot your password?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Enter your email address and we’ll send you a link to reset your
              password.
            </Typography>

            {/* Email Input */}
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Buttons */}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Email Sent Confirmation Modal */}
        <Modal open={showEmailSent} onClose={() => setShowEmailSent(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <IconButton
              onClick={() => setShowEmailSent(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              Check in your mail!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We just emailed you with the instructions to reset your password.
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              For any questions, email us at
              <Typography
                component="span"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {" "}
                helpdesk@festicket.com
              </Typography>
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setShowEmailSent(false)}
            >
              OK
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}
