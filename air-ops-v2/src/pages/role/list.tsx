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
} from "@mui/material";

import { GET_ROLES } from "../../lib/graphql/queries/role";
import useGql from "../../lib/graphql/gql";
import RoleCreate from "./create";
import { NAVIGATION } from "../../App";

import { TextField, Container, Typography, MenuItem, Grid, Avatar, Card, CardContent, } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatIcon from "@mui/icons-material/Chat";
// const roles = [
//   {
//     id: "67b0b5455366fdf6aee04554",
//     roleType: "USER",
//     name: "User",
//     accessPermission: [
//       {
//         action: ["READ"],
//         resource: "dashboard",
//       },
//     ],
//   },
//   {
//     id: "67b0b5da5366fdf6aee04559",
//     roleType: "ADMIN",
//     name: "Admin",
//     accessPermission: [
//       {
//         action: ["READ", "CREATE"],
//         resource: "dashboard",
//       },
//       {
//         action: ["READ", "CREATE"],
//         resource: "query",
//       },
//       {
//         action: ["READ", "CREATE"],
//         resource: "ops",
//       },
//     ],
//   },
// ];

const checkPermission = (actions, permission) =>
  actions.includes(permission) ? "✅" : "❌";

const RoleList = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const getRoles = async () => {
    try {
      const data = await useGql({
        query: GET_ROLES,
        queryName: "roles",
        queryType: "query",
        variables: {},
      });
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);








  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    number: "",
    city:"",
    zip:""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
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
                <TableRow key={`${role.id}-${perm.resource}`}>
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
              )),
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
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <RoleCreate />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{  display: 'flex', justifyContent:"space-between" }}>
        <div className="leftSide">
        <Card sx={{ maxWidth: 780, borderRadius: 3, boxShadow: 3, padding:'20px' }}>
          <h2>General information</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <label htmlFor="First Name">First Name</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Last Name">Last Name</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Birthday">Birthday</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  type="date"
                  name="birthday"
                  InputLabelProps={{ shrink: true }}
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Gender">Gender</label>
                <TextField
                  fullWidth
                  select
                   variant="outlined"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Email">Email</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <label htmlFor="Phone">Phone</label>
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <h2>Address</h2>
              </Grid>
              <Grid item xs={10}>
                <label htmlFor="Address">Address</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  type="address"
                  name="address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={2}>
                <label htmlFor="Number">Number</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  type="number"
                  name="number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <label htmlFor="City">City</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  type="city"
                  name="city"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <label htmlFor="ZIP">ZIP</label>
                <TextField
                  fullWidth
                   variant="outlined"
                  type="zip"
                  name="zip"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
              Save All
            </Button>
          </form>
          </Card>
        </div>
        <div className="rightSide">
          <Card sx={{ maxWidth: 350, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
            <Box
              sx={{
                backgroundImage: "url(https://source.unsplash.com/random)",
                height: 100,
                backgroundSize: "cover",
              }}
            />
            <Avatar
              src="https://source.unsplash.com/100x100/?portrait"
              sx={{ width: 80, height: 80, margin: "-40px auto 10px", border: "4px solid white" }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                admin
              </Typography>
              <Typography variant="body2" color="text.secondary">
                imankarimi.mail@gmail.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New York, USA
              </Typography>
              <Box mt={2} display="flex" justifyContent="center" gap={1}>
                <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}>
                  Connect
                </Button>
                <Button variant="contained" sx={{ backgroundColor: "#f4a261" }} startIcon={<ChatIcon />}>
                  Send Message
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>




    </>
  );
};

export default RoleList;
