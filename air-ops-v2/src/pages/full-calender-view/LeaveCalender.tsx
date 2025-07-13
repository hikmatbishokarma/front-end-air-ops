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
import { useSnackbar } from "../../SnackbarContext";
import { useSession } from "../../SessionContext";
import useGql from "../../lib/graphql/gql";
import { GET_LEAVES } from "../../lib/graphql/queries/leave";
import { LeaveType } from "../../lib/utils";
import moment from "moment";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

export default function StaffLeaveCalenderView() {
  const { session } = useSession();
  const showSnackbar = useSnackbar();
  const { name } = session?.user || {};

  const [flightEvents, setFlightEvents] = useState<any>();
  const [leaveEvents, setLeaveEvents] = useState<any>();

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

    getLeaves(startDate, endDate);
  }, []);

  const handleLeaveDatesSet = (arg) => {
    const startDate = moment.utc(arg.start).startOf("day").toISOString();
    const endDate = moment.utc(arg.end).endOf("day").toISOString();

    getLeaves(startDate, endDate);
  };

  return (
    <Box p={2}>
      {/* Dual Calendar Layout */}
      <Grid container>
        <Grid item xs={12} md={12}>
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
