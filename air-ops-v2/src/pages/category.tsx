// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function OrdersPage() {

//   return (
//     <Typography>
//       Welcome to the Toolpad orders!
//     </Typography>
//   );
// }
import React, { useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

export default function Category() {
  // States for the left side
  const [categories, setCategories] = React.useState([
    "Electronics",
    "Furniture",
    "Clothing",
    "Books", // Demo category names
  ]);
  const [nameInput, setNameInput] = React.useState("");

  // States for the right side
  const [records, setRecords] = React.useState([
    { name: "John Doe", category: "Electronics" },
    { name: "Jane Smith", category: "Furniture" },
    { name: "Alice Johnson", category: "Clothing" }, // Demo data
  ]);
  const [nameField, setNameField] = React.useState("");
  const [categoryField, setCategoryField] = React.useState("");

  // Left Side: Handle Category Submission
  const handleCategorySubmit = () => {
    if (nameInput.trim() !== "") {
      setCategories((prev) => [...prev, nameInput.trim()]);
      setNameInput("");
    }
  };

  // Right Side: Handle Name & Category Record Submission
  const handleRecordSubmit = () => {
    if (nameField.trim() !== "" && categoryField.trim() !== "") {
      setRecords((prev) => [
        ...prev,
        { name: nameField.trim(), category: categoryField.trim() },
      ]);
      setNameField("");
      setCategoryField("");
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Grid container spacing={3}>
        {/* Left Side: Category Management */}
        <Grid item xs={4}>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Add Category
          </Typography>

          {/* Input Form for Category */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <TextField
              label="Category Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              fullWidth
              margin="normal"
              style={{ marginRight: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCategorySubmit}
            >
              Submit
            </Button>
          </div>

          {/* Category Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right Side: Name & Category Records */}
        <Grid item xs={8}>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Add Name and Category
          </Typography>

          {/* Input Form for Name and Category (Side by Side) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <TextField
              label="Name"
              value={nameField}
              onChange={(e) => setNameField(e.target.value)}
              fullWidth
              margin="normal"
              style={{ flex: 1 }}
            />
            <TextField
              label="Category Name"
              value={categoryField}
              onChange={(e) => setCategoryField(e.target.value)}
              fullWidth
              margin="normal"
              style={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRecordSubmit}
            >
              Submit
            </Button>
          </div>

          {/* Records Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <div style={{ border: "2px solid red", display: "flex" }}>
        <div className="left_inner">
          <h2>React Hooks Form</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Message:
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">Save</button>
          </form>
        </div>
        <div className="right_inner"></div>
      </div>
    </div>
  );
}
