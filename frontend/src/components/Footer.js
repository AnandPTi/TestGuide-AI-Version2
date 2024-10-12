// Footer.js
// Footer.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
import { GitHub, Email, Telegram } from '@mui/icons-material';

const Footer = () => {
  return (
    <div style={{
      //position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      backgroundColor: '#1e1e1e', 
      padding: '10px 0', 
      color: '#fff', 
      textAlign: 'center',
      zIndex: 1000 // Ensures it stays above other elements
    }}>
      <BottomNavigation style={{ backgroundColor: '#1e1e1e' }}>
        <BottomNavigationAction
          label="GitHub"
          icon={
            <IconButton color="inherit" href="https://github.com/AnandPTi" target="_blank">
              <GitHub />
            </IconButton>
          }
        />
        <BottomNavigationAction
          label="Email"
          icon={
            <IconButton color="inherit" href="mailto:anandpr@iitbhilai.ac.in">
              <Email />
            </IconButton>
          }
        />
        <BottomNavigationAction
          label="Telegram"
          icon={
            <IconButton color="inherit" href="https://t.me/AnandPrakashThakur" target="_blank">
              <Telegram />
            </IconButton>
          }
        />
      </BottomNavigation>
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        TestGuideAI © Copyright 2024, All Rights Reserved by TestGuide™, Inc.
      </div>
    </div>
  );
};

export default Footer;

// import React from 'react';
// import { BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
// import { GitHub, Email, Telegram } from '@mui/icons-material';

// const Footer = () => {
//   return (
//     <div style={{ backgroundColor: '#1e1e1e', padding: '10px 0', color: '#fff', textAlign: 'center' }}>
//       <BottomNavigation style={{ backgroundColor: '#1e1e1e' }}>
//         <BottomNavigationAction
//           label="GitHub"
//           icon={<IconButton color="inherit" href="https://github.com/AnandPTi" target="_blank"><GitHub /></IconButton>}
//         />
//         <BottomNavigationAction
//           label="Email"
//           icon={<IconButton color="inherit" href="mailto:anandpr@iitbhilai.ac.in"><Email /></IconButton>}
//         />
//         <BottomNavigationAction
//           label="Telegram"
//           icon={<IconButton color="inherit" href="https://t.me/AnandPrakashThakur" target="_blank"><Telegram /></IconButton>}
//         />
//       </BottomNavigation>
//       <div style={{ marginTop: '10px', fontSize: '14px' }}>
//         TestGuideAI © Copyright 2024, All Rights Reserved by TestGuide™, Inc.
//       </div>
//     </div>
//   );
// };

// export default Footer;

// import React from 'react';
// import { BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
// import { GitHub, Email, Telegram } from '@mui/icons-material';

// const Footer = () => {
//   return (
//     <BottomNavigation style={{ backgroundColor: '#1e1e1e', marginTop: '20px' }}>
//       <BottomNavigationAction
//         label="GitHub"
//         icon={<IconButton color="inherit" href="https://github.com/AnandPTi" target="_blank"><GitHub /></IconButton>}
//       />
//       <BottomNavigationAction
//         label="Email"
//         icon={<IconButton color="inherit" href="mailto:anandpr@iitbhilai.ac.in"><Email /></IconButton>}
//       />
//       <BottomNavigationAction
//         label="Telegram"
//         icon={<IconButton color="inherit" href="https://t.me/AnandPrakashThakur" target="_blank"><Telegram /></IconButton>}
//       />
//     </BottomNavigation>
    
//   );
// };

// export default Footer;
