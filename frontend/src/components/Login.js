import React, { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        setAuthenticated(true);
        navigate('/app');
      } else {
        setError('Failed to log in. No token received.');
      }
    } catch (err) {
      setError('Invalid username/email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;

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
