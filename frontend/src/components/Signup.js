import React, { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      await axios.post('http://127.0.0.1:8000/signup/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Set authentication status and redirect to the app after successful signup
      setAuthenticated(true);
      navigate('/app'); // Redirect to the app
    } catch (err) {
      // Set error message if signup fails
      setError('Failed to create user. Please try again.'); 
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required // Make the field required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required // Make the field required
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required // Make the field required
          type="email" // Set input type to email for validation
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default Signup;

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
