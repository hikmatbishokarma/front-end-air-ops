// import { Container } from "@mui/material";
// import { TripRow } from "../trip/components/crew-trip/TripGroup";

// export const CrewDocumentsOpsPage = ({ filter, refreshKey }: any) => {
//   const mockCrewDocsData = [
//     {
//       tripId: "25110101",
//       quotationNo: "AOQT/25/0080",
//       quotation: {
//         id: "6905860c5810f379c3e735da",
//         category: "CHARTER",
//         aircraft: {
//           code: "VATAAQ",
//           name: "Helicopter",
//         },
//       },
//       createdAt: "2025-11-01T04:02:42.847Z",
//       sectors: [
//         {
//           _id: "sec-1",
//           sectorNo: 1,
//           source: { code: "VOHS", city: "Hyderabad" },
//           destination: { code: "VIDP", city: "Delhi" },
//           depatureTime: "09:30",
//           arrivalTime: "11:00",
//           crewDocuments: [
//             {
//               _id: "doc-1",
//               name: "Fuel Slip.pdf",
//               url: "https://example.com/fuel-slip.pdf",
//               type: "pre",
//               uploadedAt: "2025-11-02T09:12:00Z",
//               uploadedBy: {
//                 name: "Capt. Arjun",
//                 role: "PILOT",
//                 profileImage: null,
//               },
//             },
//             {
//               _id: "doc-2",
//               name: "Manifest.jpeg",
//               url: "https://example.com/manifest.jpg",
//               type: "post",
//               uploadedAt: "2025-11-02T11:04:00Z",
//               uploadedBy: {
//                 name: "John Singh",
//                 role: "CABIN_CREW",
//                 profileImage: "https://i.pravatar.cc/100?img=12",
//               },
//             },
//           ],
//         },
//         {
//           _id: "sec-2",
//           sectorNo: 2,
//           source: { code: "VIDP", city: "Delhi" },
//           destination: { code: "VOBL", city: "Bengaluru" },
//           depatureTime: "12:00",
//           arrivalTime: "13:20",
//           crewDocuments: [], // no docs yet
//         },
//       ],
//     },

//     {
//       tripId: "25110102",
//       quotationNo: "AOQT/25/0081",
//       sectors: [
//         {
//           _id: "sec-3",
//           sectorNo: 1,
//           source: { code: "VABB", city: "Mumbai" },
//           destination: { code: "VOGO", city: "Goa" },
//           depatureTime: "14:20",
//           arrivalTime: "15:35",
//           crewDocuments: [
//             {
//               _id: "doc-3",
//               name: "Weight & Balance.pdf",
//               url: "https://example.com/wb.pdf",
//               type: "pre",
//               uploadedAt: "2025-11-02T13:50:00Z",
//               uploadedBy: {
//                 name: "Capt. Rohan",
//                 role: "PILOT",
//                 profileImage: "https://i.pravatar.cc/100?img=7",
//               },
//             },
//           ],
//         },
//       ],
//     },
//   ];

//   console.log("hjjhjh");

//   return (
//     <Container sx={{ py: 3 }}>
//       {mockCrewDocsData.map((trip) => (
//         <TripRow key={trip.tripId} trip={trip} />
//       ))}
//     </Container>
//   );
// };

import { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Box,
  TableContainer,
  Paper,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { SectorRow } from "../trip/components/crew-trip/SectorRow";
import { useCrewTripData } from "../hooks/useOpsQueries";

export const CrewTripList = ({ filter, refreshKey }: any) => {
  const [openTripIds, setOpenTripIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { crewTripList, crewTripTotalCount } = useCrewTripData({
    filter,
    page,
    rowsPerPage,
  });

  // Reset to first page when filter or refreshKey changes
  useEffect(() => {
    setPage(0);
  }, [filter, refreshKey]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleTrip = (tripId: string) => {
    setOpenTripIds((prev) =>
      prev.includes(tripId)
        ? prev.filter((id) => id !== tripId)
        : [...prev, tripId]
    );
  };

  if (!crewTripList) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} className="dash-table crew-table-v1">
      <Table>
        <TableHead sx={{ background: "#F3F4F6" }}>
          <TableRow>
            <TableCell>
              <b>Trip ID</b>
            </TableCell>
            <TableCell>
              <b>Quotation No</b>
            </TableCell>
            <TableCell>
              <b>Aircraft</b>
            </TableCell>
            <TableCell>
              <b>Category</b>
            </TableCell>
            <TableCell>
              <b>Created At</b>
            </TableCell>
            <TableCell align="center">
              <b>Expand</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {crewTripList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No crew trips found.
              </TableCell>
            </TableRow>
          ) : (
            crewTripList.map((trip) => {
              const open = openTripIds.includes(trip.tripId);
              const aircraftName = trip.quotation?.aircraft?.name ?? "-";
              const aircraftCode = trip.quotation?.aircraft?.code ?? "-";

              return (
                <>
                  {/* Trip Row */}
                  <TableRow key={trip.tripId}>
                    <TableCell>{trip.tripId}</TableCell>
                    <TableCell>{trip.quotationNo}</TableCell>
                    <TableCell>
                      {aircraftName} ({aircraftCode})
                    </TableCell>
                    <TableCell>{trip.quotation?.category ?? "-"}</TableCell>
                    <TableCell>
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => toggleTrip(trip.tripId)}
                      >
                        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Collapsible Sectors */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Table size="small">
                            <TableBody>
                              {trip.sectors?.map((sector: any) => (
                                <SectorRow key={sector._id} sector={sector} />
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={crewTripTotalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
};

export default CrewTripList;
