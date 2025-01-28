// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function HomePage() {
  

//   return (    
//       <Typography>
//         Welcome to Toolpad Core!
//       </Typography>
//   );
// }
import React, { useEffect, useState } from 'react';
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
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import useGql from '../lib/graphql/gql';
import { GET_AIRPORTS } from '../lib/graphql/queries/airports';
import AirportsAutocomplete from '../components/airport-autocommplete';
import { GET_AIRCRAFT_CATEGORIES } from '../lib/graphql/queries/aircraft-categories';
import { Autocomplete } from '@mui/material';
import { GET_AIRCRAFT } from '../lib/graphql/queries/aircraft';


export const events =[
  {
      "title": "Conference",
      "start": "2025-01-25",
      "end": "2025-01-27"
  },
  {
      "title": "Meeting",
      "start": "2025-01-26T10:30:00+00:00",
      "end": "2025-01-26T12:30:00+00:00"
  },
  {
      "title": "Lunch",
      "start": "2025-01-26T12:00:00+00:00"
  },
  {
      "title": "Birthday Party",
      "start": "2025-01-27T07:00:00+00:00"
  },
  {
      "url": "http://google.com/",
      "title": "Click for Google",
      "start": "2025-01-28"
  }
];

interface AircraftCategory{
  id: string;
  name: string;
}

interface Aircraft{
  id: string;
  name: string;
  category: AircraftCategory;
}

export default function DashboardPage() {
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [aircraftCategories, setAircraftCategories] = useState<AircraftCategory[]>([]);
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [selectedAircraftCategory, setSelectedAircraftCategory] = useState<AircraftCategory | null>(null);

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

  const getAircraftCategories = async () => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT_CATEGORIES,
        queryName: "aircraftCategories",
        queryType: "query",
        variables: {},
      });
      setAircraftCategories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAircrafts = async (categoryId) => {
    try {
      const data = await useGql({
        query: GET_AIRCRAFT,
        queryName: "aircraft",
        queryType: "query",
        variables: categoryId? {sorting: [{
    "field":"category",
    "direction":"ASC"
  }]}:{},
      });
      setAircrafts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 console.log("selectedAircraftCategory", selectedAircraftCategory)

   useEffect( () => {
    getAircraftCategories();
    getAircrafts(null);
  },[])

  useEffect( () => {
    getAircrafts(selectedAircraftCategory?.id);
  },[selectedAircraftCategory])

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
              
              <Autocomplete
                disablePortal
               options={aircraftCategories}
                 getOptionLabel={(option) => `${option.name}`}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params}  label="Min. Category"/>}
                onChange={(e,value)=>setSelectedAircraftCategory(value)}
                        />

             
               <Autocomplete
                disablePortal
               options={aircrafts}
                 getOptionLabel={(option) => `${option.name}`}
                sx={{ width: 300 }}
                renderOption={(props, option) => (
                  <li {...props} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start"  }}>
                   
                    <span>{`${option.category.name}`}</span>
                    <span style={{ fontWeight: "bold" }}>{option.name}</span>
                  </li>
                )}
                renderInput={(params) => <TextField {...params}  label="Aircraft"/>}
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
                    {/* <TextField
                      label="ADEP"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.ADEP}
                      onChange={(e) => handleInputChange(row.id, 'ADEP', e.target.value)}
                    /> */}
                    <AirportsAutocomplete label="ADEP"/>
                    <AirportsAutocomplete label="ADES"/>
                    {/* <TextField
                      label="ADES"
                      margin="normal"
                      style={{ flex: 1 }}
                      value={row.ADES}
                      onChange={(e) => handleInputChange(row.id, 'ADES', e.target.value)}
                    /> */}
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

<FullCalendar
  plugins={[ dayGridPlugin,timeGridPlugin,listPlugin ]}
  initialView='dayGridMonth'
  headerToolbar={ {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
  }}
  events={events}
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
