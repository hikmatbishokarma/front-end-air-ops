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
} from "@mui/material";
import moment from "moment";
import { LeaveType } from "../../lib/utils";

const statusColorMap = {
  PENDING: "warning",
  APPROVED: "success",
  DECLINED: "error",
  CANCELLED: "default",
} as const;

const LeaveRequestTable = ({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}) => {
  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Leave Type</TableCell>
            <TableCell>From Date</TableCell>
            <TableCell>To Date</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Submitted On</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{LeaveType[row.type]}</TableCell>
              <TableCell>{moment(row.fromDate).format("DD-MM-YYYY")}</TableCell>
              <TableCell>{moment(row.toDate).format("DD-MM-YYYY")}</TableCell>
              <TableCell>{row.reason}</TableCell>
              <TableCell>
                {moment(row.createdAt).format("DD-MM-YYYY")}
              </TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  color={
                    statusColorMap[row.status as keyof typeof statusColorMap] ||
                    "default"
                  }
                  size="small"
                />
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
    </>
  );
};

export default LeaveRequestTable;
