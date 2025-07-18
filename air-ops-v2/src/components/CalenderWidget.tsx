import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  CardContent,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Fade,
} from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import CircleIcon from "@mui/icons-material/Circle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import useGql from "../lib/graphql/gql";
import { GET_LEAVES } from "../lib/graphql/queries/leave";
import { useSnackbar } from "../SnackbarContext";
import { LeaveType } from "../lib/utils";
import { FLIGHT_SEGMENTS_FOR_CALENDER } from "../lib/graphql/queries/quote";
import NoScheduleFound from "./NoScheduleFound";
import { useNavigate } from "react-router";

// export const FlightCalendarWidget = () => {
//   const [flightEvents, setFlightEvents] = useState<any[]>([]);

//   const getFlightSegementsForCalender = async (startDate, endDate) => {
//     const response = await useGql({
//       query: FLIGHT_SEGMENTS_FOR_CALENDER,
//       queryName: "flightSegmentsForCalendar",
//       queryType: "query-without-edge",
//       variables: {
//         "startDate": startDate,
//         "endDate": endDate,
//       },
//     });

//     if (response.length) {
//       const events = response.map((item) => ({
//         title: `${item.title}(${item?.aircraft?.code})`,
//         depatureTime: item.depatureTime,
//         arrivalTime: item.arrivalTime,
//       }));
//       setFlightEvents(events);
//     }
//   };

//   useEffect(() => {
//     const startDate = moment.utc().startOf("day").toISOString();
//     const endDate = moment.utc().endOf("day").toISOString();

//     getFlightSegementsForCalender(startDate, endDate);
//   }, []);

//   return (
//     <Card
//       sx={{
//         display: "flex",
//         height: 300,
//         borderRadius: 3,
//         overflow: "hidden",
//         boxShadow: 3,
//       }}
//     >
//       {/* Left: Events */}
//       <Box
//         sx={{
//           width: "45%", // ✅ Changed from 50%
//           backgroundColor: "#e3f2fd",
//           p: 1.5,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box>
//           <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//             ✈️ Trip Confirmation
//           </Typography>
//           <Divider sx={{ mb: 1 }} />
//           <List dense>
//             {flightEvents.length &&
//               flightEvents?.map((event, index) => (
//                 <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
//                   <ListItemText
//                     primary={
//                       <Typography
//                         variant="caption"
//                         fontWeight={500}
//                         color="text.primary"
//                       >
//                         {event.title}
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
//               ))}
//           </List>
//         </Box>
//       </Box>

//       {/* Right: Calendar */}
//       <Box
//         sx={{
//           width: "55%",
//           p: 0.5,
//           "& .MuiPickersLayout-root": {
//             height: "100%",
//           },
//           "& .MuiDayCalendar-monthContainer": {
//             height: "100%",
//           },
//           "& .MuiPickersCalendarHeader-root": {
//             mt: 0,
//           },
//           "& .MuiDayCalendar-weekContainer": {
//             justifyContent: "center",
//           },
//         }}
//       >
//         <LocalizationProvider dateAdapter={AdapterMoment}>
//           <StaticDatePicker
//             displayStaticWrapperAs="desktop"
//             value={moment()}
//             onChange={() => {}}
//             showDaysOutsideCurrentMonth
//             readOnly
//             slots={{
//               actionBar: () => null,
//             }}
//             sx={{
//               "& .MuiDayCalendar-weekDayLabel": {
//                 fontSize: "0.7rem",
//               },
//               "& .MuiPickersDay-root": {
//                 fontSize: "0.75rem",
//                 width: 32,
//                 height: 32,
//               },
//             }}
//           />
//         </LocalizationProvider>
//       </Box>
//     </Card>
//   );
// };

// Updated GIF for no events
const NO_EVENTS_GIF_URL =
  "https://media.giphy.com/media/l4FGp6wB6QJ6VpB7Q/giphy.gif"; // A "No Direct Flight" GIF

interface FlightSegment {
  title: string;
  aircraft?: { code: string };
  depatureTime: string;
  arrivalTime: string;
}

interface FormattedFlightEvent {
  title: string;
  depatureTime: string;
  arrivalTime: string;
  aircraft?: any;
}

export const FlightCalendarWidget = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [flightEvents, setFlightEvents] = useState<FormattedFlightEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getFlightSegmentsForCalendar = useCallback(
    async (date: moment.Moment) => {
      setLoading(true);
      setError(null);
      setFlightEvents([]);

      const startDate = date.startOf("day").toISOString();
      const endDate = date.endOf("day").endOf("day").toISOString(); // Ensure endDate is end of the day

      try {
        const response: FlightSegment[] = await useGql({
          query: FLIGHT_SEGMENTS_FOR_CALENDER,
          queryName: "flightSegmentsForCalendar",
          queryType: "query-without-edge",
          variables: {
            startDate: startDate,
            endDate: endDate,
          },
        });

        if (response && response.length > 0) {
          const events: FormattedFlightEvent[] = response.map((item) => ({
            title: item.title,
            depatureTime: item.depatureTime,
            arrivalTime: item.arrivalTime,
            aircraft: item.aircraft,
          }));
          setFlightEvents(events);
        } else {
          setFlightEvents([]);
        }
      } catch (err: any) {
        showSnackbar(err.message || "Failed to fetch flight events!", "error");
        setError(err.message || "Failed to load flight events.");
        setFlightEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [showSnackbar]
  );

  useEffect(() => {
    getFlightSegmentsForCalendar(selectedDate);
  }, [selectedDate, getFlightSegmentsForCalendar]);

  const onClickTripConfirmationWidget = () => {
    navigate("/trip-confirmation/calender");
  };

  return (
    <Card className="tripcnfrm"
      sx={{
        display: "flex",
        height: 300,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      {/* Left: Events */}
      <Box
        sx={{
          width: "45%",
          //   backgroundColor: "#e3f2fd",
          backgroundColor: "#FFFFFF",
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onClick={onClickTripConfirmationWidget}
      >
        <Box flexGrow={1}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            ✈️ Trip Confirmation
          </Typography>
          <Divider sx={{ mb: 1 }} />

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress size={24} />
              <Typography variant="body2" ml={1} color="text.secondary">
                Loading events...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : flightEvents.length > 0 ? (
            <Fade in={!loading}>
              <List
                dense
                sx={{ maxHeight: "calc(100% - 60px)", overflowY: "auto" }}
              >
                {flightEvents.map((event, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="caption"
                          fontWeight={500}
                          color="text.primary"
                        >
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          ({event?.aircraft.code}) | {event.depatureTime} -{" "}
                          {event.arrivalTime}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Fade>
          ) : (
            // <Fade in={!loading}>
            <NoScheduleFound
            // No onCheckCalendar prop passed here because the calendar is directly beside it.
            // The main interaction for "no schedule today" is to simply pick a different date.
            // If you want a button here to navigate to a *separate* full calendar page,
            // you would add onCheckCalendar={() => navigate('/full-calendar-page')}
            />
            // </Fade>
          )}
        </Box>
      </Box>

      {/* Right: Calendar */}
      <Box
        sx={{
          width: "55%",
          backgroundColor: "#f5f5f5",
          p: 0.5,
          "& .MuiPickersLayout-root": {
            height: "100%",
          },
          "& .MuiDayCalendar-monthContainer": {
            height: "100%",
          },
          "& .MuiPickersCalendarHeader-root": {
            mt: 0,
          },
          "& .MuiDayCalendar-weekContainer": {
            justifyContent: "center",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={selectedDate}
            onChange={(newDate: moment.Moment | null) => {
              if (newDate) {
                setSelectedDate(newDate);
              }
            }}
            slots={{
              actionBar: () => null,
            }}
            sx={{
              "& .MuiDayCalendar-weekDayLabel": {
                fontSize: "0.7rem",
              },
              "& .MuiPickersDay-root": {
                fontSize: "0.75rem",
                width: 32,
                height: 32,
              },
            }}
          />
        </LocalizationProvider>
      </Box>
    </Card>
  );
};

const leaveColors = {
  CASUAL_LEAVE: "#42a5f5", // blue
  SICK_LEAVE: "#ef5350", // red
  PRIVILEGE_LEAVE: "#66bb6a", // green
  PATERNITY_LEAVE: "#fb8c00", // orange
  BEREAVEMENT_LEAVE: "#673ab7",
};

export const StaffLeaveWidget = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar(); // Corrected usage if it's a hook
  const today = moment();

  // Use useMemo to ensure weekDays array is stable across renders
  // unless `today` somehow changes (which it won't within a component's lifecycle)
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => moment().add(i, "days")),
    [today]
  ); // Dependency `today` is stable, so `weekDays` will be stable

  const [selectedDate, setSelectedDate] = useState(today);
  const [allVisibleLeaves, setAllVisibleLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Type for error

  // --- Single API Call for all 7 visible days ---
  const getVisibleLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate start and end of period directly here, as `today` is stable.
      // This avoids putting `weekDays` (which changes reference) in useCallback's deps.
      const startOfPeriod = moment().startOf("day").toISOString();
      const endOfPeriod = moment().add(6, "days").endOf("day").toISOString();

      const result = await useGql({
        query: GET_LEAVES,
        queryName: "leaves",
        queryType: "query-with-count",
        variables: {
          filter: {
            // createdAt: {
            //   // Keep createdAt filter as per your latest code
            //   between: { lower: startOfPeriod, upper: endOfPeriod },
            // },

            and: [
              { fromDate: { "lte": endOfPeriod } },
              { toDate: { "gte": startOfPeriod } },
            ],

            // REMEMBER: Filtering by `createdAt` will get leaves *created* in the period,
            // not necessarily leaves that *start/end* in the period.
            // If your API supports `fromDate` or a range overlap, that would be better for a calendar view.
            // e.g., fromDate: { gte: startOfPeriod }, toDate: { lte: endOfPeriod }
          },
        },
      });

      if (!result.data) {
        showSnackbar("Failed to fetch leaves!", "error");
        setAllVisibleLeaves([]);
        return;
      }

      const mappedLeaves = (result.data.leaves || result.data).map((item) => ({
        id: item.id,
        staffName: item?.crew?.fullName || item?.crew?.displayName,
        // leaveType: LeaveType[item.type],
        leaveType: item.type,
        date: moment(item.fromDate),
        toDate: moment(item.toDate),
      }));

      setAllVisibleLeaves(mappedLeaves);
    } catch (err: any) {
      // Type 'any' for error to catch various error types
      console.error("Failed to fetch visible leaves:", err);
      showSnackbar(err.message || "Failed to fetch leaves!", "error");
      setError(err.message || "Failed to load leaves.");
      setAllVisibleLeaves([]);
    } finally {
      setLoading(false);
    }
  }, [useGql, showSnackbar]); // `weekDays` removed from dependencies as its calculation is now 'stable' relative to `today`

  // --- useEffect to trigger the single API call ---
  useEffect(() => {
    getVisibleLeaves();
  }, [getVisibleLeaves]);

  // Helper to filter `allVisibleLeaves` for dots on a specific date
  const getLeavesForDateDots = useCallback(
    (date) => {
      // useCallback for helper too
      return allVisibleLeaves.filter((leave) =>
        date.isBetween(
          leave.date.startOf("day"),
          leave.toDate.endOf("day"),
          null,
          "[]"
        )
      );
    },
    [allVisibleLeaves]
  ); // Depends on `allVisibleLeaves`

  // Helper to filter `allVisibleLeaves` for the detailed list of the selected day
  const getLeavesForSelectedDayList = useCallback(
    (date) => {
      // useCallback for helper too
      return allVisibleLeaves.filter((leave) =>
        date.isBetween(
          leave.date.startOf("day"),
          leave.toDate.endOf("day"),
          null,
          "[]"
        )
      );
    },
    [allVisibleLeaves]
  ); // Depends on `allVisibleLeaves`

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const leavesForList = getLeavesForSelectedDayList(selectedDate);

  const OnClickLeaveWidget = () => {
    navigate("/staff-leave/calender");
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, background: "#fff" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box 
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            👨‍✈️ Staff Leave Calendar
          </Typography>
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            {selectedDate.format("MMMM D, YYYY")}{" "}
            {/* Display selectedDate, not today */}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1} gap={1} >
        {weekDays.map((date, index) => {
          const isToday = date.isSame(today, "day");
          const isSelected = date.isSame(selectedDate, "day");
          const leavesOnDayDots = getLeavesForDateDots(date);

          return (
            <Box className="leave-format"
              key={index}
              onClick={() => handleDayClick(date)}
              sx={{
                backgroundColor: isSelected
                  ? "#001551"
                  : isToday
                    ? "#e0f2f7" // Different color for today if not selected
                    : "#f5f5f5", // Default background
                   color: isSelected
                    ? "#fff"
                    : "#000",
                    
                   
                  
                borderRadius: 2,
                minWidth: 40,
                height: 40,
                px: 1,
                py: 0.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 0 2px #001551" : "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: isSelected ? "#001551cd" : "#e0e0e0",
                },
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ fontSize: "0.65rem", lineHeight: 1 }}
              >
                {date.format("ddd")}
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.75rem", fontWeight: 500, lineHeight: 1 }}
              >
                {date.format("D")}
              </Typography>
              <Box display="flex" justifyContent="center" gap={0.3}>
                {loading ? (
                  <CircularProgress size={6} sx={{ color: "text.secondary" }} />
                ) : error ? (
                  <FiberManualRecordIcon
                    fontSize="inherit"
                    sx={{ color: "error.main", fontSize: 6 }}
                  />
                ) : (
                  leavesOnDayDots.map(
                    (
                      leave // Removed 'i' as key if 'leave.id' is available
                    ) => (
                      <FiberManualRecordIcon
                        key={leave.id} // Use unique ID from leave object for key
                        fontSize="inherit"
                        sx={{
                          color: leaveColors[leave.leaveType],
                          fontSize: 6,
                        }}
                      />
                    )
                  )
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ minHeight: 150 }} onClick={OnClickLeaveWidget}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={100}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" ml={1} color="text.secondary">
              Loading leaves for {selectedDate.format("MMM D")}...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : leavesForList.length > 0 ? (
          <Fade in={!loading}>
            <Box>
              {leavesForList.map((leave, i) => {
                return (
                  <Box
                    key={leave.id}
                    display="flex"
                    alignItems="flex-start"
                    position="relative"
                    mb={1}
                  >
                    {/* Timeline Dot */}
                    <Box
                      sx={{
                        width: 20,
                        display: "flex",
                        justifyContent: "center",
                        mt: "5px",
                      }}
                    >
                      <CircleIcon fontSize="small" sx={{ color: "#90a4ae" }} />
                    </Box>

                    {i < leavesForList.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 9,
                          top: 20,
                          bottom: -10,
                          width: 2,
                          backgroundColor: "#e0e0e0",
                          zIndex: 0,
                        }}
                      ></Box>
                    )}

                    <Box flex={1} ml={2}>
                      <Box
                        sx={{
                          backgroundColor: `${leaveColors[leave.leaveType]}20`,
                          borderLeft: `4px solid ${leaveColors[leave.leaveType]}`,
                          borderRadius: 2,
                          p: 1,
                          mb: 1,
                        }}
                      >
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="caption" fontWeight={600}>
                            {`${leave.staffName || "N/A"}(${moment(leave.date).format("Do")}-${moment(leave.toDate).format("Do")})`}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: leaveColors[leave.leaveType] }}
                          >
                            {/* {leave.leaveType} Leave */}
                            {LeaveType[leave.leaveType]}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Fade>
        ) : (
          <Typography
            variant="caption"
            align="center"
            display="block"
            color="text.disabled"
            sx={{ mt: 2 }}
          >
            No leaves for {selectedDate.format("MMM D")}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
