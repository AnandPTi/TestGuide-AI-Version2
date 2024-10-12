import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import ImageUploader from './components/ImageUploader';
import ResponsePopup from './components/ResponsePopup';
import Pricing from './components/Pricing';
import Solution from './components/solution';
import Header from './components/Header';
import SavedResponses from './components/SavedResponses';
import Footer from './components/Footer';
import axios from 'axios';
import { styled } from '@mui/system';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  minHeight: '80vh',
});

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // New loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setLoadingAuth(false); // Set loading to false once the token check is done
  }, []);

  // Show a loading indicator or a placeholder while checking auth state
  if (loadingAuth) {
    return <div>Loading...</div>; // Replace with a spinner or your preferred loading component
  }

  const PrivateRoute = ({ element }) => (
    authenticated ? element : <Navigate to="/login" replace />
  );
  // const [authenticated, setAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setAuthenticated(true);
  //   } else {
  //     setAuthenticated(false);
  //   } 
  // }, []);

  // const PrivateRoute = ({ element }) => (
  //   authenticated ? element : <Navigate to="/login" replace />
  // );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Header authenticated={authenticated} setAuthenticated={setAuthenticated} />
        <Routes>
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="/signup" element={<Signup setAuthenticated={setAuthenticated} />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/app" element={<PrivateRoute element={<MainApp />} />} />
          <Route path="/saved-responses" element={<PrivateRoute element={<SavedResponses />} />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

const MainApp = () => {
  const [images, setImages] = useState([]);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleImageUpload = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse('');

    const formData = new FormData();
    images.forEach((image) => formData.append('files', image));
    formData.append('context', context);

    try {
      const res = await axios.post('http://127.0.0.1:8000/upload_images/', formData, {
        headers: {
                   'Content-Type': 'multipart/form-data',
                   'Authorization': `Bearer ${localStorage.getItem('token')}`,
                 },
      });
      setResponse(res.data['Generated Instructions']);
      setShowPopup(true);
    } catch (err) {
      setError('Failed to generate test instructions.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <Header /> */}
      <Container>
        <ImageUploader 
          images={images}
          context={context}
          handleImageUpload={handleImageUpload}
          setContext={setContext}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {showPopup && (
          <ResponsePopup 
            response={response}
            closePopup={() => setShowPopup(false)} 
          />
        )}
      </Container>
      {/* <Footer /> */}
    </ThemeProvider>
  );
};

export default App;





  
  // const [images, setImages] = useState([]);
  // const [context, setContext] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [response, setResponse] = useState('');
  // const [error, setError] = useState(null);
  // const [showPopup, setShowPopup] = useState(false);
  // const [uploadMessage, setUploadMessage] = useState(''); // Define uploadMessage and its setter

  // const handleImageUpload = async (formData) => {
  //   const response = await fetch('http://localhost:8000/upload_images/', {
  //     method: 'POST',
  //     body: formData,
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to upload images');
  //   }
  //   const data = await response.json();
  //   setUploadMessage('Images uploaded successfully!'); // Set the upload message
  //   console.log(data); // Do something with the response data
  // };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setResponse('');
  
  //   const formData = new FormData();
  //   images.forEach((image) => formData.append('files', image));
  //   formData.append('context', context);
  
  //   try {
  //     const res = await axios.post('http://127.0.0.1:8000/upload_images/', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
      
  //     // Add these logs to debug the response
  //     console.log('Response:', res.data);
      
  //     if (res.data && res.data['Generated Instructions']) {
  //       setResponse(res.data['Generated Instructions']);
  //       setShowPopup(true);  // Show popup if the response contains the instructions
  //     } else {
  //       setError('Instructions not found in response.');
  //     }
  //   } catch (err) {
  //     setError('Failed to generate test instructions.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// import React, { useState, useEffect } from 'react';
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import ImageUploader from './components/ImageUploader';
// import ResponsePopup from './components/ResponsePopup';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import axios from 'axios';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     background: {
//       default: '#121212',
//       paper: '#1e1e1e',
//     },
//     text: {
//       primary: '#ffffff',
//     },
//   },
// });

// const App = () => {
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setAuthenticated(true);
//     }
//   }, []);

//   // Updated PrivateRoute logic to use `element` instead of `render`
//   const PrivateRoute = ({ element, ...rest }) => (
//     authenticated ? element : <Navigate to="/login" replace />
//   );

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <Router>
//         <Header />
//         <Routes>
//           <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
//           <Route path="/signup" element={<Signup setAuthenticated={setAuthenticated} />} />
//           <Route 
//             path="/app" 
//             element={<PrivateRoute element={<MainApp />} />} 
//           />
//           {/* Redirect from "/" to "/login" */}
//           <Route path="/" element={<Navigate to="/login" replace />} />
//         </Routes>
//         <Footer />
//       </Router>
//     </ThemeProvider>
//   );
// };

// const MainApp = () => {
//   const [images, setImages] = useState([]);
//   const [context, setContext] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState('');
//   const [error, setError] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleImageUpload = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setResponse('');

//     const formData = new FormData();
//     images.forEach((image) => formData.append('files', image));
//     formData.append('context', context);

//     try {
//       const res = await axios.post('http://127.0.0.1:8000/upload_images/', formData, {
//         headers: { 
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setResponse(res.data['Generated Instructions']);
//       setShowPopup(true);
//     } catch (err) {
//       setError('Failed to generate test instructions.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <ImageUploader 
//         images={images}
//         context={context}
//         handleImageUpload={handleImageUpload}
//         setContext={setContext}
//         handleSubmit={handleSubmit}
//         loading={loading}
//         error={error}
//       />

//       {showPopup && (
//         <ResponsePopup 
//           response={response}
//           closePopup={() => setShowPopup(false)} 
//         />
//       )}
//     </div>
//   );
// };

// export default App;


//****************************Earlier best working************************************************* */
// import React, { useState } from 'react';
// import { styled } from '@mui/system';
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import ImageUploader from './components/ImageUploader';
// import ResponsePopup from './components/ResponsePopup';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import axios from 'axios';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     background: {
//       default: '#121212',
//       paper: '#1e1e1e',
//     },
//     text: {
//       primary: '#ffffff',
//     },
//   },
// });

// const Container = styled('div')({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '20px',
//   minHeight: '100vh',
// });

// const App = () => {
//   const [images, setImages] = useState([]);
//   const [context, setContext] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState('');
//   const [error, setError] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleImageUpload = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setResponse('');

//     const formData = new FormData();
//     images.forEach((image) => formData.append('files', image));
//     formData.append('context', context);

//     try {
//       const res = await axios.post('http://127.0.0.1:8000/upload_images/', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setResponse(res.data['Generated Instructions']);
//       setShowPopup(true);
//     } catch (err) {
//       setError('Failed to generate test instructions.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <Header />
//       <Container>
//         <ImageUploader 
//           images={images}
//           context={context}
//           handleImageUpload={handleImageUpload}
//           setContext={setContext}
//           handleSubmit={handleSubmit}
//           loading={loading}
//           error={error}
//         />

//         {showPopup && (
//           <ResponsePopup 
//             response={response}
//             closePopup={() => setShowPopup(false)} 
//           />
//         )}
//       </Container>
//       <Footer />
//     </ThemeProvider>
//   );
// };

// export default App;

// import React, { useState } from 'react';
// import { styled } from '@mui/system';
// import ImageUploader from './components/ImageUploader';
// import ResponsePopup from './components/ResponsePopup';
// import axios from 'axios';

// const Container = styled('div')({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '20px',
//   backgroundColor: '#f0f4f8',
//   minHeight: '100vh',
// });
// //modified
// const App = () => {
//   const [images, setImages] = useState([]);
//   const [context, setContext] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState('');
//   const [error, setError] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleImageUpload = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setResponse('');

//     const formData = new FormData();
//     images.forEach((image) => formData.append('files', image));
//     formData.append('context', context);

//     try {
//       const res = await axios.post('http://127.0.0.1:8000/upload_images/', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setResponse(res.data['Generated Instructions']);
//       setShowPopup(true);
//     } catch (err) {
//       setError('Failed to generate test instructions.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>

//       <ImageUploader 
//         images={images}
//         context={context}
//         handleImageUpload={handleImageUpload}
//         setContext={setContext}
//         handleSubmit={handleSubmit}
//         loading={loading}
//         error={error}
//       />

//       {showPopup && (
//         <ResponsePopup 
//           response={response}
//           closePopup={() => setShowPopup(false)} 
//         />
//       )}
//     </Container>
//   );
// };

// export default App;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, CircularProgress, Typography, Box, Card, CardMedia, Grid, TextField } from '@mui/material';
// import { styled } from '@mui/system';
// import ReactMarkdown from 'react-markdown';

// const Container = styled('div')({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '20px',
//   backgroundColor: '#f0f4f8',
//   minHeight: '100vh',
// });

// const UploadForm = styled('div')({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   gap: '20px',
//   padding: '30px',
//   backgroundColor: '#fff',
//   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//   borderRadius: '12px',
//   maxWidth: '500px',
// });

// const App = () => {
//   const [images, setImages] = useState([]);
//   const [context, setContext] = useState(''); // For optional context
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState('');
//   const [error, setError] = useState(null);

//   const handleImageUpload = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setResponse('');

//     const formData = new FormData();
//     images.forEach((image) => {
//       formData.append('files', image);
//     });

//     formData.append('context', context); // Add the context to the request

//     try {
//       const res = await axios.post('http://127.0.0.1:8000/upload_images/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setResponse(res.data['Generated Instructions']);
//     } catch (err) {
//       setError('Failed to generate test instructions.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <UploadForm>
//         <Typography variant="h4" color="primary" gutterBottom>
//           Upload Images & Generate Test
//         </Typography>

//         <input
//           accept="image/*"
//           type="file"
//           multiple
//           onChange={handleImageUpload}
//           style={{ marginBottom: '20px' }}
//         />

//         <TextField
//           label="Optional Context"
//           variant="outlined"
//           multiline
//           rows={4}
//           fullWidth
//           value={context}
//           onChange={(e) => setContext(e.target.value)}
//           style={{ marginBottom: '20px' }}
//         />

//         <Grid container spacing={2}>
//           {Array.from(images).map((image, index) => (
//             <Grid item key={index}>
//               <Card>
//                 <CardMedia
//                   component="img"
//                   height="100"
//                   image={URL.createObjectURL(image)}
//                   alt={`Image ${index + 1}`}
//                 />
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={loading || images.length === 0}
//           style={{ marginTop: '20px' }}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
//         </Button>

//         {error && <Typography color="error">{error}</Typography>}
//       </UploadForm>

//       {response && (
//         <Box mt={4} p={3} bgcolor="#fff" boxShadow={2} borderRadius={4} width="100%">
//           <Typography variant="h5" gutterBottom>
//             Generated Test Instructions:
//           </Typography>
//           <ReactMarkdown>{response}</ReactMarkdown>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default App;
