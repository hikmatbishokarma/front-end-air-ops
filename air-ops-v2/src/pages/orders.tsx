// import * as React from 'react';
// import Typography from '@mui/material/Typography';


// export default function OrdersPage() {
  

//   return (
//     <Typography>
//       Welcome to the Toolpad orders!
//     </Typography>
//   );
// }
import * as React from 'react';
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
} from '@mui/material';

export default function OrdersPage() {
  const [open, setOpen] = React.useState(false);

  // Initial rows with demo data
  const [rows, setRows] = React.useState([
    { city: 'New York', airportName: 'John F. Kennedy International Airport', iataCode: 'JFK' },
    { city: 'Los Angeles', airportName: 'Los Angeles International Airport', iataCode: 'LAX' },
    { city: 'Chicago', airportName: 'O’Hare International Airport', iataCode: 'ORD' },
  ]);

  const [formData, setFormData] = React.useState({
    city: '',
    airportName: '',
    iataCode: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ city: '', airportName: '', iataCode: '' }); // Reset form data
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
      <div style={{ marginTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
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
