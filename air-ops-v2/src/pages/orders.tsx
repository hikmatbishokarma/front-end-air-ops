{
  /* Left Form */
}
{
  /* <div style={{ flex: 0.5, padding: "5px 0px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "18px" }}>Requested by:</span>
                <TextField
                  select
                  defaultValue="Option 1"
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="John">John</MenuItem>
                </TextField>
                <IconButton onClick={handleSubDialogOpen}>
                  <AddIcon />
                </IconButton>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <span style={{ marginRight: "8px" }}>Representative:</span>
                <TextField
                  select
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="Smith">Smith</MenuItem>
                </TextField>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <span style={{ marginRight: "16px" }}>Min. Category:</span>
                <TextField
                  select
                  defaultValue=""
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                </TextField>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <span style={{ marginRight: "65.5px" }}>Aircraft:</span>
                <TextField
                  variant="outlined"
                  size="small"
                  style={{ width: "40%" }} // Set the width to 30%
                  InputProps={{
                    style: { padding: "0", height: "30px" },
                  }}
                ></TextField>
              </div>

              <Autocomplete
                disablePortal
                options={aircraftCategories}
                getOptionLabel={(option) => `${option.name}`}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Min. Category" />
                )}
                onChange={(e, value) => setSelectedAircraftCategory(value)}
              />

              <Autocomplete
                disablePortal
                options={aircrafts}
                getOptionLabel={(option) => `${option.name}`}
                sx={{ width: 300 }}
                renderOption={(props, option) => (
                  <li
                    {...props}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span>{`${option.category.name}`}</span>
                    <span style={{ fontWeight: "bold" }}>{option.name}</span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Aircraft" />
                )}
              />

              <Button variant="contained" color="primary">
                One Way or Multi Leg
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginLeft: "10px" }}
              >
                Round Trip
              </Button>

          
              <div style={{ marginTop: "20px" }}>
                <div className="heading-table">
                  <span>ADEP</span>
                  <span>ADES</span>
                  <span>TBA</span>
                  <span> &nbsp; &nbsp; </span>
                  <span>Date LT</span>
                  <span>Time LT</span>
                  <span>PAX</span>
                </div>
                {rows.map((row) => (
                  <div
                    key={row.id}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                   
                    <AirportsAutocomplete label="ADEP" />
                    <AirportsAutocomplete label="ADES" />
                   
                    <TextField
                      size="small"
                      style={{ width: "10%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.TBA}
                      onChange={(e) =>
                        handleInputChange(row.id, "TBA", e.target.value)
                      }
                    />
                    <TextField
                      select
                      defaultValue=""
                      variant="outlined"
                      size="small"
                      style={{ width: "40%", marginTop: "8px" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                    >
                      <MenuItem value="">---</MenuItem>
                      <MenuItem value="A">A</MenuItem>
                    </TextField>
                    <TextField
                      size="small"
                      style={{ width: "35%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.dateLT}
                      onChange={(e) =>
                        handleInputChange(row.id, "dateLT", e.target.value)
                      }
                    />
                    <TextField
                      size="small"
                      style={{ width: "35%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.timeLT}
                      onChange={(e) =>
                        handleInputChange(row.id, "timeLT", e.target.value)
                      }
                    />
                    <TextField
                      size="small"
                      style={{ width: "35%" }} // Set the width to 30%
                      InputProps={{
                        style: { padding: "0", height: "30px" },
                      }}
                      margin="normal"
                      value={row.PAX}
                      onChange={(e) =>
                        handleInputChange(row.id, "PAX", e.target.value)
                      }
                    />
                    <IconButton
                      onClick={() => handleDeleteRow(row.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  style={{ marginTop: "10px" }}
                >
                  Add Row
                </Button>
              </div>
            </div> */
}

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function OrdersPage() {
  const [open, setOpen] = React.useState(false);

  // Initial rows with demo data
  const [rows, setRows] = React.useState([
    {
      city: "New York",
      airportName: "John F. Kennedy International Airport",
      iataCode: "JFK",
    },
    {
      city: "Los Angeles",
      airportName: "Los Angeles International Airport",
      iataCode: "LAX",
    },
    {
      city: "Chicago",
      airportName: "O’Hare International Airport",
      iataCode: "ORD",
    },
  ]);

  const [formData, setFormData] = React.useState({
    city: "",
    airportName: "",
    iataCode: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ city: "", airportName: "", iataCode: "" }); // Reset form data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setRows((prev) => [...prev, formData]);
    handleClose();
  };

  return (
    <div>
      {/* Table Section */}
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h6">Airports</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add +
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>City</TableCell>
                <TableCell>Airport Name</TableCell>
                <TableCell>IATA Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.airportName}</TableCell>
                  <TableCell>{row.iataCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Airport</DialogTitle>
        <DialogContent>
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Airport Name"
            name="airportName"
            value={formData.airportName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="IATA Code"
            name="iataCode"
            value={formData.iataCode}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
