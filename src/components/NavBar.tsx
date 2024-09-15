import React from "react";
import { AppBar, Toolbar, Box, Button, IconButton } from "@mui/material";
import { UserButton } from "@clerk/clerk-react";

// import { ReactComponent as HackIcon } from '../hack-logo.svg';
// import HackIcon from jpeg
// import HackIcon from '../hack-logo.jpeg';

import './NavBar.css';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" sx={{
      backgroundColor: 'transparent',
      boxShadow: 'none',
      transition: 'margin 0.3s ease',  // Smooth transition for margin changes
    }}>
      <Toolbar>
        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Replace Courses text with an SVG */}
          <Button
            sx={{ color: 'black', textTransform: 'none', display: 'flex', alignItems: 'center' }}
            component="a"
            href="/courses"
          >
            {/* <HackIcon sx={{ width: 32, height: 32, mr: 1 }} /> */}
            Streamline
          </Button>
        </Box>

        {/* User Button */}
        <Box>
          <UserButton afterSignOutUrl="#" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
