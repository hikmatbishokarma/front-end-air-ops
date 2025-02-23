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
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailSent, setShowEmailSent] = useState(false);

  const handleReset = () => {
    console.log(`Reset link sent to: ${email}`);
    setShowEmailSent(true);
  };

  return (
    <>
      <div className="dashboard_main_d">
        <div className="ban_img">
          <img src={banner} alt="" />
        </div>
        <div className="heading">
          <div className="name">
            <h2>Hello</h2>
            <p> Welcome to Airops</p>
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
      <div>
        {/* Button to Open Modal */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Forgot Password?
        </Button>

        {/* Forgot Password Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            {/* Modal Header */}
            <Typography
              variant="h6"
              component="h2"
              textAlign="center"
              gutterBottom
            >
              Forgot your password?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Enter your email address and we’ll send you a link to reset your
              password.
            </Typography>

            {/* Email Input */}
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Buttons */}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Email Sent Confirmation Modal */}
        <Modal open={showEmailSent} onClose={() => setShowEmailSent(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <IconButton
              onClick={() => setShowEmailSent(false)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              Check in your mail!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We just emailed you with the instructions to reset your password.
            </Typography>

            <Typography variant="body2" sx={{ mt: 2 }}>
              For any questions, email us at
              <Typography
                component="span"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {" "}
                helpdesk@festicket.com
              </Typography>
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setShowEmailSent(false)}
            >
              OK
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}
