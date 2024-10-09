import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Solution = () => {
  return (
    <Box sx={{ padding: '40px', backgroundColor: 'background.default', color: 'text.primary', minHeight: '80vh' }}>
      <Paper elevation={3} sx={{ padding: '75px', borderRadius: '10px', backgroundColor: '#2e2e2e' }}>
        
        {/* Title */}
        <Typography variant="h3" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Solution
        </Typography>
        
        {/* Problem Statement */}
        <Typography variant="h6" gutterBottom>
          What Problem Does TestGuideAI Solve?
        </Typography>
        <Typography variant="body1" paragraph>
          In today's fast-paced and ever-evolving tech landscape, manual testing and quality assurance have become bottlenecks in the software development lifecycle. TestGuideAI is here to solve that problem by providing automated, intelligent testing assistance to help developers and teams ensure the accuracy and efficiency of their testing processes. 
          Whether you're managing complex API tests, running large-scale regression testing, or handling edge-case testing, TestGuideAI simplifies and automates these tasks, ensuring fewer human errors and faster execution times.
        </Typography>

        {/* Practical Use Cases */}
        <Typography variant="h6" gutterBottom>
          Practical Use Cases
        </Typography>
        <Typography variant="body1" paragraph>
          TestGuideAI can be applied in various sectors where automated testing is crucial:
        </Typography>
        <ul>
          <li><Typography variant="body1"><strong>Software Development:</strong> Automated generation of test cases for unit, integration, and end-to-end testing, reducing manual effort and accelerating development cycles.</Typography></li>
          <li><Typography variant="body1"><strong>E-commerce Applications:</strong> Ensuring that all transactions, user flows, and payment gateways are functional and seamless across multiple platforms.</Typography></li>
          <li><Typography variant="body1"><strong>APIs and Web Services:</strong> Automatically generating, executing, and validating API requests and responses to ensure functionality across different environments.</Typography></li>
          <li><Typography variant="body1"><strong>Healthcare & Finance:</strong> Ensuring mission-critical applications such as healthcare management systems and banking software are always reliable and secure with constant, automated regression tests.</Typography></li>
        </ul>

        {/* Necessity Explanation */}
        <Typography variant="h6" gutterBottom>
          Why Is It Necessary?
        </Typography>
        <Typography variant="body1" paragraph>
          Manual testing is time-consuming, prone to human error, and often lacks comprehensive coverage. As software projects grow, the need for efficient, automated testing becomes crucial to maintaining product quality and keeping pace with rapid iterations. TestGuideAI automates this process by offering AI-powered test creation and verification that reduces the reliance on manual testers and increases confidence in your software.
        </Typography>
        <Typography variant="body1" paragraph>
          With the growing complexity of applications, especially in industries like healthcare, finance, and e-commerce, ensuring that every function works as intended under all scenarios is imperative. TestGuideAI offers that safety net, ensuring that your software delivers an error-free experience to your users.
        </Typography>

      </Paper>
    </Box>
  );
};

export default Solution;
