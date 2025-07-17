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

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import moment from "moment";
import { useSession } from "../../SessionContext";
import useGql from "../../lib/graphql/gql";
import { FLIGHT_SEGMENTS_FOR_CALENDER } from "../../lib/graphql/queries/quote";
import { useSnackbar } from "../../SnackbarContext";
import { GET_LEAVES } from "../../lib/graphql/queries/leave";

export default function TripConfirmationCalenderView() {
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const { name } = session?.user || {};

  const [flightEvents, setFlightEvents] = useState<any>();

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

  useEffect(() => {
    const startDate = moment.utc().startOf("month").toISOString();
    const endDate = moment.utc().endOf("month").toISOString();

    getFlightSegementsForCalender(startDate, endDate);
  }, []);

  const handleFlightDatesSet = (arg) => {
    const startDate = moment.utc(arg.start).startOf("day").toISOString();
    const endDate = moment.utc(arg.end).endOf("day").toISOString();

    getFlightSegementsForCalender(startDate, endDate);
  };

  return (
    <Box p={2}>
      {/* Dual Calendar Layout */}
      <Grid container>
        <Grid item xs={12} md={12}>
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
      </Grid>
    </Box>
  );
}
