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
import UserCreate from "./create";
import useGql from "../../lib/graphql/gql";
import { GET_ROLES } from "../../lib/graphql/queries/role";
import { GET_USERS } from "../../lib/graphql/queries/users";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "9123456789" },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "9988776655",
  },
];

const UserList: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const getUsers = async () => {
    try {
      const data = await useGql({
        query: GET_USERS,
        queryName: "users",
        queryType: "query",
        variables: {},
      });
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
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
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <UserCreate />
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
