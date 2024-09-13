// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '20px' }}>
      <Toolbar>
        <Typography variant="h4" style={{ flexGrow: 1 }}>
          TestGuideAI
        </Typography>
        <Typography variant="subtitle1" color="inherit">
          Generate Testing Instructions for Uploaded Images
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
