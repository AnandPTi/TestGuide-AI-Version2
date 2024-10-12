import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Link, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo3.png'; // Import the logo

const Login = ({ setAuthenticated }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
        username: usernameOrEmail,
        password,
      }));

      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('username', res.data.username);
        setAuthenticated(true);
        navigate('/app'); // Redirect to the app's main page upon successful login
      } else {
        setError('Failed to log in. No token received.');
      }
    } catch (err) {
      setError('Invalid username/email or password');
    }
  };

  // Function to navigate to the register page
  const handleRegisterRedirect = () => {
    navigate('/signup'); // Redirect to the Register page
  };

  return (
    <Container maxWidth="xs"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      paddingBottom: '30px', // Adjust this value based on the footer height
    }}>
      <Box
        sx={{
          width: '100%',
          padding: '20px',
          backgroundColor: '#1e1e1e', // Match the dark theme background
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
        }}
      >
        {/* Add the logo above the welcome message */}
        <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '-12px', objectFit: 'contain' }} />

        {/* <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#ffffff' }}>
          Welcome Back
        </Typography> */}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{
              marginBottom: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .MuiInputLabel-root': {
                color: '#ffffff', // Label color
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff', // Border color
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f51b5', // Border color on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f51b5', // Border color when focused
              },
              '& .MuiInputBase-input': {
                color: '#ffffff', // Input text color
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{
              marginBottom: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .MuiInputLabel-root': {
                color: '#ffffff', // Label color
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ffffff', // Border color
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f51b5', // Border color on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f51b5', // Border color when focused
              },
              '& .MuiInputBase-input': {
                color: '#ffffff', // Input text color
              },
            }}
          />
          {error && <Typography color="error" align="center" sx={{ marginBottom: '10px' }}>{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '12px 0',
              borderRadius: '8px',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ marginTop: '20px', color: '#ffffff' }}>
          Don't have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={handleRegisterRedirect}
            sx={{ color: '#3f51b5', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;


// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container, Link } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setAuthenticated }) => {
//   const [usernameOrEmail, setUsernameOrEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
//         username: usernameOrEmail,
//         password,
//       }));

//       if (res.data.access_token) {
//         localStorage.setItem('token', res.data.access_token);
//         localStorage.setItem('username', res.data.username);
//         setAuthenticated(true);
//         navigate('/app'); // Redirect to the app's main page upon successful login
//       } else {
//         setError('Failed to log in. No token received.');
//       }
//     } catch (err) {
//       setError('Invalid username/email or password');
//     }
//   };

//   // Function to navigate to the register page
//   const handleRegisterRedirect = () => {
//     navigate('/signup'); // Redirect to the Register page
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Login
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Username or Email"
//           value={usernameOrEmail}
//           onChange={(e) => setUsernameOrEmail(e.target.value)}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           label="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           margin="normal"
//           required
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Login
//         </Button>
//       </form>

//       <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
//         Don't have an account?{' '}
//         <Link component="button" variant="body2" onClick={handleRegisterRedirect}>
//           Register here
//         </Link>
//       </Typography>
//     </Container>
//   );
// };

// export default Login;



//******************ALL FINE************************************************************* */


// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setAuthenticated }) => {
//   const [usernameOrEmail, setUsernameOrEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
//         username: usernameOrEmail,
//         password,
//       }));

//       if (res.data.access_token) {
//         localStorage.setItem('token', res.data.access_token);
//         setAuthenticated(true);
//         navigate('/app');
//       } else {
//         setError('Failed to log in. No token received.');
//       }
//     } catch (err) {
//       setError('Invalid username/email or password');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Login
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Username or Email"
//           value={usernameOrEmail}
//           onChange={(e) => setUsernameOrEmail(e.target.value)}
//           margin="normal"
//           required
//         />
//         <TextField
//           fullWidth
//           label="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           margin="normal"
//           required
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Login
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// const Login = ({ setAuthenticated }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Use useNavigate for redirection

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
//         username,
//         password,
//       }));

//       // Check if access_token is present
//       if (res.data.access_token) {
//         localStorage.setItem('token', res.data.access_token);
//         setAuthenticated(true);
//         navigate('/app'); // Use navigate to redirect to main app
//       } else {
//         setError('Failed to log in. No token received.');
//       }
//     } catch (err) {
//       setError('Invalid username or password'); // User-friendly error message
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Login
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           margin="normal"
//           required // Make the field required
//         />
//         <TextField
//           fullWidth
//           label="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           margin="normal"
//           required // Make the field required
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Login
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container } from '@mui/material';
// import axios from 'axios';

// const Login = ({ setAuthenticated }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://127.0.0.1:8000/token', new URLSearchParams({
//         username,
//         password,
//       }));

//       // Check if access_token is present
//       if (res.data.access_token) {
//         localStorage.setItem('token', res.data.access_token);
//         setAuthenticated(true);
//         window.location.href = '/app'; // Redirect to main app
//       } else {
//         setError('Failed to log in. No token received.');
//       }
//     } catch (err) {
//       setError('Invalid username or password');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Login
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           fullWidth
//           label="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           margin="normal"
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Login
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default Login;
