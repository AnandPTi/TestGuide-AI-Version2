import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Pricing = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    const emailDetails = new URLSearchParams();
    emailDetails.append('name', name);
    emailDetails.append('contact', contact);
    emailDetails.append('note', note);
  
    fetch('http://localhost:8000/send-email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Send form-encoded data
      },
      body: emailDetails.toString(), // Form-encoded body
    })
      .then((response) => {
        if (response.ok) {
          console.log('Email sent successfully');
          setOpen(false);
          setName('');
          setContact('');
          setNote('');
        } else {
          console.error('Failed to send email');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
//   const handleSubmit = () => {
//     // Here, you can implement your email sending logic
//     const emailDetails = {
//       to: 'anandpr@iitbhilai.ac.in',
//       subject: 'Subscription Request',
//       message: `Name: ${name}\nContact: ${contact}\nNote: ${note}`,
//     };

//     console.log('Sending email:', emailDetails); // Replace this with your email sending logic

//     // Close the dialog after submitting
//     setOpen(false);
//     setName('');
//     setContact('');
//     setNote('');
//   };

  return (
    <Box sx={{ padding: '80px 20px', backgroundColor: 'background.default', color: 'text.primary', minHeight: '80vh' }}>
      {/* <Typography variant="h3" gutterBottom align="center" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
        Pricing Plans
      </Typography> */}
      <Typography
          variant="h3"
          component="h1"
          gutterBottom align="center"
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
          Pricing Plans
        </Typography>

      <Typography variant="h6" align="center" gutterBottom>
        Our pricing is designed to be simple and transparent. Enjoy a trial period of our features for free, and then choose the plan that best fits your needs.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* TestGuide V1 Plan */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
              TestGuide V1
            </Typography>
            <Typography variant="h4" gutterBottom>
              <CurrencyRupeeIcon sx={{ fontSize: '32px', verticalAlign: 'middle' }} />
              5 per request
            </Typography>
            <Typography variant="body1" gutterBottom>
              For large-scale users who require detailed testing instructions.
            </Typography>
            <Typography variant="h6" gutterBottom>
              100 Requests: 
              <CurrencyRupeeIcon sx={{ fontSize: '24px', verticalAlign: 'middle' }} />
              250
            </Typography>
            <Button 
                variant="contained" 
                onClick={handleClickOpen}
                sx={{ 
                    backgroundColor: '#3f51b5', 
                    color: '#fff', // Default text color
                    '&:hover': { 
                        backgroundColor: '#fff', // Background color on hover
                        color: '#3f51b5', // Text color on hover
                    },
                }}
                >
                Subscribe Now
            </Button>
          </Paper>
        </Grid>

        {/* TestGuide V1 Lite Plan */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: '10px', textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
              TestGuide V1 Lite
            </Typography>
            <Typography variant="h4" gutterBottom>
              <CurrencyRupeeIcon sx={{ fontSize: '32px', verticalAlign: 'middle' }} />
              2 per request
            </Typography>
            <Typography variant="body1" gutterBottom>
              Perfect for casual users or small teams who need essential features.
            </Typography>
            <Typography variant="h6" gutterBottom>
              100 Requests: 
              <CurrencyRupeeIcon sx={{ fontSize: '24px', verticalAlign: 'middle' }} />
              120
            </Typography>
            <Button 
                variant="contained" 
                onClick={handleClickOpen}
                sx={{ 
                    backgroundColor: '#3f51b5', 
                    color: '#fff', // Default text color
                    '&:hover': { 
                        backgroundColor: '#fff', // Background color on hover
                        color: '#3f51b5', // Text color on hover
                    },
                }}
                >
                Subscribe Now
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="body1" align="center" sx={{ marginTop: '40px' }}>
        If you have any questions regarding pricing or plans, feel free to contact us.
      </Typography>

      {/* Dialog for Note Input */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        PaperProps={{
            style: {
            padding: '20px', 
            borderRadius: '12px', 
            // background: 'linear-gradient(135deg, #f5f5f5 30%, #e0e0e0 100%)',
            background: '#2e2e2e',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
            }
        }}
        >
        <DialogTitle sx={{ 
            textAlign: 'center', 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#fff',
            //borderBottom: '2px solid #3f51b5', 
            paddingBottom: '10px' 
        }}>
            Subscription Note
        </DialogTitle>
        
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ 
                marginBottom: '15px',
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#3f51b5',
                },
                '&:hover fieldset': {
                    borderColor: '#303f9f',
                },
                }
            }}
            />
            
            <TextField
            margin="dense"
            label="Contact Details (Email or Phone)"
            type="text"
            fullWidth
            variant="outlined"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            sx={{ 
                marginBottom: '15px',
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#3f51b5',
                },
                '&:hover fieldset': {
                    borderColor: '#303f9f',
                },
                }
            }}
            />
            
            <TextField
            margin="dense"
            label="Why do you want to subscribe?"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ 
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#3f51b5',
                },
                '&:hover fieldset': {
                    borderColor: '#303f9f',
                },
                }
            }}
            />
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', marginTop: '10px' }}>
            <Button 
            onClick={handleClose} 
            sx={{ 
                backgroundColor: '#3f51b5', 
                color: '#fff', 
                '&:hover': { 
                backgroundColor: 'red',
                },
                padding: '8px 20px',
                borderRadius: '20px'
            }}
            >
            Cancel
            </Button>
            
            <Button 
            onClick={handleSubmit} 
            sx={{ 
                backgroundColor: '#3f51b5', 
                color: '#fff', 
                '&:hover': { 
                backgroundColor: '#fff',
                color: '#3f51b5',
                },
                padding: '8px 20px',
                borderRadius: '20px',
                marginLeft: '10px'
            }}
            >
            Submit
            </Button>
        </DialogActions>
        </Dialog>

    </Box>
  );
};

export default Pricing;

// import React, { useState } from 'react';
// import { Box, Typography, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// const Pricing = () => {
//   const [open, setOpen] = useState(false);
//   const [note, setNote] = useState('');

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = () => {
//     // Here, you can implement your email sending logic
//     // For example, using EmailJS or an API to send the email
//     const emailDetails = {
//       to: 'anandpr@iitbhilai.ac.in',
//       subject: 'Subscription Request',
//       message: note,
//     };

//     console.log('Sending email:', emailDetails); // Replace this with your email sending logic

//     // Close the dialog after submitting
//     setOpen(false);
//     setNote('');
//   };

//   return (
//     <Box sx={{ padding: '80px 20px', backgroundColor: 'background.default', color: 'text.primary', minHeight: '80vh' }}>
//       <Typography variant="h3" gutterBottom align="center" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
//         Pricing Plans
//       </Typography>

//       <Typography variant="h6" align="center" gutterBottom>
//         Our pricing is designed to be simple and transparent. Enjoy a trial period of our features for free, and then choose the plan that best fits your needs.
//       </Typography>

//       <Grid container spacing={4} justifyContent="center">
//         {/* TestGuide V1 Plan */}
//         <Grid item xs={12} md={4}>
//           <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', textAlign: 'center' }}>
//             <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
//               TestGuide V1
//             </Typography>
//             <Typography variant="h4" gutterBottom>
//               <CurrencyRupeeIcon sx={{ fontSize: '32px', verticalAlign: 'middle' }} />
//               5 per request
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               For large-scale users who require detailed testing instructions.
//             </Typography>
//             <Typography variant="h6" gutterBottom>
//               100 Requests: 
//               <CurrencyRupeeIcon sx={{ fontSize: '24px', verticalAlign: 'middle' }} />
//               250
//             </Typography>
//             <Button 
//                 variant="contained" 
//                 onClick={handleClickOpen}
//                 sx={{ 
//                     backgroundColor: '#3f51b5', 
//                     color: '#fff', // Default text color
//                     '&:hover': { 
//                     backgroundColor: '#fff', // Background color on hover
//                     color: '#3f51b5', // Text color on hover
//                     },
//                 }}
//                 >
//                 Subscribe Now
//             </Button>
//           </Paper>
//         </Grid>

//         {/* TestGuide V1 Lite Plan */}
//         <Grid item xs={12} md={4}>
//           <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', textAlign: 'center' }}>
//             <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
//               TestGuide V1 Lite
//             </Typography>
//             <Typography variant="h4" gutterBottom>
//               <CurrencyRupeeIcon sx={{ fontSize: '32px', verticalAlign: 'middle' }} />
//               2 per request
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               Perfect for casual users or small teams who need essential features.
//             </Typography>
//             <Typography variant="h6" gutterBottom>
//               100 Requests: 
//               <CurrencyRupeeIcon sx={{ fontSize: '24px', verticalAlign: 'middle' }} />
//               120
//             </Typography>
//             <Button 
//                 variant="contained" 
//                 onClick={handleClickOpen}
//                 sx={{ 
//                     backgroundColor: '#3f51b5', 
//                     color: '#fff', // Default text color
//                     '&:hover': { 
//                     backgroundColor: '#fff', // Background color on hover
//                     color: '#3f51b5', // Text color on hover
//                     },
//                 }}
//                 >
//                 Subscribe Now
//             </Button>
//           </Paper>
//         </Grid>
//       </Grid>

//       <Typography variant="body1" align="center" sx={{ marginTop: '40px' }}>
//         If you have any questions regarding pricing or plans, feel free to contact us.
//       </Typography>

//       {/* Dialog for Note Input */}
//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Subscription Note</DialogTitle>
//         <DialogContent>
//             <TextField
//             autoFocus
//             margin="dense"
//             label="Why do you want to subscribe?"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             />
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={handleClose} sx={{ color: '#fff' }}>
//             Cancel
//             </Button>
//             <Button onClick={handleSubmit} sx={{ color: '#fff' }}>
//             Submit
//             </Button>
//         </DialogActions>
//         </Dialog>
//     </Box>
//   );
// };

// export default Pricing;

// import React from 'react';
// import { Box, Typography, Grid, Paper, Button } from '@mui/material';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

// const Pricing = () => {
//   return (
//     <Box sx={{ padding: '80px 20px', backgroundColor: 'background.default', color: 'text.primary', minHeight: '80vh' }}>
//       <Typography variant="h3" gutterBottom align="center" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
//         Pricing Plans
//       </Typography>

//       <Typography variant="h6" align="center" gutterBottom>
//         Our pricing is designed to be simple and transparent. Enjoy a trial period of our features for free, and then choose the plan that best fits your needs.
//       </Typography>

//       <Grid container spacing={4} justifyContent="center">
//         {/* TestGuide V1 Plan */}
//         <Grid item xs={12} md={4}>
//           <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', textAlign: 'center' }}>
//             <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
//               TestGuide V1
//             </Typography>
//             <Typography variant="h4" gutterBottom>
//               <CurrencyRupeeIcon sx={{ verticalAlign: 'middle' }} />
//               5 per request
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               For large-scale users who require detailed testing instructions.
//             </Typography>
//             <Typography variant="h6" gutterBottom>
//               100 Requests: 
//               <CurrencyRupeeIcon sx={{ verticalAlign: 'middle' }} />
//               250
//             </Typography>
            // <Button 
            //     variant="contained" 
            //     sx={{ 
            //         backgroundColor: '#3f51b5', 
            //         color: '#fff', // Default text color
            //         '&:hover': { 
            //         backgroundColor: '#fff', // Background color on hover
            //         color: '#3f51b5', // Text color on hover
            //         },
            //     }}
            //     >
            //     Subscribe Now
            // </Button>
//           </Paper>
//         </Grid>

//         {/* TestGuide V1 Lite Plan */}
//         <Grid item xs={12} md={4}>
//           <Paper elevation={3} sx={{ padding: 2, borderRadius: '8px', textAlign: 'center' }}>
//             <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
//               TestGuide V1 Lite
//             </Typography>
//             <Typography variant="h4" gutterBottom>
//               <CurrencyRupeeIcon sx={{ verticalAlign: 'middle' }} />
//               2 per request
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               Perfect for casual users or small teams who need essential features.
//             </Typography>
//             <Typography variant="h6" gutterBottom>
//               100 Requests: 
//               <CurrencyRupeeIcon sx={{ verticalAlign: 'middle' }} />
//               120
//             </Typography>
//             <Button 
//             variant="contained" 
//             sx={{ 
//                 backgroundColor: '#3f51b5', 
//                 color: '#fff', // Default text color
//                 '&:hover': { 
//                 backgroundColor: '#fff', // Background color on hover
//                 color: '#3f51b5', // Text color on hover
//                 },
//             }}
//             >
//             Subscribe Now
//             </Button>
//           </Paper>
//         </Grid>
//       </Grid>

//       <Typography variant="body1" align="center" sx={{ marginTop: '40px' }}>
//         If you have any questions regarding pricing or plans, feel free to contact us.
//       </Typography>
//     </Box>
//   );
// };

// export default Pricing;


// import React from 'react';

// const Pricing = () => {
//   return (
//     <div>
//       <h1>Pricing</h1>
//       <p>This is a demo Pricing page for TestGuideAI.</p>
//     </div>
//   );
// };

// export default Pricing;
