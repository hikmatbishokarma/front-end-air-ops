import React, { useEffect, useState } from "react";
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import useGql from "../../lib/graphql/gql";
import { GET_ROLES } from "../../lib/graphql/queries/role";
import { GET_USERS } from "../../lib/graphql/queries/user";
import UserCreate from "./create";
import { useSession } from "../../SessionContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const UserList: React.FC = () => {
  const { session, setSession, loading } = useSession();

  const agentId = session?.user.agent?.id || null;

  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const getUsers = async () => {
    try {
      const data = await useGql({
        query: GET_USERS,
        queryName: "users",
        queryType: "query",
        variables: { filter: { agentId: { eq: agentId } } },
      });
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Function to refresh category list
  const refreshList = async () => {
    // Fetch updated categories from API
    await getUsers();
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
          Create User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {user?.roles.length &&
                    user?.roles?.map((role) => role?.name)?.join(",")}
                </TableCell>
                <TableCell>{user?.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <UserCreate onClose={handleClose} refreshList={refreshList} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
