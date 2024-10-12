import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Snackbar, Alert, TextField, Button, ButtonGroup, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MinimizeIcon from '@mui/icons-material/Minimize';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send'; // Send (Submit) icon
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ReactMarkdown from 'react-markdown';
import removeMarkdown from 'remove-markdown'; // Import the remove-markdown library
import axios from 'axios';

const ResponsePopup = ({ response, closePopup }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [minimized, setMinimized] = useState(false); // Track minimized state
  const [editableContent, setEditableContent] = useState(response); // Track editable content
  const [isPreview, setIsPreview] = useState(false); // Track preview mode
  const [saveSuccess, setSaveSuccess] = useState(false); // Track save status
  const [heading, setHeading] = useState(''); // Track the heading
  const [showSaveDialog, setShowSaveDialog] = useState(false); // Toggle save dialog visibility

  // Disable page scroll when the popup is open
  useEffect(() => {
    document.body.style.overflow = minimized ? 'auto' : 'hidden';
    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
    };
  }, [minimized]);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopySuccess(true); // Show "copied" message
  };

  // Handle download as a text file (plain text without markdown syntax)
  const handleDownload = () => {
    let plainTextContent = removeMarkdown(editableContent);
    plainTextContent = plainTextContent.replace(/\*\*/g, ''); // Remove remaining **

    const blob = new Blob([plainTextContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated_test_instructions.txt';
    link.click();
  };

  // Handle the Save button click (opens dialog)
  const handleOpenSaveDialog = () => {
    setShowSaveDialog(true); // Show the save popup
  };

  // Handle submitting the save form
  const handleSave = async () => {
    if (!heading) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      const formData = new FormData();
      formData.append('response_text', editableContent);
      formData.append('heading', heading); // Include heading in the form data

      const res = await axios.post(
        'http://127.0.0.1:8000/save-response/', 
        formData,
        { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.status === 200) {
        setSaveSuccess(true);
      }
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
      setShowSaveDialog(false); // Close the dialog after saving
    }
  };

  // Handle cancel button in the dialog
  const handleCancel = () => {
    setShowSaveDialog(false); // Close the save dialog without saving
  };

  // Toggle between edit and preview modes
  const handleTogglePreview = (mode) => {
    setIsPreview(mode === 'preview');
  };

  return (
    <>
      {!minimized ? (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bgcolor="rgba(0, 0, 0, 0.7)" // Dark overlay
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="1300" // Ensure it's above all content
        >
          <Box
            width="90%"
            maxWidth="800px"
            bgcolor="#2e2e2e" // Dark grey background for popup
            borderRadius={4}
            p={3}
            boxShadow={24}
            display="flex"
            flexDirection="column"
            position="relative"
            overflow="hidden"
          >
            {/* Header with minimize, download, and close buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" style={{ color: '#fff', fontWeight: "bold" }}>
                Generated Test Instructions
              </Typography>
              <Box>
                <Tooltip title="Download">
                  <IconButton onClick={handleDownload} style={{ marginRight: '10px', color: '#fff' }}>
                    <ArrowCircleDownIcon style={{ fontSize: 27 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Save">
                  <IconButton onClick={handleOpenSaveDialog} style={{ marginRight: '10px', color: '#fff' }}>
                    <SaveIcon style={{ fontSize: 27 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Minimize">
                  <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px', color: '#fff' }}>
                    <MinimizeIcon style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton onClick={closePopup} style={{ color: '#fff' }}>
                    <CloseIcon style={{ fontSize: 25 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Sticky Buttons Group */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              p={1}
              bgcolor="#2e2e2e"
              position="sticky"
              top="0"
              zIndex="1400"
              style={{ borderBottom: '1px solid #444' }} // Sticky toolbar style
            >
              {/* Button group for preview and edit modes */}
              <ButtonGroup>
                <Tooltip title="Edit the Response">
                  <Button
                    variant={!isPreview ? 'contained' : 'outlined'}
                    onClick={() => handleTogglePreview('edit')}
                    style={{ color: '#fff', backgroundColor: isPreview ? 'transparent' : '#3f51b5', border: '1px solid #fff',fontWeight: 'bold'}}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Preview the Response">
                  <Button
                    variant={isPreview ? 'contained' : 'outlined'}
                    onClick={() => handleTogglePreview('preview')}
                    style={{ color: '#fff', backgroundColor: isPreview ? '#3f51b5' : 'transparent', border: '1px solid #fff', fontWeight: 'bold' }}
                  >
                    Preview
                  </Button>
                </Tooltip>
              </ButtonGroup>
              {/* Copy button beside the Edit/Preview */}
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={handleCopy} style={{ color: '#fff'}}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Scrollable content with editable option or markdown preview */}
            <Box
              maxHeight="600px" // Limits the height, making it scrollable if content is long
              overflow="auto"  // Vertical scroll only
              p={2}
              border="1px solid #444"
              style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', color: '#fff' }} // Black content area
            >
              {isPreview ? (
                <ReactMarkdown>{editableContent}</ReactMarkdown>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  minRows={10}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  variant="outlined"
                  placeholder="Edit your instructions here..."
                  InputProps={{ style: { color: '#fff', backgroundColor: '#000' } }} // Input area styling
                />
              )}
            </Box>

            {/* Snackbar for "Copied" message */}
            <Snackbar
              open={copySuccess}
              autoHideDuration={2000} // 2 seconds before auto-hide
              onClose={() => setCopySuccess(false)}
            >
              <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
                Copied to clipboard!
              </Alert>
            </Snackbar>
            {/* Snackbar for "Saved" message */}
            <Snackbar
              open={saveSuccess}
              autoHideDuration={2000}
              onClose={() => setSaveSuccess(false)}
            >
              <Alert onClose={() => setSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
                Response saved successfully!
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      ) : (
        // Minimized View
        <Box
          position="fixed"
          bottom="120px"
          right="20px"
          bgcolor="#3f51b5"
          color="#fff"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          borderRadius="25px"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
          zIndex="600"
          width="222px"
          sx={{
            //cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#fff', // Slightly lighter shade on hover
              color:"#3f51b5",
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', // Slightly stronger shadow on hover
              transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Show Instructions
          </Typography>

          <Tooltip title="Restore">
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent the Box's click handler from triggering
                setMinimized(false); // Trigger restore action only on icon click
              }}
              style={{ color: 'black' }}
            >
              <RestoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onClose={handleCancel}>
        <DialogTitle>Save Test Instructions</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Heading"
            fullWidth
            variant="outlined"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" startIcon={<SendIcon />}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResponsePopup;

// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert, TextField, Button, ButtonGroup, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import SaveIcon from '@mui/icons-material/Save'; // Add Save Icon
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';
// import removeMarkdown from 'remove-markdown'; // Import the remove-markdown library
// import axios from 'axios';

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state
//   const [editableContent, setEditableContent] = useState(response); // Track editable content
//   const [isPreview, setIsPreview] = useState(false); // Track preview mode
//   const [saveSuccess, setSaveSuccess] = useState(false); // Track save status
//   const [heading, setHeading] = useState(''); // Track the heading
//   const [showHeadingInput, setShowHeadingInput] = useState(false); // Toggle heading input visibility

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(editableContent);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file (plain text without markdown syntax)
//   const handleDownload = () => {
//     let plainTextContent = removeMarkdown(editableContent);
//     plainTextContent = plainTextContent.replace(/\*\*/g, ''); // Remove remaining **

//     const blob = new Blob([plainTextContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };
//   const handleSave = async () => {
//     if (!heading) {
//       setShowHeadingInput(true); // Show heading input if no heading is provided
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Token being sent:', token);
//       const formData = new FormData();
//       formData.append('response_text', editableContent);
//       formData.append('heading', heading); // Include heading in the form data

//       const res = await axios.post(
//         'http://127.0.0.1:8000/save-response/', 
//         formData,
//         { 
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       if (res.status === 200) {
//         setSaveSuccess(true);
//       }
//     } catch (error) {
//       console.error('Error saving response:', error);
//     }
//   };
//   // const handleSave = async () => {
//   //   try {
//   //     const token = localStorage.getItem('token'); // Retrieve token from localStorage
//   //     console.log('Token being sent:', token); // Check the token
//   //     const formData = new FormData();
//   //     formData.append('response_text', editableContent);
  
//   //     const res = await axios.post(
//   //       'http://127.0.0.1:8000/save-response/', 
//   //       formData,
//   //       { 
//   //         headers: {
//   //           'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure this format
//   //           'Content-Type': 'multipart/form-data'
//   //         }
//   //       }
//   //     );
  
//   //     if (res.status === 200) {
//   //       setSaveSuccess(true);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error saving response:', error);
//   //   }
//   // };
  
  
  

//   // Toggle between edit and preview modes
//   const handleTogglePreview = (mode) => {
//     setIsPreview(mode === 'preview');
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.7)" // Dark overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#2e2e2e" // Dark grey background for popup
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#fff', fontWeight: "bold" }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px', color: '#fff' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 {showHeadingInput && (
//                 <Box mb={2}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     label="Enter a Heading"
//                     value={heading}
//                     onChange={(e) => setHeading(e.target.value)}
//                     InputProps={{ style: { color: '#fff' } }}
//                   />
//                 </Box>
//               )}

//               <Tooltip title="Save">
//                 <IconButton onClick={handleSave} style={{ marginRight: '10px', color: '#fff' }}>
//                   <SaveIcon style={{ fontSize: 27 }} />
//                 </IconButton>
//               </Tooltip>
//                 {/* <Tooltip title="Save">
//                   <IconButton onClick={handleSave} style={{ marginRight: '10px', color: '#fff' }}>
//                     <SaveIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip> */}
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px', color: '#fff' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup} style={{ color: '#fff' }}>
//                     <CloseIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Sticky Buttons Group */}
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={2}
//               p={1}
//               bgcolor="#2e2e2e"
//               position="sticky"
//               top="0"
//               zIndex="1400"
//               style={{ borderBottom: '1px solid #444' }} // Sticky toolbar style
//             >
//               {/* Button group for preview and edit modes */}
//               <ButtonGroup>
//                 <Tooltip title="Edit the Response">
//                   <Button
//                     variant={!isPreview ? 'contained' : 'outlined'}
//                     onClick={() => handleTogglePreview('edit')}
//                     style={{ color: '#fff', backgroundColor: isPreview ? 'transparent' : '#3f51b5', border: '1px solid #fff',fontWeight: 'bold'}}
//                   >
//                     Edit
//                   </Button>
//                 </Tooltip>
//                 <Tooltip title="Preview the Response">
//                   <Button
//                     variant={isPreview ? 'contained' : 'outlined'}
//                     onClick={() => handleTogglePreview('preview')}
//                     style={{ color: '#fff', backgroundColor: isPreview ? '#3f51b5' : 'transparent', border: '1px solid #fff', fontWeight: 'bold' }}
//                   >
//                     Preview
//                   </Button>
//                 </Tooltip>
//               </ButtonGroup>
//               {/* Copy button beside the Edit/Preview */}
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy} style={{ color: '#fff'}}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Scrollable content with editable option or markdown preview */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               p={2}
//               border="1px solid #444"
//               style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', color: '#fff' }} // Black content area
//             >
//               {isPreview ? (
//                 <ReactMarkdown>{editableContent}</ReactMarkdown>
//               ) : (
//                 <TextField
//                   fullWidth
//                   multiline
//                   minRows={10}
//                   value={editableContent}
//                   onChange={(e) => setEditableContent(e.target.value)}
//                   variant="outlined"
//                   placeholder="Edit your instructions here..."
//                   InputProps={{ style: { color: '#fff', backgroundColor: '#000' } }} // Input area styling
//                 />
//               )}
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//             {/* Snackbar for "Saved" message */}
//             {/* Snackbar for "Saved" message */}
//           <Snackbar
//             open={saveSuccess}
//             autoHideDuration={2000}
//             onClose={() => setSaveSuccess(false)}
//           >
//             <Alert onClose={() => setSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
//               Saved successfully!
//             </Alert>
//           </Snackbar>
//             {/* <Snackbar
//               open={saveSuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setSaveSuccess(false)}
//             >
//               <Alert onClose={() => setSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Saved to saved response!
//               </Alert>
//             </Snackbar> */}
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="120px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="25px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="600"
//           width="222px"
//           sx={{
//             //cursor: 'pointer',
//             '&:hover': {
//               backgroundColor: '#fff', // Slightly lighter shade on hover
//               color:"#3f51b5",
//               boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)', // Slightly stronger shadow on hover
//               transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
//             },
//           }}
//         >
//           <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//             Show Instructions
//           </Typography>

//           <Tooltip title="Restore">
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation(); // Prevent the Box's click handler from triggering
//                 setMinimized(false); // Trigger restore action only on icon click
//               }}
//               style={{ color: 'black' }}
//             >
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>

//       )}
//     </>
//   );
// };

// export default ResponsePopup;


// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert, TextField, Button, ButtonGroup, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';
// import removeMarkdown from 'remove-markdown'; // Import the remove-markdown library

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state
//   const [editableContent, setEditableContent] = useState(response); // Track editable content
//   const [isPreview, setIsPreview] = useState(false); // Track preview mode

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(editableContent);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file (plain text without markdown syntax)
//   const handleDownload = () => {
//     let plainTextContent = removeMarkdown(editableContent);
//     plainTextContent = plainTextContent.replace(/\*\*/g, ''); // Remove remaining **

//     const blob = new Blob([plainTextContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };

//   // Toggle between edit and preview modes
//   const handleTogglePreview = (mode) => {
//     setIsPreview(mode === 'preview');
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.7)" // Dark overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#2e2e2e" // Dark grey background for popup
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#fff', fontWeight: "bold" }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px', color: '#fff' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px', color: '#fff' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup} style={{ color: '#fff' }}>
//                     <CloseIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Sticky Buttons Group */}
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={2}
//               p={1}
//               bgcolor="#2e2e2e"
//               position="sticky"
//               top="0"
//               zIndex="1400"
//               style={{ borderBottom: '1px solid #444' }} // Sticky toolbar style
//             >
//               {/* Button group for preview and edit modes */}
//               <ButtonGroup>
//                 <Tooltip title="Edit the Response">
//                   <Button
//                     variant={!isPreview ? 'contained' : 'outlined'}
//                     onClick={() => handleTogglePreview('edit')}
//                     style={{ color: '#fff', backgroundColor: isPreview ? 'transparent' : '#3f51b5', border: '1px solid #fff' }}
//                   >
//                     Edit
//                   </Button>
//                 </Tooltip>
//                 <Tooltip title="Preview the Response">
//                   <Button
//                     variant={isPreview ? 'contained' : 'outlined'}
//                     onClick={() => handleTogglePreview('preview')}
//                     style={{ color: '#fff', backgroundColor: isPreview ? '#3f51b5' : 'transparent', border: '1px solid #fff' }}
//                   >
//                     Preview
//                   </Button>
//                 </Tooltip>
//               </ButtonGroup>

//               {/* Copy button beside the Edit/Preview */}
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy} style={{ color: '#fff' }}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Scrollable content with editable option or markdown preview */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               p={2}
//               border="1px solid #444"
//               style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', color: '#fff' }} // Black content area
//             >
//               {isPreview ? (
//                 <ReactMarkdown>{editableContent}</ReactMarkdown>
//               ) : (
//                 <TextField
//                   fullWidth
//                   multiline
//                   minRows={10}
//                   value={editableContent}
//                   onChange={(e) => setEditableContent(e.target.value)}
//                   variant="outlined"
//                   placeholder="Edit your instructions here..."
//                   InputProps={{ style: { color: '#fff', backgroundColor: '#000' } }} // Input area styling
//                 />
//               )}
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="25px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <Tooltip title="Restore">
//             <IconButton style={{ color: '#fff' }}>
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;

//***********************Better UI Dark UI********************************** */
// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert, TextField, Button, ButtonGroup, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';
// import removeMarkdown from 'remove-markdown'; // Import the remove-markdown library

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state
//   const [editableContent, setEditableContent] = useState(response); // Track editable content
//   const [isPreview, setIsPreview] = useState(false); // Track preview mode

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(editableContent);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file (plain text without markdown syntax)
//   const handleDownload = () => {
//     // Convert markdown to plain text
//     let plainTextContent = removeMarkdown(editableContent);
    
//     // Manually remove leftover Markdown symbols like ** or any other
//     plainTextContent = plainTextContent.replace(/\*\*/g, ''); // Remove all remaining **

//     // Create a downloadable text file
//     const blob = new Blob([plainTextContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };

//   // Toggle between edit and preview modes
//   const handleTogglePreview = (mode) => {
//     setIsPreview(mode === 'preview');
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.7)" // Dark overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#2e2e2e" // Dark grey background for popup
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#fff', fontWeight: "bold" }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px', color: '#fff' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px', color: '#fff' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup} style={{ color: '#fff' }}>
//                     <CloseIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Button group for preview and edit modes */}
//             <Box mb={2} display="flex" justifyContent="flex-end" alignItems="center">
//               <ButtonGroup>
//                 <Tooltip title="Edit the Response">
//                   <Button
//                     variant={!isPreview ? 'contained' : 'outlined'}
//                     onClick={() => handleTogglePreview('edit')}
//                     style={{ color: '#fff', backgroundColor: isPreview ? 'transparent' : '#3f51b5', border: '1px solid #fff' }}
//                   >
//                     Edit
//                   </Button>
//                 </Tooltip>
//                 <Tooltip title="Preview the Response">
//                   <Button
//                     variant={isPreview ? 'contained' : 'outlined'}
//                     onClick={() => handleTogglePreview('preview')}
//                     style={{ color: '#fff', backgroundColor: isPreview ? '#3f51b5' : 'transparent', border: '1px solid #fff' }}
//                   >
//                     Preview
//                   </Button>
//                 </Tooltip>
//               </ButtonGroup>
//             </Box>

//             {/* Scrollable content with editable option or markdown preview */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               p={2}
//               border="1px solid #444"
//               style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', color: '#fff' }} // Black content area
//             >
//               {isPreview ? (
//                 <ReactMarkdown>{editableContent}</ReactMarkdown>
//               ) : (
//                 <TextField
//                   fullWidth
//                   multiline
//                   minRows={10}
//                   value={editableContent}
//                   onChange={(e) => setEditableContent(e.target.value)}
//                   variant="outlined"
//                   placeholder="Edit your instructions here..."
//                   InputProps={{ style: { color: '#fff', backgroundColor: '#000' } }} // Input area styling
//                 />
//               )}
//             </Box>

//             {/* Footer with copy button */}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy} style={{ color: '#fff' }}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="4px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <Tooltip title="Restore">
//             <IconButton style={{ color: '#fff' }}>
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;


//***************************Toggle dual button with remove markdown download******************************************* */
// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert, TextField, Button, ButtonGroup, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';
// import removeMarkdown from 'remove-markdown'; // Import the remove-markdown library

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state
//   const [editableContent, setEditableContent] = useState(response); // Track editable content
//   const [isPreview, setIsPreview] = useState(false); // Track preview mode

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(editableContent);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file
//   const handleDownload = () => {
//     // Convert markdown to plain text
//     let plainTextContent = removeMarkdown(editableContent);
    
//     // Manually remove leftover Markdown symbols like ** or any other
//     plainTextContent = plainTextContent.replace(/\*\*/g, ''); // Remove all remaining **

//     // Create a downloadable text file
//     const blob = new Blob([plainTextContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };
//   // const handleDownload = () => {
//   //   const blob = new Blob([editableContent], { type: 'text/plain' });
//   //   const link = document.createElement('a');
//   //   link.href = URL.createObjectURL(blob);
//   //   link.download = 'generated_test_instructions.txt';
//   //   link.click();
//   // };
//   // const handleDownload = () => {
//   //   const plainTextContent = removeMarkdown(editableContent); // Convert markdown to plain text
//   //   const blob = new Blob([plainTextContent], { type: 'text/plain' });
//   //   const link = document.createElement('a');
//   //   link.href = URL.createObjectURL(blob);
//   //   link.download = 'generated_test_instructions.txt';
//   //   link.click();
//   // };

//   // Handle save changes
//   // const handleSave = () => {
//   //   setIsPreview(true); // Switch to preview after saving
//   // };

//   // Toggle between edit and preview modes
//   const handleTogglePreview = (mode) => {
//     setIsPreview(mode === 'preview');
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.5)" // Background overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#fff"
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#36454f', fontWeight: "bold" }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup}>
//                     <CloseIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Button group for preview and edit modes */}
//             <Box mb={2} display="flex" justifyContent="flex-end" alignItems="center">
//               <ButtonGroup>
//                 <Tooltip title="Edit the Response">
//                 <Button
//                   variant={!isPreview ? 'contained' : 'outlined'}
//                   onClick={() => handleTogglePreview('edit')}
//                 >
//                   Edit
//                 </Button>
//                 </Tooltip>
//                 <Tooltip title="Preview the Response">
//                 <Button
//                   variant={isPreview ? 'contained' : 'outlined'}
//                   onClick={() => handleTogglePreview('preview')}
//                 >
//                   Preview
//                 </Button>
//                 </Tooltip>
//               </ButtonGroup>
//             </Box>

//             {/* Scrollable content with editable option or markdown preview */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               p={2}
//               border="1px solid #ddd"
//               style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
//             >
//               {isPreview ? (
//                 <ReactMarkdown>{editableContent}</ReactMarkdown>
//               ) : (
//                 <TextField
//                   fullWidth
//                   multiline
//                   minRows={10}
//                   value={editableContent}
//                   onChange={(e) => setEditableContent(e.target.value)}
//                   variant="outlined"
//                   placeholder="Edit your instructions here..."
//                 />
//               )}
//             </Box>

//             {/* Footer with copy button */}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="4px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <Tooltip title="Restore">
//             <IconButton style={{ color: '#fff' }}>
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;

//*******************************Toggle single button*********************************** */
// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert, TextField, Button, Switch, FormControlLabel } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';
// import { Tooltip } from '@mui/material';

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state
//   const [editableContent, setEditableContent] = useState(response); // Track editable content
//   const [isPreview, setIsPreview] = useState(false); // Track preview mode

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(editableContent);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file
//   const handleDownload = () => {
//     const blob = new Blob([editableContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };

//   // Handle save changes
//   const handleSave = () => {
//     setIsPreview(true); // Switch to preview after saving
//   };

//   // Toggle between edit and preview modes
//   const handleTogglePreview = () => {
//     setIsPreview(!isPreview);
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.5)" // Background overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#fff"
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#36454f', fontWeight: "bold" }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup}>
//                     <CloseIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Toggle switch for preview mode */}
//             <Box mb={2} display="flex" justifyContent="flex-end" alignItems="center">
//               <FormControlLabel
//                 control={<Switch checked={isPreview} onChange={handleTogglePreview} />}
//                 label={isPreview ? "Preview" : "Edit"}
//               />
//             </Box>

//             {/* Scrollable content with editable option or markdown preview */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               p={2}
//               border="1px solid #ddd"
//               style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
//             >
//               {isPreview ? (
//                 <ReactMarkdown>{editableContent}</ReactMarkdown>
//               ) : (
//                 <TextField
//                   fullWidth
//                   multiline
//                   minRows={10}
//                   value={editableContent}
//                   onChange={(e) => setEditableContent(e.target.value)}
//                   variant="outlined"
//                   placeholder="Edit your instructions here..."
//                 />
//               )}
//             </Box>

//             {/* Footer with copy button */}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="4px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <Tooltip title="Restore">
//             <IconButton style={{ color: '#fff' }}>
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;





//*********************************Editable side by side*********************************************************** */

// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert, TextField, Tooltip } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state
//   const [editedResponse, setEditedResponse] = useState(response); // Editable content

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(editedResponse);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file
//   const handleDownload = () => {
//     const blob = new Blob([editedResponse], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.5)" // Background overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#fff"
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#36454f', fontWeight: 'bold' }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup}>
//                     <CloseIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Editable content */}
//             {/* <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               p={2}
//               border="1px solid #ddd"
//               style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
//             >
//               <TextField
//                 multiline
//                 minRows={20}
//                 variant="outlined"
//                 fullWidth
//                 value={editedResponse}
//                 onChange={(e) => setEditedResponse(e.target.value)}
//                 style={{ backgroundColor: '#fff' }}
//               />
//             </Box> */}
//             <Box
//               maxHeight="600px"
//               overflow="auto"
//               p={2}
//               border="1px solid #ddd"
//               style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
//             >
//               <Box display="flex">
//                 {/* Editable TextField */}
//                 <Box width="50%" p={1}>
//                   <TextField
//                     multiline
//                     minRows={20}
//                     variant="outlined"
//                     fullWidth
//                     value={editedResponse}
//                     onChange={(e) => setEditedResponse(e.target.value)}
//                     style={{ backgroundColor: '#fff' }}
//                   />
//                 </Box>
//                 {/* Live Markdown Preview */}
//                 <Box width="50%" p={1} overflow="auto">
//                   <ReactMarkdown>{editedResponse}</ReactMarkdown>
//                 </Box>
//               </Box>
//             </Box>


//             {/* Footer with copy button */}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="4px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <Tooltip title="Restore">
//             <IconButton style={{ color: '#fff' }}>
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;



//***********************************************Normal not editable Till best************************************************************************* */

// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
// import ReactMarkdown from 'react-markdown';
// import { Tooltip } from '@mui/material';


// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(response);
//     setCopySuccess(true); // Show "copied" message
//   };

//   // Handle download as a text file
//   const handleDownload = () => {
//     const blob = new Blob([response], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'generated_test_instructions.txt';
//     link.click();
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.5)" // Background overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#fff"
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize, download, and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#36454f', fontWeight:"bold"}}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <Tooltip title="Download">
//                   <IconButton onClick={handleDownload} style={{ marginRight: '10px' }}>
//                     <ArrowCircleDownIcon style={{ fontSize: 27 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Minimize">
//                   <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px' }}>
//                     <MinimizeIcon style={{ fontSize: 25 }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Close">
//                   <IconButton onClick={closePopup}>
//                     <CloseIcon style={{ fontSize: 25 }}/>
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Box>

//             {/* Scrollable content */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//               //overflowX="hidden" // Disable horizontal scroll
//               p={2}
//               border="1px solid #ddd"
//               style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
//             >
//               <ReactMarkdown>{response}</ReactMarkdown>
//             </Box>

//             {/* Footer with copy button */}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <Tooltip title="Copy to Clipboard">
//                 <IconButton onClick={handleCopy}>
//                   <ContentCopyIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="4px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <Tooltip title="Restore">
//             <IconButton style={{ color: '#fff' }}>
//               <RestoreIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;

// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import RestoreIcon from '@mui/icons-material/Restore';
// import ReactMarkdown from 'react-markdown';

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
//   const [minimized, setMinimized] = useState(false); // Track minimized state

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = minimized ? 'auto' : 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, [minimized]);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(response);
//     setCopySuccess(true); // Show "copied" message
//   };

//   return (
//     <>
//       {!minimized ? (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           width="100vw"
//           height="100vh"
//           bgcolor="rgba(0, 0, 0, 0.5)" // Background overlay
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           zIndex="1300" // Ensure it's above all content
//         >
//           <Box
//             width="90%"
//             maxWidth="800px"
//             bgcolor="#fff"
//             borderRadius={4}
//             p={3}
//             boxShadow={24}
//             display="flex"
//             flexDirection="column"
//             position="relative"
//             overflow="hidden"
//           >
//             {/* Header with minimize and close buttons */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" style={{ color: '#3f51b5' }}>
//                 Generated Test Instructions
//               </Typography>
//               <Box>
//                 <IconButton onClick={() => setMinimized(true)} style={{ marginRight: '10px' }}>
//                   <MinimizeIcon />
//                 </IconButton>
//                 <IconButton onClick={closePopup}>
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//             </Box>

//             {/* Scrollable content */}
//             <Box
//               maxHeight="600px" // Limits the height, making it scrollable if content is long
//               overflow="auto"  // Vertical scroll only
//              // overflowX="hidden" // Disable horizontal scroll
//               p={2}
//               border="1px solid #ddd"
//               style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}
//             >
//               <ReactMarkdown>{response}</ReactMarkdown>
//             </Box>

//             {/* Footer with copy button */}
//             <Box mt={2} display="flex" justifyContent="flex-end">
//               <IconButton onClick={handleCopy}>
//                 <ContentCopyIcon />
//               </IconButton>
//             </Box>

//             {/* Snackbar for "Copied" message */}
//             <Snackbar
//               open={copySuccess}
//               autoHideDuration={2000} // 2 seconds before auto-hide
//               onClose={() => setCopySuccess(false)}
//             >
//               <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//                 Copied to clipboard!
//               </Alert>
//             </Snackbar>
//           </Box>
//         </Box>
//       ) : (
//         // Minimized bar at the bottom-right corner
//         <Box
//           position="fixed"
//           bottom="20px"
//           right="20px"
//           bgcolor="#3f51b5"
//           color="#fff"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           p={2}
//           borderRadius="10px"
//           boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
//           zIndex="1300"
//           width="250px"
//           cursor="pointer"
//           onClick={() => setMinimized(false)}
//         >
//           <Typography variant="body1">Show Instructions</Typography>
//           <IconButton style={{ color: '#fff' }}>
//             <RestoreIcon />
//           </IconButton>
//         </Box>
//       )}
//     </>
//   );
// };

// export default ResponsePopup;

// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
// import ReactMarkdown from 'react-markdown';
// import CloseIcon from '@mui/icons-material/Close';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// const ResponsePopup = ({ response, closePopup }) => {
//   const [copySuccess, setCopySuccess] = useState(false);

//   // Disable page scroll when the popup is open
//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = 'auto'; // Re-enable scroll on cleanup
//     };
//   }, []);

//   // Handle copy to clipboard
//   const handleCopy = () => {
//     navigator.clipboard.writeText(response);
//     setCopySuccess(true); // Show "copied" message
//   };

//   return (
//     <Box
//       position="fixed"
//       top="0"
//       left="0"
//       width="100vw"
//       height="100vh"
//       bgcolor="rgba(0, 0, 0, 0.5)" // Background overlay
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       zIndex="1300" // Ensure it's above all content
//     >
//       <Box
//         width="90%"
//         maxWidth="800px"
//         bgcolor="#fff"
//         borderRadius={4}
//         p={3}
//         boxShadow={24}
//         display="flex"
//         flexDirection="column"
//       >
//         {/* Header with close button */}
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h6">Generated Test Instructions</Typography>
//           <IconButton onClick={closePopup}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {/* Scrollable content */}
//         <Box
//           maxHeight="600px" // Limits the height, making it scrollable if content is long
//           overflow="auto"  // Vertical scroll only
//           p={2}
//           border="1px solid #ddd"
//         >
//           <ReactMarkdown>{response}</ReactMarkdown>
//         </Box>

//         {/* Footer with copy button */}
//         <Box mt={2} display="flex" justifyContent="flex-end">
//           <IconButton onClick={handleCopy}>
//             <ContentCopyIcon />
//           </IconButton>
//         </Box>

//         {/* Snackbar for "Copied" message */}
//         <Snackbar
//           open={copySuccess}
//           autoHideDuration={2000} // 2 seconds before auto-hide
//           onClose={() => setCopySuccess(false)}
//         >
//           <Alert onClose={() => setCopySuccess(false)} severity="success" sx={{ width: '100%' }}>
//             Copied to clipboard!
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Box>
//   );
// };

// export default ResponsePopup;
