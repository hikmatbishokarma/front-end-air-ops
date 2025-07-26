import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import { GET_ROLES } from "../../lib/graphql/queries/role";
import useGql from "../../lib/graphql/gql";
import RoleCreate from "./create";

import { Outlet, useNavigate } from "react-router";
import { useSession } from "../../SessionContext";
import CloseIcon from "@mui/icons-material/Close";

const checkPermission = (actions, permission) =>
  actions.includes(permission) ? "✅" : "❌";

const RoleList = () => {
  const { session, setSession, loading } = useSession();

  const operatorId = session?.user.operator?.id || null;

  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const navigate = useNavigate();

  const getRoles = async () => {
    try {
      const data = await useGql({
        query: GET_ROLES,
        queryName: "roles",
        queryType: "query",
        variables: {
          filter: {
            ...(operatorId && { operatorId: { eq: operatorId } }),
          },
        },
      });
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleClose = () => setOpen(false);

  // Function to refresh category list
  const refreshList = async () => {
    // Fetch updated categories from API
    await getRoles();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
            {rows.map((role, roleIndex) =>
              role.accessPermissions.map((perm, permIndex) => (
                <TableRow
                  key={`${role.id}-${perm.resource}`}
                  onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                >
                  {/* Only show role name for the first row of each role */}
                  {permIndex === 0 ? (
                    <TableCell rowSpan={role.accessPermissions.length}>
                      {role.name}
                    </TableCell>
                  ) : null}
                  <TableCell>{perm.resource}</TableCell>
                  <TableCell>
                    {checkPermission(perm.action, "CREATE")}
                  </TableCell>
                  <TableCell>{checkPermission(perm.action, "READ")}</TableCell>
                  <TableCell>
                    {checkPermission(perm.action, "UPDATE")}
                  </TableCell>
                  <TableCell>
                    {checkPermission(perm.action, "DELETE")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
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
