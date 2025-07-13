import { useEffect, useState } from "react";
import LeaveFilters from "./LeaveFilter";
import LeaveRequestTable from "./LeaveRequestTable";
import LeaveSummary from "./LeaveSummary";
import useGql from "../../lib/graphql/gql";
import { CREATE_LEAVE, GET_LEAVES } from "../../lib/graphql/queries/leave";
import { useSession } from "../../SessionContext";
import { useSnackbar } from "../../SnackbarContext";
import { Box, Button, Typography } from "@mui/material";
import LeaveFormDrawer from "../../components/LeaveFormDrawer";
import { LeaveStatus, LeaveType } from "../../lib/utils";

export const LeaveRequest = () => {
  const showSnackbar = useSnackbar();
  const { session, setSession } = useSession();

  const operatorId = session?.user.operator?.id || null;
  const userId = session?.user?.id || null;

  const [filters, setFilters] = useState({ type: "", status: "" });
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
            ...(filters?.type &&
              filters?.type !== "ALL" && { type: { eq: filters.type } }),
            ...(filters?.status &&
              filters?.status !== "ALL" && {
                status: { eq: filters.status },
              }),
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
  }, [filters]);

  const createLeaveRequest = async (formData) => {
    try {
      const data = await useGql({
        query: CREATE_LEAVE,
        queryName: "",
        queryType: "mutation",
        variables: {
          input: {
            leave: formData,
          },
        },
      });

      if (data?.errors?.length > 0) {
        showSnackbar("Failed To Create Leave!", "error");
      } else showSnackbar("Created new Leave!", "success");
    } catch (error) {
      showSnackbar(error?.message || "Failed To Create Leave!", "error");
    }
  };

  const handelLeaveRequest = async (formData) => {
    formData = { ...formData, crew: userId };
    await createLeaveRequest(formData);
    handleCloseDrawer();
    await getLeaves();
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Leave</Typography>
        <Button variant="contained" onClick={handleOpenDrawer}>
          Apply Leave
        </Button>
      </Box>
      <LeaveSummary
        data={[
          { type: "Casual", used: 2, total: 12 },
          { type: "Sick", used: 1, total: 8 },
          { type: "Privilege", used: 5, total: 15 },
          { type: "Paternity", used: 0, total: 1 },
          { type: "Bereavement", used: 0, total: 1 },
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
