import React from 'react';
import { Box, Typography, Grid, Paper, Avatar } from '@mui/material';
//import { styled } from '@mui/system'; // For using styled components from Material UI
import anandImage from '../anand.png'; // Adjust the path as necessary

// About Page using Dark Theme styles
const About = () => {
  return (
    <Box sx={{ padding: '20px 250px', backgroundColor: 'background.default', color: 'text.primary', minHeight: '80vh' }}>
      {/* <Typography variant="h3" gutterBottom align="center" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
        About TestGuideAI
      </Typography> */}
      
      {/* Overview Section */}
      <Typography variant="h6" gutterBottom>
        What is TestGuideAI?
      </Typography>
      <Typography variant="body1" gutterBottom>
        TestGuideAI is an advanced AI-powered platform that helps users generate and manage customized testing instructions for uploaded images. 
        The platform leverages cutting-edge machine learning and generative AI technologies to process images and provide detailed guidance based 
        on the context. Whether you are testing software, hardware, or evaluating results for research purposes, TestGuideAI simplifies the 
        process and automates instruction generation.
      </Typography>

      {/* Image Section */}
      <Grid container spacing={2} justifyContent="center" sx={{ marginY: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ backgroundColor: 'background.paper' }}>
            <img 
              src="https://www.blippar.com/uploads/images/_shareBanner/Artificial-intelligence-facts-Blippar.jpg?v=20181019" 
              alt="App Usage" 
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ backgroundColor: 'background.paper' }}>
            <img 
              src="https://pixelplex.io/wp-content/uploads/2021/01/what-is-ai-and-how-does-it-work-main-1600.jpg" 
              alt="App Interface" 
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Team Lead Section */}
      <Typography variant="h6" gutterBottom>
        About (Tech Team Lead)
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar
            alt="Anand Prakash"
            src= {anandImage} // Replace with Anand's photo if available
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">
            Anand Prakash is the Tech Team Lead at TestGuideAI and is currently pursuing a B.Tech in Electrical Engineering at IIT Bhilai.
            He has a strong background in AI and software development, and he is passionate about building innovative solutions that make 
            a real impact. You can reach him via email at <strong>anandpr@iitbhilai.ac.in</strong>.
          </Typography>
        </Grid>
      </Grid>

      {/* Future Work Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Future Work
        </Typography>
        <Typography variant="body1">
          At TestGuideAI, we're continuously innovating and improving our platform. Our future work includes:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">Integrating more advanced AI models for even better instruction generation accuracy.</Typography>
          </li>
          <li>
            <Typography variant="body1">Expanding support for more image formats and testing environments.</Typography>
          </li>
          <li>
            <Typography variant="body1">Enhancing the user interface with more interactive and intuitive features.</Typography>
          </li>
          <li>
            <Typography variant="body1">Introducing collaborative features for teams working on shared testing tasks.</Typography>
          </li>
        </ul>
      </Box>
    </Box>
  );
};

export default About;

// import React from 'react';

// const About = () => {
//   return (
//     <div>
//       <h1>About Us</h1>
//       <p>This is a demo About Us page for TestGuideAI.</p>
//     </div>
//   );
// };

// export default About;
