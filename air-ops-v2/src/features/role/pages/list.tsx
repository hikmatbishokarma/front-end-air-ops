import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  IconButton,
  TablePagination,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { GET_ROLES } from "@/lib/graphql/queries/role";
import useGql from "@/lib/graphql/gql";
import RoleCreate from "./create";

import { Outlet, useNavigate } from "react-router";
import { useSession } from "@/app/providers";
import CloseIcon from "@mui/icons-material/Close";

const checkPermission = (actions: string[], permission: string) =>
  actions.includes(permission) ? "✅" : "❌";

const RoleList = () => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [rows, setRows] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [openRoleIds, setOpenRoleIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleOpen = () => setOpen(true);
  const navigate = useNavigate();

  const getRoles = useCallback(async () => {
    try {
      const result = await useGql({
        query: GET_ROLES,
        queryName: "roles",
        queryType: "query-with-count",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
          paging: {
            offset: page * rowsPerPage,
            limit: rowsPerPage,
          },
          sorting: [{ field: "createdAt", direction: "DESC" }],
        },
      });
      setTotalCount(result?.totalCount || 0);
      setRows(result?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
      setTotalCount(0);
    }
  }, [operatorId, page, rowsPerPage]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const toggleRole = (roleId: string) => {
    setOpenRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setOpenRoleIds([]); // Close all expanded rows when changing page
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setOpenRoleIds([]); // Close all expanded rows when changing page size
  };

  const handleClose = () => setOpen(false);

  // Function to refresh category list
  const refreshList = async () => {
    // Fetch updated categories from API
    await getRoles();
  };

  return (
    <>
      <Box clasName="admin_role_responsive" sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ marginBottom: 2 }}
        >
          Create Role
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Role Name</b>
              </TableCell>
              <TableCell align="center">
                <b>Expand</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((role) => {
                const isOpen = openRoleIds.includes(role.id);
                return (
                  <React.Fragment key={role.id}>
                    {/* Role Header Row */}
                    <TableRow
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onClick={() =>
                        navigate(`/app/admin/roles/edit/${role.id}`)
                      }
                    >
                      <TableCell>
                        <b>{role.type}</b>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRole(role.id);
                          }}
                        >
                          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Collapsible Permissions */}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ p: 0 }}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <b>Resource</b>
                                  </TableCell>
                                  <TableCell>
                                    <b>Create</b>
                                  </TableCell>
                                  <TableCell>
                                    <b>Read</b>
                                  </TableCell>
                                  <TableCell>
                                    <b>Update</b>
                                  </TableCell>
                                  <TableCell>
                                    <b>Delete</b>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {role.accessPermissions?.map((perm: any) => (
                                  <TableRow
                                    key={`${role.id}-${perm.resource}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/app/admin/roles/edit/${role.id}`
                                      );
                                    }}
                                    sx={{
                                      cursor: "pointer",
                                      "&:hover": { backgroundColor: "#fafafa" },
                                    }}
                                  >
                                    <TableCell>{perm.resource}</TableCell>
                                    <TableCell>
                                      {checkPermission(perm.action, "CREATE")}
                                    </TableCell>
                                    <TableCell>
                                      {checkPermission(perm.action, "READ")}
                                    </TableCell>
                                    <TableCell>
                                      {checkPermission(perm.action, "UPDATE")}
                                    </TableCell>
                                    <TableCell>
                                      {checkPermission(perm.action, "DELETE")}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
      <Dialog
        className="panel-one"
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Create New Role
          <IconButton
            className="popup-quote-model"
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon className="popup-close-panel" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <RoleCreate onClose={handleClose} refreshList={refreshList} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleList;
