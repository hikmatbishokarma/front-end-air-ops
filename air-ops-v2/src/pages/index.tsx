// import React from "react";
// import { Grid, Typography, Box, Card, CardContent } from "@mui/material";
// import { useSession } from "../SessionContext";
// // import dashbanner from "../Asset/Images/dashbanner.png";
// import ClockDisplay from "../components/Clock";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import listPlugin from "@fullcalendar/list";

// export default function DashboardPage() {
//   const { session, setSession, loading } = useSession();

//   const { id: operatorId, name: agentName } = session?.user?.agent || {};
//   const { name } = session?.user || {};

//   const flightEvents = [
//     {
//       "title": "HYD → DEL",
//       "start": "2025-06-29T09:00:00.000Z",
//       "end": "2025-06-29T11:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "DEL → HYD",
//       "start": "2025-06-29T13:00:00.000Z",
//       "end": "2025-06-29T15:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "HYD → DEL",
//       "start": "2025-06-30T13:00:00.000Z",
//       "end": "2025-06-30T15:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "DEL → HYD",
//       "start": "2025-06-30T16:00:00.000Z",
//       "end": "2025-06-30T18:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "HYD → DEL",
//       "start": "2025-06-29T12:03:00.000Z",
//       "end": "2025-06-29T12:33:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "DEL → HYD",
//       "start": "2025-06-29T14:05:00.000Z",
//       "end": "2025-06-29T14:45:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "HYD → DEL",
//       "start": "2025-06-30T10:00:00.000Z",
//       "end": "2025-06-30T12:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "DEL → GOI",
//       "start": "2025-06-30T17:00:00.000Z",
//       "end": "2025-06-30T19:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "DEL → HYD",
//       "start": "2025-06-30T10:00:00.000Z",
//       "end": "2025-06-30T12:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//     {
//       "title": "HYD → DEL",
//       "start": "2025-07-06T10:00:00.000Z",
//       "end": "2025-07-06T12:00:00.000Z",
//       "__typename": "CalenderData",
//     },
//   ];

//   return (
//     <>
//       <ClockDisplay />

//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
//         initialView="dayGridMonth"
//         timeZone="UTC"
//         headerToolbar={{
//           left: "prev,next today",
//           center: "title",
//           right: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         events={flightEvents}
//         // datesSet={handleDatesSet}
//       />

//       {/* <Box
//         sx={{
//           position: "relative",
//           height: 250,
//           borderRadius: 2,
//           overflow: "hidden",
//           mt: 4,
//           backgroundImage: `url(${dashbanner})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           color: "#fff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0, 0, 0, 0.5)",
//             zIndex: 1,
//           }}
//         />
//         <Box sx={{ zIndex: 2, textAlign: "center", px: 3 }}>
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 600,
//               mb: 1,
//               letterSpacing: 1,
//             }}
//           >
//             Welcome to Airops
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Hello, <strong>{name}</strong>! You've successfully logged in to
//             Airops - Aviation Operations Made Easy.
//           </Typography>
//         </Box>
//       </Box> */}
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  Container,
} from "@mui/material";
import { useSession } from "../SessionContext";
import ClockDisplay from "../components/Clock";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { FLIGHT_SEGMENTS_FOR_CALENDER } from "../lib/graphql/queries/quote";
import useGql from "../lib/graphql/gql";
import moment from "moment";
import { GET_LEAVES } from "../lib/graphql/queries/leave";
import { useSnackbar } from "../SnackbarContext";
import { LeaveType } from "../lib/utils";
import FlightMap from "../components/Map";
import WorldFlightMap from "../components/WorldMap";
import DynamicFlightMap from "../components/DynamicFlightMap";
import IndiaFlightMap from "../components/IndianMap";

export default function DashboardPage() {
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const { name } = session?.user || {};

  const [flightEvents, setFlightEvents] = useState<any>();
  const [leaveEvents, setLeaveEvents] = useState<any>();

  const getFlightSegementsForCalender = async (startDate, endDate) => {
    const response = await useGql({
      query: FLIGHT_SEGMENTS_FOR_CALENDER,
      queryName: "flightSegmentsForCalendar",
      queryType: "query-without-edge",
      variables: {
        "startDate": startDate,
        "endDate": endDate,
      },
    });

    if (response.length) {
      setFlightEvents(response.map(({ __typename, ...rest }) => rest));
    }
  };

  const getLeaves = async (startDate, endDate) => {
    try {
      const result = await useGql({
        query: GET_LEAVES,
        queryName: "leaves",
        queryType: "query-with-count",
        variables: {
          filter: {
            createdAt: {
              between: { lower: startDate, upper: endDate },
            },
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Manual!", "error");

      const events = result.data.map((item) => ({
        title: `${item?.crew ?? ""}-${LeaveType[item.type]}`,
        start: moment(item.fromDate).format("YYYY-MM-DD"),
        end: moment(item.toDate).format("YYYY-MM-DD"),
        color: "#fbc02d",
      }));
      setLeaveEvents(events);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Manual!", "error");
    }
  };

  useEffect(() => {
    const startDate = moment.utc().startOf("month").toISOString();
    const endDate = moment.utc().endOf("month").toISOString();

    getFlightSegementsForCalender(startDate, endDate);
    getLeaves(startDate, endDate);
  }, []);

  const handleFlightDatesSet = (arg) => {
    const startDate = moment.utc(arg.start).startOf("day").toISOString();
    const endDate = moment.utc(arg.end).endOf("day").toISOString();

    getFlightSegementsForCalender(startDate, endDate);
  };

  const handleLeaveDatesSet = (arg) => {
    const startDate = moment.utc(arg.start).startOf("day").toISOString();
    const endDate = moment.utc(arg.end).endOf("day").toISOString();

    getLeaves(startDate, endDate);
  };

  return (
    <Box p={2}>
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{ p: 2, backgroundColor: "#ffecb3", borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total Quotes
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              100
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{ p: 2, backgroundColor: "#c8e6c9", borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Trip Confirmed
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              20
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Card sx={{ p: 2, backgroundColor: "#b3e5fc", borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total Flights
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              850
            </Typography>
          </Card>
        </Grid>
      </Grid> */}

      {/* Future Filter Row (empty for now) */}
      <Box mt={2} mb={3}>
        {/* Add filter dropdowns or chips here */}
      </Box>

      {/* Dual Calendar Layout */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                🛫 Flight Block Calendar
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                timeZone="UTC"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                height="auto"
                events={flightEvents}
                datesSet={handleFlightDatesSet}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                👨‍✈️ Staff Leave Calendar
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                timeZone="UTC"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                height="auto"
                events={leaveEvents}
                datesSet={handleLeaveDatesSet}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
