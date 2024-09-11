import React, { useState } from 'react';
import {Typography} from '@mui/material';
import { styled } from '@mui/system';
import ImageUploader from './components/ImageUploader';
import ResponsePopup from './components/ResponsePopup';
import axios from 'axios';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  backgroundColor: '#f0f4f8',
  minHeight: '100vh',
});

const App = () => {
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
        headers: { 'Content-Type': 'multipart/form-data' },
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
    <Container>
      <Typography variant="h4" color="primary" gutterBottom>
        Upload Images & Generate Test
      </Typography>

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
  );
};

export default App;

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
