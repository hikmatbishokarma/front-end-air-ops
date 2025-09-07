// LeaveRequestTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TableContainer,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import moment from "moment";
import { LeaveType } from "../../../lib/utils";
import { useSnackbar } from "../../../SnackbarContext";
import { useSession } from "../../../SessionContext";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import useGql from "../../../lib/graphql/gql";
import { UPDATE_LEAVE_REQUEST } from "../../../lib/graphql/queries/leave";
import LeaveFilters from "../../leave/LeaveFilter";

const statusColorMap = {
  PENDING: "warning",
  APPROVED: "success",
  DECLINED: "error",
  CANCELLED: "default",
} as const;

const LeaveApprovalRequestTable = ({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  refreshList,
  filters,
  onChange,
}: {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  refreshList: () => void;
  filters: { type: string; status: string };
  onChange: (updated: { type: string; status: string }) => void;
}) => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const result = await useGql({
        query: UPDATE_LEAVE_REQUEST,
        queryName: "",
        queryType: "mutation",
        variables: {
          where: {
            id: id,
          },
          data: {
            status: newStatus,
          },
        },
      });

      if (!result?.data || result?.errors) {
        showSnackbar(result?.errors?.[0]?.message, "error");
      } else {
        showSnackbar(
          `Leave ${newStatus.toLowerCase()} successfully`,
          "success"
        );
      }
      // await getLeaves(); // Refresh the list
    } catch (error) {
      showSnackbar("Failed to update status", "error");
      console.error(error);
    } finally {
      refreshList();
    }
  };

  return (
    <>
      <Box sx={{ mt: 3, mb: 1 }} className="crew_leave_type1">
        <LeaveFilters filters={filters} onChange={onChange} />
      </Box>
      <TableContainer component={Paper} className="dash-table  ">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Submitted On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {row?.crew?.fullName || row?.crew?.displayName}
                </TableCell>
                <TableCell>{LeaveType[row.type]}</TableCell>
                <TableCell>
                  {moment(row.fromDate).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{moment(row.toDate).format("DD-MM-YYYY")}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>
                  {moment(row.createdAt).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={
                      statusColorMap[
                        row.status as keyof typeof statusColorMap
                      ] || "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleUpdateStatus(row.id, "APPROVED")}
                    color="success"
                  >
                    <CheckCircleOutlineOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleUpdateStatus(row.id, "DECLINED")}
                    color="error"
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) =>
            onPageSizeChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
    </>
  );
};

export default LeaveApprovalRequestTable;
