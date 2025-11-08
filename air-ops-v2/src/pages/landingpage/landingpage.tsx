import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  CssBaseline,
  Menu,
  MenuItem,
  IconButton,
  Link,
  Stack,


} from "@mui/material";
import testld from "../../Asset/Images/landing-mb-1.png";
import testldtwo from "../../Asset/Images/landing-mb-2.png";
import testldthree from "../../Asset/Images/landing-mb-3.png";
import leftimgld from "../../Asset/Images/left-image-1.png";
import logopageld from "../../Asset/Images/ld-page-logo.png";

import MenuIcon from "@mui/icons-material/Menu";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import CheckIcon from '@mui/icons-material/Check';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import ConstructionIcon from '@mui/icons-material/Construction';
import LuggageIcon from '@mui/icons-material/Luggage';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import WidgetsIcon from '@mui/icons-material/Widgets';
import WindowIcon from '@mui/icons-material/Window';
import { LocationOn, Email, Phone } from "@mui/icons-material";
import LanguageIcon from '@mui/icons-material/Language';

const pages = ["Home", "About", "Modules", "Contact"];
const Landingpage = () => {
     const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


return (
    <>
     <AppBar position="static" color="primary" elevation={0} className="ld-header-page">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
                    <img
                            className="logo-page-lg"
                                  src={logopageld}
                                  alt="Company Logo"
                                
                                />
            </Typography>

            {/* Center Menu (Desktop) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {pages.map((page) => (
                <Button className="ld-page"
                  key={page}
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    "&:hover": { color: "secondary.main" },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* Right: Login */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  borderColor: "white",
                  "&:hover": { borderColor: "secondary.main", color: "secondary.main" },
                }}
              >
                Login
              </Button>
            </Box>

            {/* Mobile menu */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleMenuClose}>
                  <Typography>{page}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleMenuClose}>
                <Typography>Login</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>


      <Box className="ldbannerv1">
      <Container>
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
        >
          {/* ===== LEFT: TEXT ===== */}
          <Grid item xs={12} md={6}>
            <h1>
            Aviation Operations Made
            </h1>
            <p>
              Easy, Easier and Easiest
            </p>
           
          
    <Button className="getld">
          Get Started
        </Button>
          </Grid>

          {/* ===== RIGHT: IMAGE ===== */}
          <Grid item xs={12} md={6}>
            
               <img
                            className="banner-ld-flight"
                                  src={leftimgld}
                                  alt="Company Logo"
                                
                                />
    

              
            
          </Grid>
        </Grid>
      </Container>
    </Box>

      {/* ===== BANNER close ===== */}
    

      {/*===== content one====*/}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container>
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
        >
          {/* ===== LEFT: TEXT ===== */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom className="manin-lg-page-hd">
             Why Airops
            </Typography>
            <p>
              AIROPS – Built by Aviators, for Aviators
            </p>
            <p>
              Material UI provides a powerful and flexible React component
              library for building elegant, responsive, and accessible web
              applications faster than ever before.
            </p>
            <p>
             Addressing Everyday Challenges Aviation professionals encounter numerous 
             operational challenges—from managing complex flight schedules and handling 
             last-minute changes to ensuring regulatory compliance and streamlining communication 
             across teams. AIROPS recognizes these pain points and provides tools designed to:


            </p>
           <ul className="landingpage-view-1">
  <li>
    <AirplanemodeActiveIcon className="ldicon-1"/>
    <div>
      <h5>Enhance efficiency</h5>
      <p>in flight planning and crew management.</p>
    </div>
  </li>
  <li>
   <AirplanemodeActiveIcon className="ldicon-1"/>
    <div>
      <h5>Improve communication</h5>
      <p>between flight crews and ground operations.</p>
    </div>
  </li>
  <li>
    <AirplanemodeActiveIcon className="ldicon-1"/>
    <div>
      <h5>Simplify administrative tasks</h5>
      <p>reducing paperwork and manual processes.</p>
    </div>
  </li>
</ul>
          </Grid>

          {/* ===== RIGHT: IMAGE ===== */}
          <Grid item xs={12} md={6}>
            
               <img
                            className="lading-mb-1"
                                  src={testld}
                                  alt="Company Logo"
                                
                                />
    

              
            
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/*===== content two====*/}
     <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container>
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
        >
          {/* ===== LEFT: TEXT ===== */}
    

          {/* ===== RIGHT: content ===== */}
          <Grid item xs={12} md={6}>
            
               <img
                            className="lading-mb-1"
                                  src={testldtwo}
                                  alt="Company Logo"
                                
                                />
    

              
            
          </Grid>

                <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom className="manin-lg-page-hd">
            Our Mission
            </Typography>
            <p>
              Our mission is to simplify routine tasks, streamline operational processes, and enhance efficiency across the board.
            </p>
           
           <ul className="landingpage-view-2">
  <li>
    <CheckIcon className="ldicon-2"/>
    <div>
      
      <p> By reducing time spent on repetitive administrative work.</p>
    </div>
  </li>
  <li>
   <CheckIcon className="ldicon-2"/>
    <div>
      
      <p>Empowers aviators to focus on what truly matters—flying safely.</p>
    </div>
  </li>
  <li>
    <CheckIcon className="ldicon-2"/>
    <div>
    
      <p>Managing critical operations, and enjoying their profession with less stress.</p>
    </div>
  </li>
</ul>
          </Grid>
        </Grid>
      </Container>
    </Box>


      {/*===== content three====*/}
      <Box sx={{ py: 10, bgcolor: "background.default" }}>
      <Container>
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
        >
          {/* ===== LEFT: TEXT ===== */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom className="manin-lg-page-hd">
             Smooth Operations
            </Typography>
            <p>
             When operations run smoothly, productivity soars. With AIROPS, 
             teams can stay organized, make informed decisions quickly, 
             and experience a noticeable improvement in workflow quality.
            </p>
            <p>
             We understand the unique demands of aviation because we’ve lived them. 
             Whether it's flight planning, crew scheduling, maintenance tracking, or
              regulatory compliance—AIROPS is your trusted co-pilot in managing it all.

            </p>
            <p>
            Our Promise: One platform. Every solution. Built around your needs.



            </p>

          </Grid>

          {/* ===== RIGHT: IMAGE ===== */}
          <Grid item xs={12} md={6}>
            
               <img
                            className="lading-mb-1"
                                  src={testldthree}
                                  alt="Company Logo"
                                
                                />
    

              
            
          </Grid>
        </Grid>
      </Container>
    </Box>
{/*===== content====*/}
<Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom className="manin-lg-page-hd"
        >
       Modules
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          mb={6}
        >
          "We have integrated the majority of essential modules commonly 
          used in aviation operations to streamline and enhance overall efficiency."


        </Typography>

        <Grid container spacing={4} className="landingpage_animation">
          
            <Grid item xs={12} md={4} >
              <Box className="card-landingpage position-relative"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <ArticleIcon className="ld-v1-iocn"/>
                </div>
                <h5>
                  Sales Quotes
                </h5>
                <p>Easily create quotations and invoices while tracking 
                    all your revenue and generating comprehensive reports.</p>
              </Box>
            </Grid>
            {/*===== card one closed====*/}

               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >

             <div className="left-data-1">
                    <SettingsSuggestIcon className="ld-v2-iocn"/>
                </div>
                <h5>
                  Operations
                </h5>
                <p>Experience seamless and precise aviation operations like never 
                    before with this powerful tool.</p>
              </Box>
            </Grid>
  {/*===== card two closed====*/}
               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <VerifiedUserIcon className="ld-v3-iocn"/>
                </div>
                <h5>
                  Security
                </h5>
                <p>This tool enhances aviation security through streamlined, technology-driven processes.</p>
              </Box>
            </Grid>
          {/*===== card three closed====*/}
           <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <SpeakerNotesIcon  className="ld-v4-iocn"/>
                </div>
                <h5>
                  Camo
                </h5>
<p>Manage airworthiness more efficiently—our tool supports CAMO operations with precision and ease.</p>              </Box>
            </Grid>
             {/*===== card four closed====*/}

               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <ConstructionIcon  className="ld-v5-iocn"/>
                </div>
                <h5>
                  Engineering
                </h5>
<p>Empower your engineering team with real-time data, maintenance tracking, and seamless integration.</p>              </Box>
            </Grid>
             {/*===== card five closed====*/}
               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <LuggageIcon  className="ld-v6-iocn"/>
                </div>
                <h5>
                  Crew
                </h5>
<p>Manage crew assignments, qualifications, and availability seamlessly with our integrated platform.</p>              </Box>
            </Grid>
             {/*===== card six closed====*/}
              <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <PictureAsPdfIcon  className="ld-v7-iocn"/>
                </div>
                <h5>
                  Manuals
                </h5>
<p>Centralize all aircraft and operational manuals with version control and audit trails.</p>
   </Box>
            </Grid>
             {/*===== card seven closed====*/}

              <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <PictureAsPdfIcon  className="ld-v8-iocn"/>
                </div>
                <h5>
                  Accounts
                </h5>
<p>Manage budgets, payments, and reconciliations with ease using our comprehensive accounting tools.</p>
   </Box>
            </Grid>
             {/*===== card eight closed====*/}

                 <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <DocumentScannerIcon  className="ld-v7-iocn"/>
                </div>
                <h5>
                  Audits
                </h5>
<p>Streamline aviation audits with comprehensive tracking, scheduling, and documentation tools.</p>
   </Box>
            </Grid>
             {/*===== card nine closed====*/}

               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <AccessAlarmsIcon  className="ld-v10-iocn"/>
                </div>
                <h5>
                  Trainings & Sales
                </h5>
<p>Empower your workforce with timely and relevant aviation training management.</p>
   </Box>
            </Grid>
             {/*===== card ten closed====*/}

               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <WidgetsIcon   className="ld-v11-iocn"/>
                </div>
                <h5>
                  Inventory
                </h5>
<p>Ensure parts traceability and compliance with aviation regulations through detailed inventory logs.</p>
   </Box>
            </Grid>
             {/*===== card 11 closed====*/}

               <Grid item xs={12} md={4} >
              <Box className="card-landingpage"
                sx={{
                  p: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <div className="left-data-1">
                    <WindowIcon  className="ld-v12-iocn"/>
                </div>
                <h5>
                  Customization
                </h5>
<p>Airops- is yours, it is fully customizable to meet your unique operational needs and workflows.</p>
   </Box>
            </Grid>
             {/*===== card 12 closed====*/}
        </Grid>
      </Container>


<Container className="contact_map">
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="center"
        >
           <Grid item xs={12} md={12}>
               <div className="map-ld-page">
        <h2 className="manin-lg-page-hd">
          Contact Us
        </h2>
        <p>
          We’d love to hear from you. Reach out through any of the following ways.
        </p>
        </div>

           </Grid>
          {/* ===== LEFT: TEXT ===== */}
          <Grid item xs={12} md={4} className="contact_map_view">
      <Stack spacing={3}>
       
          <Stack direction="row" spacing={2} alignItems="center">
            <LocationOn className="contact_landing_page"/>
            <div>
            <p>Address</p>
            PV AERO PVT LTD
Begumpet Airport
Hyderabad
            </div>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Phone className="contact_landing_page" /> &nbsp;
            <div>
           <p>Call Us</p>
            +91 9676767 457
            </div>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Email  className="contact_landing_page"/>
           
            <Link href="mailto:sales@pvaero.com" color="inherit" underline="hover">
            <div>
             <p>Email Us</p>
              sales@pvaero.com
              </div>
            </Link>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <LanguageIcon className="contact_landing_page"/>
            <div>
            <p>Corp Site</p>
            <Link href="https://www.pvaero.com/" target="_blank" color="inherit" underline="hover">
              www.pvaero.com
            </Link>
            </div>
          </Stack>
        </Stack>
          </Grid>

          {/* ===== RIGHT: IMAGE ===== */}
          <Grid item xs={12} md={8}>
            
          <div>
            <iframe className="iframe-source" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.211261816879!2d78.471228!3d17.449599699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90993cf78413%3A0xacbbbd525c9e9e21!2sBegumpet%20Airport!5e0!3m2!1sen!2sin!4v1748229961447!5m2!1sen!2sin"></iframe>
          </div>
    

              
            
          </Grid>
        </Grid>
      </Container>

   

       {/* ===== FOOTER ===== */}
      <Box sx={{ bgcolor: "grey.900", color: "grey.300", py: 4 }} className="footer-page-ld">
        <Container>
          <Typography align="center" variant="body2">
            © {new Date().getFullYear()} AirOps All Rights Reserved
          </Typography>
          <Typography align="center" variant="body2" mt={1}>
            
            Designed by Airops
          </Typography>
        </Container>
      </Box>

    </>
);
};

export default Landingpage;