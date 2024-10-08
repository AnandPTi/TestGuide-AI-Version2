import React, { useState } from 'react';
import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, IconButton, Dialog, DialogContent, Tooltip, ThemeProvider, createTheme, CssBaseline,Box } from '@mui/material';
import { Add, Close } from '@mui/icons-material';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#2e2e2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

const ImageUploader = ({ context, handleImageUpload, setContext, handleSubmit, loading, error }) => {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handlePreviewImage = (image) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#2e2e2e', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', borderRadius: '15px', maxWidth: '600px' }}>
        
        {/* App Title
        <Typography variant="h4" component="h1" style={{ color: '#3f51b5', marginBottom: '10px' }}>
          TestGuideAI
        </Typography> */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            background: 'linear-gradient(90deg, #3f51b5, #6370b5)', // Gradient color effect
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', // Makes the gradient apply only to the text
            fontWeight: 'bold',
            marginBottom: '20px',
            letterSpacing: '2px', // Slightly increased spacing for elegance
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow effect for depth
            fontSize: '2.5rem', // Slightly larger font size for more impact
          }}
        >
          TestGuideAI
        </Typography>


        {/* Subheading */}
        <Typography variant="subtitle1" component="h2" style={{ color: '#b0bec5', marginBottom: '20px' }}>
          Generate Testing Instruction For Uploaded Images
        </Typography>

        {/* File Input */}
        <input
          accept="image/*"
          type="file"
          multiple
          onChange={(e) => {
            handleImageUpload(e);
            setImages([...images, ...e.target.files]);
          }}
          style={{ display: 'none'}}
          id="file-input"
        />
        {/* TextField for Context */}
        <TextField
          label="Optional Context"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={context}
          onChange={(e) => setContext(e.target.value)}
          style={{ marginBottom: '5px', backgroundColor: '#424242' }}
          InputLabelProps={{ style: { color: '#b0bec5' } }}
          InputProps={{ style: { color: '#ffffff' } }}
        />
        <label htmlFor="file-input">
          <Tooltip title="Add Image" arrow>
            <IconButton
              component="span"
              sx={{
                color: '#fff', // Icon color
                marginBottom: '20px',
                '&:hover': {
                  color: '#3f51b5', 
                },
              }}
            >
              <Add fontSize="large" />
            </IconButton>
          </Tooltip>
        </label>

        {/* <label htmlFor="file-input">
          <Tooltip title="Add Image" arrow>
            <IconButton color="primary" component="span">
              <Add fontSize="large" />
            </IconButton>
          </Tooltip>
        </label> */}



        {/* Images Grid */}
        <Grid container spacing={2}>
          {Array.from(images).map((image, index) => (
            <Grid item key={index} style={{ position: 'relative' }}>
              <Card style={{ backgroundColor: '#424242', borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  height="100"
                  image={URL.createObjectURL(image)}
                  alt={`Image ${index + 1}`}
                  onClick={() => handlePreviewImage(image)}
                  style={{ cursor: 'pointer', borderRadius: '10px' }}
                />
                <Tooltip title="Remove Image" arrow>
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    style={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <Close />
                  </IconButton>
                </Tooltip>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || images.length === 0}
          sx={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '25px',
            backgroundColor: '#3f51b5', // Default color
            color: '#fff', // Text color
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#fff', // Background color on hover
              color: '#3f51b5', // Text color on hover
              border: '1px solid #3f51b5', // Optional border on hover for better styling
            },
            transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transitions
          }}
        >
         {/* {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'} */}
         {loading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                //gap: '10px', // Spacing between spinner and label
                //flexDirection: 'column',
                gap: '10px', // Space between spinner and message
                textTransform: 'none', // Disable uppercase transformation
              }}
            >
              <CircularProgress 
                size={30} // Slightly larger size for better visibility
                thickness={4.5} // Thicker spinner for more impact
                sx={{ color: '#fff' }} // Custom color matching your theme
              />
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                Hold on, please!
              </Typography>
            </Box>
          ) : (
            'Describe Testing Instructions'
          )}
        </Button>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || images.length === 0}
          style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '25px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
        </Button> */}

        {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}

        {/* Image Preview Dialog */}
        <Dialog open={!!previewImage} onClose={handleClosePreview}>
          <DialogContent>
            {previewImage && <img src={URL.createObjectURL(previewImage)} alt="Preview" style={{ maxWidth: '100%', borderRadius: '10px' }} />}
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default ImageUploader;


// import React, { useState } from 'react';
// import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, IconButton, Dialog, DialogContent, Tooltip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { Add, Close } from '@mui/icons-material';

// // Create a dark theme
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#90caf9',
//     },
//     background: {
//       default: '#121212',
//       paper: '#2e2e2e',
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#b0bec5',
//     },
//   },
// });

// const ImageUploader = ({ context, handleImageUpload, setContext, loading, error, uploadMessage, setUploadMessage }) => {
//   const [images, setImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [response, setResponse] = useState(null); // State to store the response from backend
//   const [responseOpen, setResponseOpen] = useState(false); // State to manage response dialog open/close

//   const handleRemoveImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//     if (newImages.length === 0) setUploadMessage(''); // Clear message if no images left
//   };

//   const handlePreviewImage = (image) => {
//     setPreviewImage(image);
//   };

//   const handleClosePreview = () => {
//     setPreviewImage(null);
//   };

//   const handleImageSelection = (e) => {
//     const selectedImages = Array.from(e.target.files);
//     const uniqueImages = selectedImages.filter(
//       (image) => !images.some((existingImage) => existingImage.name === image.name)
//     );
//     setImages([...images, ...uniqueImages]);
//   };

//   const handleFormSubmit = async () => {
//     if (images.length === 0) {
//       setUploadMessage('Please upload at least one image before submitting.');
//       return;
//     }

//     const formData = new FormData();
//     images.forEach((image) => {
//       formData.append('files', image); // 'files' must match the FastAPI endpoint parameter
//     });
//     formData.append('context', context); // 'context' matches the FastAPI endpoint parameter

//     try {
//       setUploadMessage('Uploading images...');
//       const backendResponse = await handleImageUpload(formData); // Ensure this function sends the FormData
//       setImages([]); // Clear images after submit
//       setContext(''); // Clear context after submit

//       // Assuming backendResponse is the text response from the backend
//       setResponse(backendResponse); // Update the response state with backend data
//       setResponseOpen(true); // Open the response dialog
//     } catch (err) {
//       setUploadMessage('Error uploading images');
//       console.error(err);
//     }
//   };

//   const handleCloseResponse = () => {
//     setResponseOpen(false);
//     setResponse(null); // Clear the response when closing
//   };

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#2e2e2e', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', borderRadius: '15px', maxWidth: '600px' }}>
        
//         <Typography variant="h4" component="h1" style={{ color: '#90caf9', marginBottom: '10px' }}>
//           TestGuideAI
//         </Typography>

//         <Typography variant="subtitle1" component="h2" style={{ color: '#b0bec5', marginBottom: '20px' }}>
//           Generate Testing Instruction For Uploaded Images
//         </Typography>

//         <input
//           accept="image/*"
//           type="file"
//           multiple
//           onChange={handleImageSelection}
//           style={{ display: 'none' }}
//           id="file-input"
//         />
//         <label htmlFor="file-input">
//           <Tooltip title="Add Image" arrow>
//             <IconButton color="primary" component="span">
//               <Add fontSize="large" />
//             </IconButton>
//           </Tooltip>
//         </label>

//         <TextField
//           label="Optional Context"
//           variant="outlined"
//           multiline
//           rows={4}
//           fullWidth
//           value={context}
//           onChange={(e) => setContext(e.target.value)}
//           style={{ marginBottom: '20px', backgroundColor: '#424242' }}
//           InputLabelProps={{ style: { color: '#b0bec5' } }}
//           InputProps={{ style: { color: '#ffffff' } }}
//         />

//         <Grid container spacing={2}>
//           {images.map((image, index) => (
//             <Grid item key={index} style={{ position: 'relative' }}>
//               <Card style={{ backgroundColor: '#424242', borderRadius: '10px' }}>
//                 <CardMedia
//                   component="img"
//                   height="140"
//                   image={URL.createObjectURL(image)}
//                   alt={image.name}
//                   onClick={() => handlePreviewImage(image)}
//                   style={{ cursor: 'pointer' }}
//                 />
//                 <IconButton
//                   style={{
//                     position: 'absolute',
//                     top: '5px',
//                     right: '5px',
//                     color: '#ffffff',
//                   }}
//                   onClick={() => handleRemoveImage(index)}
//                 >
//                   <Close />
//                 </IconButton>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {loading && <CircularProgress />}

//         {uploadMessage && (
//           <Typography variant="body1" color="textSecondary" style={{ marginTop: '10px', color: '#ffffff' }}>
//             {uploadMessage}
//           </Typography>
//         )}

//         {error && (
//           <Typography variant="body1" color="error" style={{ marginTop: '10px' }}>
//             {error}
//           </Typography>
//         )}

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleFormSubmit}
//           disabled={loading}
//           style={{ marginTop: '20px' }}
//         >
//           Submit
//         </Button>
//       </div>

//       <Dialog open={Boolean(previewImage)} onClose={handleClosePreview} fullWidth maxWidth="md">
//         <DialogContent>
//           {previewImage && (
//             <img
//               src={URL.createObjectURL(previewImage)}
//               alt={previewImage.name}
//               style={{ width: '100%', borderRadius: '10px' }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Response Dialog */}
//       <Dialog open={responseOpen} onClose={handleCloseResponse} fullWidth maxWidth="md">
//         <DialogContent>
//           <Typography variant="h6" component="h2" style={{ color: '#90caf9' }}>
//             Response from Backend
//           </Typography>
//           <Typography variant="body1" style={{ color: '#ffffff', marginTop: '10px' }}>
//             {response}
//           </Typography>
//         </DialogContent>
//       </Dialog>
//     </ThemeProvider>
//   );
// };

// export default ImageUploader;

// import React, { useState } from 'react';
// import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, IconButton, Dialog, DialogContent, Tooltip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { Add, Close } from '@mui/icons-material';

// // Create a dark theme
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#90caf9',
//     },
//     background: {
//       default: '#121212',
//       paper: '#2e2e2e',
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#b0bec5',
//     },
//   },
// });

// const ImageUploader = ({ context, handleImageUpload, setContext, handleSubmit, loading, error }) => {
//   const [images, setImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleRemoveImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//   };

//   const handlePreviewImage = (image) => {
//     setPreviewImage(image);
//   };

//   const handleClosePreview = () => {
//     setPreviewImage(null);
//   };

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#2e2e2e', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', borderRadius: '15px', maxWidth: '600px' }}>
        
//         {/* App Title */}
//         <Typography variant="h4" component="h1" style={{ color: '#90caf9', marginBottom: '10px' }}>
//           TestGuideAI
//         </Typography>

//         {/* Subheading */}
//         <Typography variant="subtitle1" component="h2" style={{ color: '#b0bec5', marginBottom: '20px' }}>
//           Generate Testing Instruction For Uploaded Images
//         </Typography>

//         {/* File Input */}
//         <input
//           accept="image/*"
//           type="file"
//           multiple
//           onChange={(e) => {
//             handleImageUpload(e);
//             setImages([...images, ...e.target.files]);
//           }}
//           style={{ display: 'none' }}
//           id="file-input"
//         />
//         <label htmlFor="file-input">
//           <Tooltip title="Add Image" arrow>
//             <IconButton color="primary" component="span">
//               <Add fontSize="large" />
//             </IconButton>
//           </Tooltip>
//         </label>

//         {/* TextField for Context */}
//         <TextField
//           label="Optional Context"
//           variant="outlined"
//           multiline
//           rows={4}
//           fullWidth
//           value={context}
//           onChange={(e) => setContext(e.target.value)}
//           style={{ marginBottom: '20px', backgroundColor: '#424242' }}
//           InputLabelProps={{ style: { color: '#b0bec5' } }}
//           InputProps={{ style: { color: '#ffffff' } }}
//         />

//         {/* Images Grid */}
//         <Grid container spacing={2}>
//           {Array.from(images).map((image, index) => (
//             <Grid item key={index} style={{ position: 'relative' }}>
//               <Card style={{ backgroundColor: '#424242', borderRadius: '10px' }}>
//                 <CardMedia
//                   component="img"
//                   height="100"
//                   image={URL.createObjectURL(image)}
//                   alt={`Image ${index + 1}`}
//                   onClick={() => handlePreviewImage(image)}
//                   style={{ cursor: 'pointer', borderRadius: '10px' }}
//                 />
//                 <Tooltip title="Remove Image" arrow>
//                   <IconButton
//                     onClick={() => handleRemoveImage(index)}
//                     style={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//                   >
//                     <Close />
//                   </IconButton>
//                 </Tooltip>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Submit Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={loading || images.length === 0}
//           style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '25px' }}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
//         </Button>

//         {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}

//         {/* Image Preview Dialog */}
//         <Dialog open={!!previewImage} onClose={handleClosePreview}>
//           <DialogContent>
//             {previewImage && <img src={URL.createObjectURL(previewImage)} alt="Preview" style={{ maxWidth: '100%', borderRadius: '10px' }} />}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default ImageUploader;


// import React, { useState } from 'react';
// import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, IconButton, Dialog, DialogContent, Tooltip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { Add, Close } from '@mui/icons-material';

// // Create a dark theme
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#90caf9',
//     },
//     background: {
//       default: '#121212',
//       paper: '#2e2e2e',
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#b0bec5',
//     },
//   },
// });

// const ImageUploader = ({ context, handleImageUpload, setContext, handleSubmit, loading, error }) => {
//   const [images, setImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleRemoveImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//   };

//   const handlePreviewImage = (image) => {
//     setPreviewImage(image);
//   };

//   const handleClosePreview = () => {
//     setPreviewImage(null);
//   };

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#2e2e2e', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)', borderRadius: '15px', maxWidth: '600px' }}>
//         {/* File Input */}
//         <input
//           accept="image/*"
//           type="file"
//           multiple
//           onChange={(e) => {
//             handleImageUpload(e);
//             setImages([...images, ...e.target.files]);
//           }}
//           style={{ display: 'none' }}
//           id="file-input"
//         />
//         <label htmlFor="file-input">
//           <Tooltip title="Add Image" arrow>
//             <IconButton color="primary" component="span">
//               <Add fontSize="large" />
//             </IconButton>
//           </Tooltip>
//         </label>

//         {/* TextField for Context */}
//         <TextField
//           label="Optional Context"
//           variant="outlined"
//           multiline
//           rows={4}
//           fullWidth
//           value={context}
//           onChange={(e) => setContext(e.target.value)}
//           style={{ marginBottom: '20px', backgroundColor: '#424242' }}
//           InputLabelProps={{ style: { color: '#b0bec5' } }}
//           InputProps={{ style: { color: '#ffffff' } }}
//         />

//         {/* Images Grid */}
//         <Grid container spacing={2}>
//           {Array.from(images).map((image, index) => (
//             <Grid item key={index} style={{ position: 'relative' }}>
//               <Card style={{ backgroundColor: '#424242', borderRadius: '10px' }}>
//                 <CardMedia
//                   component="img"
//                   height="100"
//                   image={URL.createObjectURL(image)}
//                   alt={`Image ${index + 1}`}
//                   onClick={() => handlePreviewImage(image)}
//                   style={{ cursor: 'pointer', borderRadius: '10px' }}
//                 />
//                 <Tooltip title="Remove Image" arrow>
//                   <IconButton
//                     onClick={() => handleRemoveImage(index)}
//                     style={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//                   >
//                     <Close />
//                   </IconButton>
//                 </Tooltip>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Submit Button */}
//         <Button
//           variant="contained"
//           color="#3f51b5"
//           onClick={handleSubmit}
//           disabled={loading || images.length === 0}
//           style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '25px' }}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
//         </Button>

//         {error && <Typography color="error" style={{ marginTop: '10px' }}>{error}</Typography>}

//         {/* Image Preview Dialog */}
//         <Dialog open={!!previewImage} onClose={handleClosePreview}>
//           <DialogContent>
//             {previewImage && <img src={URL.createObjectURL(previewImage)} alt="Preview" style={{ maxWidth: '100%', borderRadius: '10px' }} />}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default ImageUploader;

// import React, { useState } from 'react';
// import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, IconButton, Dialog, DialogContent, Tooltip } from '@mui/material';
// import { Add, Close } from '@mui/icons-material';

// const ImageUploader = ({ context, handleImageUpload, setContext, handleSubmit, loading, error }) => {
//   const [images, setImages] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleRemoveImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//   };

//   const handlePreviewImage = (image) => {
//     setPreviewImage(image);
//   };

//   const handleClosePreview = () => {
//     setPreviewImage(null);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#f5f5f5', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px', maxWidth: '500px' }}>
//       <input
//         accept="image/*"
//         type="file"
//         multiple
//         onChange={(e) => {
//           handleImageUpload(e); 
//           setImages([...images, ...e.target.files]);
//         }}
//         style={{ display: 'none' }}
//         id="file-input"
//       />
//       <label htmlFor="file-input">
//         <Tooltip title="Add Image" arrow>
//         <IconButton color="primary" component="span">
//           <Add fontSize="large" />
//         </IconButton>
//         </Tooltip>
//       </label>

//       <TextField
//         label="Optional Context"
//         variant="outlined"
//         multiline
//         rows={4}
//         fullWidth
//         value={context}
//         onChange={(e) => setContext(e.target.value)}
//         style={{ marginBottom: '20px', backgroundColor: '#ffffff' }}
//       />

//       <Grid container spacing={2}>
//         {Array.from(images).map((image, index) => (
//           <Grid item key={index} style={{ position: 'relative' }}>
//             <Card>
//               <CardMedia
//                 component="img"
//                 height="100"
//                 image={URL.createObjectURL(image)}
//                 alt={`Image ${index + 1}`}
//                 onClick={() => handlePreviewImage(image)}
//                 style={{ cursor: 'pointer' }}
//               />
//               <Tooltip title="Remove Image" arrow>
//               <IconButton
//                 onClick={() => handleRemoveImage(index)}
//                 style={{ position: 'absolute', top: 0, right: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//               >
//                 <Close />
//               </IconButton>
//               </Tooltip>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         disabled={loading || images.length === 0}
//         style={{ marginTop: '20px' }}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
//       </Button>

//       {error && <Typography color="error">{error}</Typography>}

//       {/* Image Preview Dialog */}
//       <Dialog open={!!previewImage} onClose={handleClosePreview}>
//         <DialogContent>
//           {previewImage && <img src={URL.createObjectURL(previewImage)} alt="Preview" style={{ maxWidth: '100%' }} />}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ImageUploader;


// import React from 'react';
// import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// // Create a dark theme
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#90caf9',
//     },
//     background: {
//       default: '#121212',
//       paper: '#1e1e1e',
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#b0bec5',
//     },
//   },
// });

// const ImageUploader = ({ images, context, handleImageUpload, setContext, handleSubmit, loading, error }) => (
//   <ThemeProvider theme={darkTheme}>
//     <CssBaseline />
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#1e1e1e', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.7)', borderRadius: '12px', maxWidth: '500px' }}>
//       <input
//         accept="image/*"
//         type="file"
//         multiple
//         onChange={handleImageUpload}
//         style={{ marginBottom: '20px', color: '#ffffff' }}
//       />

//       <TextField
//         label="Optional Context"
//         variant="outlined"
//         multiline
//         rows={4}
//         fullWidth
//         value={context}
//         onChange={(e) => setContext(e.target.value)}
//         style={{ marginBottom: '20px', backgroundColor: '#2c2c2c' }}
//         InputLabelProps={{ style: { color: '#b0bec5' } }}
//         InputProps={{ style: { color: '#ffffff' } }}
//       />

//       <Grid container spacing={2}>
//         {Array.from(images).map((image, index) => (
//           <Grid item key={index}>
//             <Card style={{ backgroundColor: '#2c2c2c' }}>
//               <CardMedia
//                 component="img"
//                 height="100"
//                 image={URL.createObjectURL(image)}
//                 alt={`Image ${index + 1}`}
//               />
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSubmit}
//         disabled={loading || images.length === 0}
//         style={{ marginTop: '20px' }}
//       >
//         {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
//       </Button>

//       {error && <Typography color="error">{error}</Typography>}
//     </div>
//   </ThemeProvider>
// );

// export default ImageUploader;

// import React from 'react';
// import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography } from '@mui/material';

// const ImageUploader = ({ images, context, handleImageUpload, setContext, handleSubmit, loading, error }) => (
//   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#fff', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px', maxWidth: '500px' }}>
//     <input
//       accept="image/*"
//       type="file"
//       multiple
//       onChange={handleImageUpload}
//       style={{ marginBottom: '20px' }}
//     />

//     <TextField
//       label="Optional Context"
//       variant="outlined"
//       multiline
//       rows={4}
//       fullWidth
//       value={context}
//       onChange={(e) => setContext(e.target.value)}
//       style={{ marginBottom: '20px' }}
//     />

//     <Grid container spacing={2}>
//       {Array.from(images).map((image, index) => (
//         <Grid item key={index}>
//           <Card>
//             <CardMedia
//               component="img"
//               height="100"
//               image={URL.createObjectURL(image)}
//               alt={`Image ${index + 1}`}
//             />
//           </Card>
//         </Grid>
//       ))}
//     </Grid>

//     <Button
//       variant="contained"
//       color="primary"
//       onClick={handleSubmit}
//       disabled={loading || images.length === 0}
//       style={{ marginTop: '20px' }}
//     >
//       {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
//     </Button>

//     {error && <Typography color="error">{error}</Typography>}
//   </div>
// );

// export default ImageUploader;

























































































