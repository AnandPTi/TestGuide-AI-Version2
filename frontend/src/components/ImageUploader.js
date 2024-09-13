import React, { useState } from 'react';
import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography, IconButton, Dialog, DialogContent, Tooltip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
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
        
        {/* App Title */}
        <Typography variant="h4" component="h1" style={{ color: '#90caf9', marginBottom: '10px' }}>
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
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Tooltip title="Add Image" arrow>
            <IconButton color="primary" component="span">
              <Add fontSize="large" />
            </IconButton>
          </Tooltip>
        </label>

        {/* TextField for Context */}
        <TextField
          label="Optional Context"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={context}
          onChange={(e) => setContext(e.target.value)}
          style={{ marginBottom: '20px', backgroundColor: '#424242' }}
          InputLabelProps={{ style: { color: '#b0bec5' } }}
          InputProps={{ style: { color: '#ffffff' } }}
        />

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
          color="primary"
          onClick={handleSubmit}
          disabled={loading || images.length === 0}
          style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '25px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
        </Button>

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

























































































