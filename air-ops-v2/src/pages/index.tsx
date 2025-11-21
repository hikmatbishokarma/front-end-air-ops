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
  Avatar,
} from "@mui/material";
import { useSession } from "@/app/providers";
import ClockDisplay from "../components/Clock";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { FLIGHT_SEGMENTS_FOR_CALENDER } from "../lib/graphql/queries/quote";
import useGql from "../lib/graphql/gql";
import moment from "moment";
import { GET_LEAVES } from "../lib/graphql/queries/leave";
import { useSnackbar } from "@/app/providers";
import { LeaveType } from "../shared/utils";
import FlightMap from "../components/Map";
import WorldFlightMap from "../components/WorldMap";
import DynamicFlightMap from "../components/DynamicFlightMap";
import IndiaFlightMap from "../components/IndianMap";
import {
  FlightCalendarWidget,
  StaffLeaveWidget,
} from "../components/CalenderWidget";
import AirportDistanceCalculator from "../components/AirportDistanceCalculator";

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

  const handleLeaveDatesSet = (arg) => {
    const startDate = moment.utc(arg.start).startOf("day").toISOString();
    const endDate = moment.utc(arg.end).endOf("day").toISOString();

    getLeaves(startDate, endDate);
  };

  return (
    <Box p={2}>
      <Box mt={2} mb={3}>
        {/* Add filter dropdowns or chips here */}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <FlightCalendarWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <StaffLeaveWidget />
        </Grid>
        <Grid item xs={12}>
          <AirportDistanceCalculator />
        </Grid>
      </Grid>
    </Box>
  );
}
