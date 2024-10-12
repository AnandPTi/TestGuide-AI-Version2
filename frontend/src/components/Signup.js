import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Link, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../logo3.png'; // Adjust the path if needed

const Signup = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('username', username); // Include username in the form data
    formData.append('password', password);

    try {
      // Send POST request to signup endpoint
      const res = await axios.post('http://127.0.0.1:8000/signup/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Check if the signup was successful
      if (res.data.msg) {
        // If signup was successful, you might want to log in the user automatically.
        // You can do this by calling the login endpoint after successful signup.
        const loginResponse = await axios.post('http://127.0.0.1:8000/token',new URLSearchParams({
          username: username,
          password: password,
        })); 
        // {
        //   username: username,
        //   password: password,
        // });

        if (loginResponse.data.access_token) {
          localStorage.setItem('token', loginResponse.data.access_token); // Store the token in localStorage
          localStorage.setItem('username', loginResponse.data.username); // Store the username in localStorage
          setAuthenticated(true); // Set authenticated state to true
          navigate('/app'); // Redirect to the app
        } else {
          setError('Failed to log in. No token received after signup.');
        }
      } else {
        setError('Failed to sign up. Please try again.');
      }
    } catch (err) {
      // Set error message if signup fails
      setError('Failed to create user. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to the Login page
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        paddingBottom: '30px', // Adjust this value based on the footer height
      }}
    >
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

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            type="email" // Set input type to email for validation
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
            Sign Up
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ marginTop: '20px', color: '#ffffff' }}>
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={handleLoginRedirect}
            sx={{ color: '#3f51b5', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;


// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container, Link, Box } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import logo from '../logo3.png'; // Adjust the path if needed

// const Signup = ({ setAuthenticated }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Use useNavigate for redirection

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Create form data
//     const formData = new URLSearchParams();
//     formData.append('email', email);
//     formData.append('username', username); // Include username in the form data
//     formData.append('password', password);

//     try {
//       // Send POST request to signup endpoint
//       await axios.post('http://127.0.0.1:8000/signup/', formData, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });

//       // Set authentication status and redirect to the app after successful signup
//       setAuthenticated(true);
//       navigate('/app'); // Redirect to the app
//     } catch (err) {
//       // Set error message if signup fails
//       setError('Failed to create user. Please try again.');
//     }
//   };

//   const handleLoginRedirect = () => {
//     navigate('/login'); // Redirect to the Login page
//   };

//   return (
//     <Container
//       maxWidth="xs"
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '75vh',
//         paddingBottom: '30px', // Adjust this value based on the footer height
//       }}
//     >
//       <Box
//         sx={{
//           width: '100%',
//           padding: '20px',
//           backgroundColor: '#1e1e1e', // Match the dark theme background
//           boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
//           borderRadius: '12px',
//         }}
//       >
//         {/* Add the logo above the welcome message */}
//         <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', marginBottom: '-12px', objectFit: 'contain' }} />

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             margin="normal"
//             required
//             variant="outlined"
//             sx={{
//               marginBottom: '20px',
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '8px',
//               },
//               '& .MuiInputLabel-root': {
//                 color: '#ffffff', // Label color
//               },
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#ffffff', // Border color
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3f51b5', // Border color on hover
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3f51b5', // Border color when focused
//               },
//               '& .MuiInputBase-input': {
//                 color: '#ffffff', // Input text color
//               },
//             }}
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//             required
//             variant="outlined"
//             sx={{
//               marginBottom: '20px',
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '8px',
//               },
//               '& .MuiInputLabel-root': {
//                 color: '#ffffff', // Label color
//               },
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#ffffff', // Border color
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3f51b5', // Border color on hover
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3f51b5', // Border color when focused
//               },
//               '& .MuiInputBase-input': {
//                 color: '#ffffff', // Input text color
//               },
//             }}
//           />
//           <TextField
//             fullWidth
//             label="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             margin="normal"
//             required
//             type="email" // Set input type to email for validation
//             variant="outlined"
//             sx={{
//               marginBottom: '20px',
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '8px',
//               },
//               '& .MuiInputLabel-root': {
//                 color: '#ffffff', // Label color
//               },
//               '& .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#ffffff', // Border color
//               },
//               '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3f51b5', // Border color on hover
//               },
//               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                 borderColor: '#3f51b5', // Border color when focused
//               },
//               '& .MuiInputBase-input': {
//                 color: '#ffffff', // Input text color
//               },
//             }}
//           />
//           {error && <Typography color="error" align="center" sx={{ marginBottom: '10px' }}>{error}</Typography>}
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{
//               backgroundColor: '#3f51b5',
//               color: 'white',
//               padding: '12px 0',
//               borderRadius: '8px',
//               fontWeight: 'bold',
//               textTransform: 'none',
//               '&:hover': {
//                 backgroundColor: '#303f9f',
//               },
//             }}
//           >
//             Sign Up
//           </Button>
//         </form>

//         <Typography variant="body2" align="center" sx={{ marginTop: '20px', color: '#ffffff' }}>
//           Already have an account?{' '}
//           <Link
//             component="button"
//             variant="body2"
//             onClick={handleLoginRedirect}
//             sx={{ color: '#3f51b5', fontWeight: 'bold', cursor: 'pointer' }}
//           >
//             Login here
//           </Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Signup;


// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container, Link } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Signup = ({ setAuthenticated }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Use useNavigate for redirection

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Create form data
//     const formData = new URLSearchParams();
//     formData.append('email', email);
//     formData.append('username', username); // Include username in the form data
//     formData.append('password', password);
    
//     try {
//       // Send POST request to signup endpoint
//       await axios.post('http://127.0.0.1:8000/signup/', formData, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
      
//       // Set authentication status and redirect to the app after successful signup
//       setAuthenticated(true);
//       navigate('/app'); // Redirect to the app
//     } catch (err) {
//       // Set error message if signup fails
//       setError('Failed to create user. Please try again.'); 
//     }
//   };
//   const handleLoginRedirect = () => {
//     navigate('/login'); // Redirect to the Register page
//   };
//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Sign Up
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
//         <TextField
//           fullWidth
//           label="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           margin="normal"
//           required // Make the field required
//           type="email" // Set input type to email for validation
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Sign Up
//         </Button>
//       </form>
//       <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
//         Already have an account?{' '}
//         <Link component="button" variant="body2" onClick={handleLoginRedirect}>
//           Login here
//         </Link>
//       </Typography>
//     </Container>
//   );
// };

// export default Signup;

// import React, { useState } from 'react';
// import { Button, TextField, Typography, Container } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Signup = ({ setAuthenticated }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Use useNavigate for redirection

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Create form data
//     const formData = new URLSearchParams();
//     formData.append('email', email);
//     formData.append('username', username); // Include username in the form data
//     formData.append('password', password);
    
//     try {
//       await axios.post('http://127.0.0.1:8000/signup/', formData, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
      
//       // Redirect to the login page after successful signup
//       setAuthenticated(true);
//       navigate('/app');
//       //window.location.href = '/login'; // Redirect to the login page
//     } catch (err) {
//       setError('Failed to create user');
//     }
//   };
  

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>
//         Sign Up
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
//         <TextField
//           fullWidth
//           label="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           margin="normal"
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           Sign Up
//         </Button>
//       </form>
//     </Container>
//   );
// };

// export default Signup;
