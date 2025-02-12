// import * as React from 'react';
// import Typography from '@mui/material/Typography';

// export default function HomePage() {

//   return (
//       <Typography>
//         Welcome to Toolpad Core!
//       </Typography>
//   );
// }
import React, { useEffect, useState } from "react";
import banner from "../Asset/Images/dash_banner.png";
import level from "../Asset/Images/level.png";

export default function DashboardPage() {

  return (
     <div className="dashboard_main_d">
      <div className="ban_img">
        <img src={banner} alt="" />
      </div>
      <div className="heading">
        <div className="name">
          <h2>Hello</h2>
          <p>We are on a mission to help developers like you build successful projects for FREE.</p>
        </div>
      </div>

      <div className="graphTotal">
        <div className="boxes">
          <div className="level">
            <img src={level} alt="" />
          </div>
          <div className="text">
            <p>Total Sales</p>
            <h5>$560K</h5>
          </div>
        </div>
        <div className="boxes">
          <div className="level">
            <img src={level} alt="" />
          </div>
          <div className="text">
            <p>Total Sales</p>
            <h5>$560K</h5>
          </div>
        </div>
        <div className="boxes">
          <div className="level">
            <img src={level} alt="" />
          </div>
          <div className="text">
            <p>Total Sales</p>
            <h5>$560K</h5>
          </div>
        </div>
        <div className="boxes">
          <div className="level">
            <img src={level} alt="" />
          </div>
          <div className="text">
            <p>Total Sales</p>
            <h5>$560K</h5>
          </div>
        </div>
        
      </div>
     </div>
  );
}
