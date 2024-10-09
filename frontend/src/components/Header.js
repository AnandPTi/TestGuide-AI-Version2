import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Menu, MenuItem, IconButton, Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deepPurple, pink, blue, green, orange, yellow } from '@mui/material/colors'; // Add more colors for variety

// Import the logo
import logo from '../logo3.png'; // Adjust this path if needed

const Header = ({ authenticated, setAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');
  const [avatarColor, setAvatarColor] = useState(deepPurple[500]); // Default color
  const [avatarInitial, setAvatarInitial] = useState('A'); // Default initial
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername); // Set the username from localStorage

      // Generate random color and initials based on the username
      const colors = [deepPurple[500], pink[500], blue[500], green[500], orange[500], yellow[500]];
      setAvatarColor(colors[Math.floor(Math.random() * colors.length)]);

      if (storedUsername) {
        const initials = storedUsername.split(' ').map((name) => name.charAt(0)).join('').toUpperCase();
        setAvatarInitial(initials || 'A');
      } else {
        // Default random initials if no username is provided
        const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random A-Z
        setAvatarInitial(randomChar);
      }
    }
  }, [authenticated]);

  const handleNavigation = (path) => {
    if (authenticated || path === '/login' || path === '/signup' || path === '/about' || path === '/pricing' || path === '/solution') {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear token and authentication status
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Clear username as well
    setAuthenticated(false);
    setAnchorEl(null);
    navigate('/login'); // Redirect to login after logout
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
          <Button color="inherit" onClick={() => handleNavigation('/about')} sx={{ textTransform: 'none' }}>
            About Us
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/pricing')} sx={{ textTransform: 'none' }}>
            Pricing
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/solution')} sx={{ textTransform: 'none' }}>
            Solution
          </Button>
        </Box>

        {/* Right side: If user is authenticated, show user icon; otherwise show login/sign-up buttons */}
        <Box display="flex" justifyContent="flex-end" gap={1}>
          {authenticated ? (
            <>
              <IconButton onClick={handleMenuClick}>
                <Avatar sx={{ bgcolor: avatarColor, width: 48, height: 48, fontSize: '1.25rem' }}>
                  {avatarInitial}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: '45px' }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Typography textAlign="center" sx={{ fontWeight: 'bold' }}>
                    {username || 'User'}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/saved-responses')}>
                  Saved Responses
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => handleNavigation('/login')}
                sx={{
                  borderColor: '#fff',
                  color: '#fff',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  textTransform: 'none', // Disable uppercase transformation
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
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;





// import React, { useState, useEffect } from 'react';
// import { AppBar, Toolbar, Button, Box, Menu, MenuItem, IconButton, Avatar, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { deepPurple } from '@mui/material/colors';

// // Import the logo
// import logo from '../logo3.png'; // Adjust this path if needed

// const Header = ({ authenticated, setAuthenticated }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [username, setUsername] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (authenticated) {
//       const storedUsername = localStorage.getItem('username');
//       setUsername(storedUsername); // Set the username from localStorage
//     }
//   }, [authenticated]);


//   const handleNavigation = (path) => {
//     if (authenticated || path === '/login' || path === '/signup'|| path === '/about' || path === '/pricing' || path === '/solution') {
//       navigate(path);
//     } else {
//       navigate('/login');
//     }
//   };

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     // Clear token and authentication status
//     localStorage.removeItem('token');
//     localStorage.removeItem('username'); // Clear username as well
//     setAuthenticated(false);
//     setAnchorEl(null);
//     navigate('/login'); // Redirect to login after logout
//   };

//   return (
//     <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '5px' }}>
//       <Toolbar>
//         {/* Left side: Logo as clickable button */}
//         <Box
//           component="img"
//           src={logo}
//           alt="TestGuideAI Logo"
//           onClick={() => handleNavigation('/app')}
//           style={{
//             height: '80px', // Adjust size to fit your design
//             cursor: 'pointer',
//             width: 'auto',
//             marginRight: '20px',
//           }}
//         />

//         {/* Center: Other navigation links */}
//         <Box display="flex" justifyContent="center" gap={2} style={{ flexGrow: 3 }}>
//           <Button color="inherit" onClick={() => handleNavigation('/about')} sx={{ textTransform: 'none' }}>
//             About Us
//           </Button>
//           <Button color="inherit" onClick={() => handleNavigation('/pricing')} sx={{ textTransform: 'none' }}>
//             Pricing
//           </Button>
//           <Button color="inherit" onClick={() => handleNavigation('/solution')} sx={{ textTransform: 'none' }}>
//             Solution
//           </Button>
//         </Box>

//         {/* Right side: If user is authenticated, show user icon; otherwise show login/sign-up buttons */}
//         <Box display="flex" justifyContent="flex-end" gap={1}>
//           {authenticated ? (
//             <>
//               <IconButton onClick={handleMenuClick}>
//                 <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar> {/* Replace 'A' with dynamic user initials */}
//               </IconButton>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 sx={{ mt: '45px' }}
//               >
//                 <MenuItem onClick={handleMenuClose}>
//                   <Typography textAlign="center">{username}</Typography> {/* Dynamic username */}
//                 </MenuItem>
//                 <MenuItem onClick={() => handleNavigation('/saved-responses')}>
//                   Saved Responses
//                 </MenuItem>
//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//               </Menu>
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="outlined"
//                 onClick={() => handleNavigation('/login')}
//                 sx={{
//                   borderColor: '#fff',
//                   color: '#fff',
//                   borderRadius: '8px',
//                   fontWeight: 'bold',
//                   textTransform: 'none', // Disable uppercase transformation
//                   '&:hover': {
//                     backgroundColor: 'white',
//                     color: '#3f51b5',
//                     borderColor: '#3f51b5',
//                   },
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 Log in
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={() => handleNavigation('/signup')}
//                 sx={{
//                   backgroundColor: '#3f51b5',
//                   color: 'white',
//                   borderRadius: '8px',
//                   padding: '8px 16px',
//                   fontWeight: 'bold',
//                   textTransform: 'none', // Disable uppercase transformation
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     backgroundColor: 'white',
//                     color: '#3f51b5',
//                     borderColor: '#3f51b5',
//                   },
//                 }}
//               >
//                 Sign Up
//               </Button>
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;













// import React, { useState } from 'react';
// import { AppBar, Toolbar, Button, Box, Menu, MenuItem, IconButton, Avatar, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { deepPurple } from '@mui/material/colors';

// // Import the logo
// import logo from '../logo3.png'; // Adjust this path if needed

// const Header = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(true); // Change this based on actual authentication state
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     // Add logout logic here
//     setIsAuthenticated(false);
//     setAnchorEl(null);
//     navigate('/');
//   };

//   return (
//     <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '5px' }}>
//       <Toolbar>
//         {/* Left side: Logo as clickable button */}
//         <Box
//           component="img"
//           src={logo}
//           alt="TestGuideAI Logo"
//           onClick={() => handleNavigation('/app')}
//           style={{
//             height: '80px', // Adjust size to fit your design
//             cursor: 'pointer',
//             width: 'auto',
//             marginRight: '20px',
//           }}
//         />

//         {/* Center: Other navigation links */}
//         <Box display="flex" justifyContent="center" gap={2} style={{ flexGrow: 3 }}>
//           <Button
//             color="inherit"
//             onClick={() => handleNavigation('/about')}
//             sx={{ textTransform: 'none' }} // Disable uppercase transformation
//           >
//             About Us
//           </Button>
//           <Button
//             color="inherit"
//             onClick={() => handleNavigation('/pricing')}
//             sx={{ textTransform: 'none' }} // Disable uppercase transformation
//           >
//             Pricing
//           </Button>
//           <Button
//             color="inherit"
//             onClick={() => handleNavigation('/solution')}
//             sx={{ textTransform: 'none' }} // Disable uppercase transformation
//           >
//             Solution
//           </Button>
//         </Box>

//         {/* Right side: If user is authenticated, show user icon; otherwise show login/sign-up buttons */}
//         <Box display="flex" justifyContent="flex-end" gap={1}>
//           {isAuthenticated ? (
//             <>
//               <IconButton onClick={handleMenuClick}>
//                 <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar> {/* Replace 'A' with dynamic user initials */}
//               </IconButton>
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 sx={{ mt: '45px' }}
//               >
//                 <MenuItem onClick={handleMenuClose}>
//                   <Typography textAlign="center">Username</Typography> {/* Replace with dynamic username */}
//                 </MenuItem>
//                 <MenuItem onClick={() => handleNavigation('/saved-responses')}>
//                   Saved Responses
//                 </MenuItem>
//                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
//               </Menu>
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="outlined"
//                 onClick={() => handleNavigation('/login')}
//                 sx={{
//                   borderColor: '#fff',
//                   color: '#fff',
//                   borderRadius: '8px',
//                   fontWeight: 'bold',
//                   textTransform: 'none', // Disable uppercase transformation
//                   '&:hover': {
//                     backgroundColor: 'white',
//                     color: '#3f51b5',
//                     borderColor: '#3f51b5',
//                   },
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 Log in
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={() => handleNavigation('/signup')}
//                 sx={{
//                   backgroundColor: '#3f51b5',
//                   color: 'white',
//                   borderRadius: '8px',
//                   padding: '8px 16px',
//                   fontWeight: 'bold',
//                   textTransform: 'none', // Disable uppercase transformation
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     backgroundColor: 'white',
//                     color: '#3f51b5',
//                     borderColor: '#3f51b5',
//                   },
//                 }}
//               >
//                 Sign Up
//               </Button>
//             </>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;





// import React from 'react';
// import { AppBar, Toolbar, Button, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// // Import the logo
// import logo from '../logo3.png'; // Adjust this path if needed

// const Header = () => {
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <AppBar position="static" style={{ backgroundColor: '#1e1e1e', marginBottom: '5px' }}>
//       <Toolbar>
//         {/* Left side: Logo as clickable button */}
//         <Box
//           component="img"
//           src={logo}
//           alt="TestGuideAI Logo"
//           onClick={() => handleNavigation('/app')}
//           style={{
//             height: '80px', // Adjust size to fit your design
//             cursor: 'pointer',
//             width: 'auto',
//             marginRight: '20px',
//           }}
//         />

//         {/* Center: Other navigation links */}
//         <Box display="flex" justifyContent="center" gap={2} style={{ flexGrow: 3 }}>
//           <Button
//             color="inherit"
//             onClick={() => handleNavigation('/about')}
//             sx={{ textTransform: 'none' }} // Disable uppercase transformation
//           >
//             About Us
//           </Button>
//           <Button
//             color="inherit"
//             onClick={() => handleNavigation('/pricing')}
//             sx={{ textTransform: 'none' }} // Disable uppercase transformation
//           >
//             Pricing
//           </Button>
//           <Button
//             color="inherit"
//             onClick={() => handleNavigation('/solution')}
//             sx={{ textTransform: 'none' }} // Disable uppercase transformation
//           >
//             Solution
//           </Button>
//         </Box>

//         {/* Right side: Login and Signup buttons */}
//         <Box display="flex" justifyContent="flex-end" gap={1}>
//           {/* Login button with orange outline */}
//           <Button
//             variant="outlined"
//             onClick={() => handleNavigation('/login')}
//             sx={{
//               borderColor: '#fff',
//               color: '#fff',
//               borderRadius: '8px',
//               fontWeight: 'bold',
//               textTransform: 'none', // Disable uppercase transformation
//               // width: 80,
//               // height: 35,
//               '&:hover': {
//                 backgroundColor: 'white',
//                 color: '#3f51b5',
//                 borderColor: '#3f51b5',
//               },
//               transition: 'all 0.3s ease',
//             }}
//           >
//             Log in
//           </Button>

//           {/* Signup button with orange background and curved border */}
//           <Button
//             variant="contained"
//             onClick={() => handleNavigation('/signup')}
//             sx={{
//               backgroundColor: '#3f51b5',
//               color: 'white',
//               borderRadius: '8px',
//               padding: '8px 16px',
//               fontWeight: 'bold',
//               textTransform: 'none', // Disable uppercase transformation
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
