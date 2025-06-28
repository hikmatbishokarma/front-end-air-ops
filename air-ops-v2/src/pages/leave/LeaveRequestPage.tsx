import { useEffect, useState } from "react";
import LeaveFilters from "./LeaveFilter";
import LeaveRequestTable from "./LeaveRequestTable";
import LeaveSummary from "./LeaveSummary";
import useGql from "../../lib/graphql/gql";
import { GET_LEAVES } from "../../lib/graphql/queries/leave";
import { useSession } from "../../SessionContext";
import { useSnackbar } from "../../SnackbarContext";
import { Box, Button, Typography } from "@mui/material";
import LeaveFormDrawer from "../../components/LeaveFormDrawer";

export const LeaveRequest = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.agent?.id || null;

  const [filters, setFilters] = useState({ leaveType: "", status: "" });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [leaveList, setLeaveList] = useState<any>({ data: [], totalCount: 0 });

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  const getLeaves = async () => {
    try {
      const result = await useGql({
        query: GET_LEAVES,
        queryName: "leaves",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });

      if (!result.data) showSnackbar("Failed to fetch Manual!", "error");
      setLeaveList(result);
    } catch (error) {
      showSnackbar(error.message || "Failed to fetch Manual!", "error");
    }
  };

  useEffect(() => {
    getLeaves();
  }, []);

  const handelLeaveRequest = (formData) => {
    handleCloseDrawer();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Leave Management</Typography>
        <Button variant="contained" onClick={handleOpenDrawer}>
          Apply Leave
        </Button>
      </Box>
      <LeaveSummary
        data={[
          { type: "Casual", used: 2, total: 12 },
          { type: "Sick", used: 1, total: 8 },
          { type: "Privilege", used: 5, total: 15 },
          { type: "Marriage", used: 0, total: 1 },
        ]}
      />{" "}
      {/* top cards */}
      <LeaveFilters filters={filters} onChange={setFilters} />
      <LeaveRequestTable
        data={leaveList.data}
        total={leaveList.totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <LeaveFormDrawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        onSubmit={handelLeaveRequest}
      />
    </>
  );
};
