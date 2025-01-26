// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function HomePage() {
  

//   return (    
//       <Typography>
//         Welcome to Toolpad Core!
//       </Typography>
//   );
// }
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'OPKD - KBGR',
    start: new Date(2025, 0, 20, 11, 0), // Jan 20, 2025, 11:00 AM
    end: new Date(2025, 0, 20, 19, 30), // Jan 20, 2025, 7:30 PM
  },
];

export default function DashboardPage() {
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [rows, setRows] = useState([
    { id: 1, ADEP: '', ADES: '', TBA: '', dateLT: '', timeLT: '', PAX: '' },
  ]);

  const handleMainDialogOpen = () => {
    setMainDialogOpen(true);
  };

  const handleMainDialogClose = () => {
    setMainDialogOpen(false);
  };

  const handleSubDialogOpen = () => {
    setSubDialogOpen(true);
  };

  const handleSubDialogClose = () => {
    setSubDialogOpen(false);
  };

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      ADEP: '',
      ADES: '',
      TBA: '',
      dateLT: '',
      timeLT: '',
      PAX: '',
    };
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button variant="contained" onClick={handleMainDialogOpen}>
        Add New Quote Request
      </Button>

      {/* Main Dialog */}
      <Dialog open={mainDialogOpen} onClose={handleMainDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle>Add New Quote Request</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Left Form */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Requested By"
                  fullWidth
                  margin="normal"
                  select
                  defaultValue=""
                >
                  <MenuItem value="">---</MenuItem>
                  <MenuItem value="John">John</MenuItem>
                </TextField>
                <IconButton onClick={handleSubDialogOpen}>
                  <AddIcon />
                </IconButton>
              </div>

              <TextField
                label="Representative"
                fullWidth
                margin="normal"
                select
                defaultValue=""
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value="Smith">Smith</MenuItem>
              </TextField>
              <TextField
                label="Min. Category"
                fullWidth
                margin="normal"
                select
                defaultValue=""
              >
                <MenuItem value="">---</MenuItem>
                <MenuItem value="A">A</MenuItem>
              </TextField>
              <TextField
                label="Aircraft"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Trip Type"
                fullWidth
                margin="normal"
                select
                defaultValue="Based on configuration"
              >
                <MenuItem value="Based on configuration">
                  Based on configuration
                </MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </TextField>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Add positionings automatically"
              />
              <TextField
                label="Flight Time"
                fullWidth
                margin="normal"
                select
                defaultValue="Historical Data"
              >
                <MenuItem value="Historical Data">Historical Data</MenuItem>
                <MenuItem value="Live Data">Live Data</MenuItem>
              </TextField>
              <Button variant="contained" color="primary">
                One Way or Multi Leg
              </Button>
              <Button variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
                Round Trip
              </Button>

              {/* Dynamic Rows */}
              <div style={{ marginTop: '20px' }}>
                {rows.map((row) => (
                  <div key={row.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <TextField
                      label="ADEP"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.ADEP}
                      onChange={(e) => handleInputChange(row.id, 'ADEP', e.target.value)}
                    />
                    <TextField
                      label="ADES"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.ADES}
                      onChange={(e) => handleInputChange(row.id, 'ADES', e.target.value)}
                    />
                    <TextField
                      label="TBA"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.TBA}
                      onChange={(e) => handleInputChange(row.id, 'TBA', e.target.value)}
                    />
                    <TextField
                      label="Date LT"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.dateLT}
                      onChange={(e) => handleInputChange(row.id, 'dateLT', e.target.value)}
                    />
                    <TextField
                      label="Time LT"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.timeLT}
                      onChange={(e) => handleInputChange(row.id, 'timeLT', e.target.value)}
                    />
                    <TextField
                      label="PAX"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.PAX}
                      onChange={(e) => handleInputChange(row.id, 'PAX', e.target.value)}
                    />
                    <IconButton onClick={() => handleDeleteRow(row.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddRow}
                  style={{ marginTop: '10px' }}
                >
                  Add Row
                </Button>
              </div>
            </div>

            {/* Right Calendar */}
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
              <Typography variant="h6" gutterBottom>
                Calendar
              </Typography>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400 }}
                defaultView="week"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMainDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleMainDialogClose} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub Dialog */}
      <Dialog open={subDialogOpen} onClose={handleSubDialogClose}>
        <DialogTitle>Add Requested By Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubDialogClose} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
