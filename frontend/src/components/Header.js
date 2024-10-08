import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Import the logo
import logo from '../logo3.png'; // Adjust this path if needed

const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '5px' }}>
      <Toolbar>
        {/* Left side: Logo as clickable button */}
        <Box
          component="img"
          src={logo}
          alt="TestGuideAI Logo"
          onClick={() => handleNavigation('/app')}
          style={{
            height: '80px', // Adjust size to fit your design
            cursor: 'pointer',
            width: 'auto',
            marginRight: '20px',
          }}
        />

        {/* Center: Other navigation links */}
        <Box display="flex" justifyContent="center" gap={2} style={{ flexGrow: 3 }}>
          <Button
            color="inherit"
            onClick={() => handleNavigation('/about')}
            sx={{ textTransform: 'none' }} // Disable uppercase transformation
          >
            About Us
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation('/pricing')}
            sx={{ textTransform: 'none' }} // Disable uppercase transformation
          >
            Pricing
          </Button>
          <Button
            color="inherit"
            onClick={() => handleNavigation('/solution')}
            sx={{ textTransform: 'none' }} // Disable uppercase transformation
          >
            Solution
          </Button>
        </Box>

        {/* Right side: Login and Signup buttons */}
        <Box display="flex" justifyContent="flex-end" gap={1}>
          {/* Login button with orange outline */}
          <Button
            variant="outlined"
            onClick={() => handleNavigation('/login')}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'none', // Disable uppercase transformation
              // width: 80,
              // height: 35,
              '&:hover': {
                backgroundColor: 'white',
                color: '#3f51b5',
                borderColor: '#3f51b5',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Log in
          </Button>

          {/* Signup button with orange background and curved border */}
          <Button
            variant="contained"
            onClick={() => handleNavigation('/signup')}
            sx={{
              backgroundColor: '#3f51b5',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 'bold',
              textTransform: 'none', // Disable uppercase transformation
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'white',
                color: '#3f51b5',
                borderColor: '#3f51b5',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// import React from 'react';
// import { AppBar, Toolbar, Button, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// // Import the logo
// import logo from '../logo.png'; // Adjust this path if needed

// const Header = () => {
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '20px' }}>
//       <Toolbar>
//         {/* Left side: Logo as clickable button */}
//         <Box
//           component="img"
//           src={logo}
//           alt="TestGuideAI Logo"
//           onClick={() => handleNavigation('/')}
//           style={{
//             height: '80px', // Adjust size to fit your design
//             cursor: 'pointer',
//             marginRight: '20px',
//           }}
//         />

//         {/* Center: Other navigation links */}
//         <Box display="flex" justifyContent="center" gap={2} style={{ flexGrow: 3 }}>
//           <Button color="inherit" onClick={() => handleNavigation('/about')}>
//             About Us
//           </Button>
//           <Button color="inherit" onClick={() => handleNavigation('/pricing')}>
//             Pricing
//           </Button>
//           <Button color="inherit" onClick={() => handleNavigation('/solution')}>
//             Solution
//           </Button>
//         </Box>

//         {/* Right side: Login and Signup buttons */}
//         <Box display="flex" justifyContent="flex-end" gap={2}>
//           {/* Login button with orange outline */}
//           <Button
//             variant="outlined"
//             onClick={() => handleNavigation('/login')}
//             sx={{
//               borderColor: '#3f51b5', // Set border color to orange
//               color: '#3f51b5', // Text color to orange
//               borderRadius: '20px', // More curved boundary
//               fontWeight: 'bold',
//               '&:hover': {
//                 backgroundColor: 'white', // Background on hover
//                 color: '#3f51b5', // Text color on hover
//                 borderColor: '#3f51b5', // Border color on hover
//               },
//               transition: 'all 0.3s ease', // Smooth transition for hover effects
//             }}
//           >
//             Log In
//           </Button>


//           {/* Signup button with orange background and curved border */}
//           <Button
//             variant="contained"
//             onClick={() => handleNavigation('/signup')}
//             sx={{
//               backgroundColor: '#3f51b5',
//               color: 'white',
//               borderRadius: '20px',
//               padding: '8px 16px',
//               fontWeight: 'bold',
//               transition: 'all 0.3s ease',
//               '&:hover': {
//                 backgroundColor: 'white',
//                 color: '#3f51b5',
//                 borderColor: '#3f51b5',
//               },
//             }}
//           >
//             Sign Up
//           </Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;




// // Header.js
// import React from 'react';
// import { AppBar, Toolbar, Typography, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '20px' }}>
//       <Toolbar>
//         <Typography variant="h4" style={{ flexGrow: 1 }}>
//           TestGuideAI
//         </Typography>
//         <Button color="inherit" onClick={() => handleNavigation('/login')}>
//           Login
//         </Button>
//         <Button color="inherit" onClick={() => handleNavigation('/signup')}>
//           Signup
//         </Button>
//         <Button color="inherit" onClick={() => handleNavigation('/about')}>
//           About Us
//         </Button>
//         <Button color="inherit" onClick={() => handleNavigation('/pricing')}>
//           Pricing
//         </Button>
//         <Button color="inherit" onClick={() => handleNavigation('/solution')}>
//           Solution
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

// import React from 'react';
// import { AppBar, Toolbar, Typography } from '@mui/material';

// const Header = () => {
//   return (
//     <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '20px' }}>
//       <Toolbar>
//         <Typography variant="h4" style={{ flexGrow: 1 }}>
//           TestGuideAI
//         </Typography>
//         <Typography variant="subtitle1" color="inherit">
//           Generate Testing Instructions for Uploaded Images
//         </Typography>
//       </Toolbar>
//     </AppBar>
//   );
// };
// // Export Header
// export default Header;
