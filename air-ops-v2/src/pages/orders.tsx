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
import Typography from '@mui/material/Typography';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { events } from '.';

export default function OrdersPage() {
  return <FullCalendar
  plugins={[ dayGridPlugin,timeGridPlugin,listPlugin ]}
  initialView='dayGridMonth'
  headerToolbar={ {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay' // user can switch between the two
  }}
  events={events}
  />
  ;
}