import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const SavedResponses = () => {
  const [savedResponses, setSavedResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedResponses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/saved-responses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSavedResponses(res.data.saved_responses);
      } catch (err) {
        setError('Failed to fetch saved responses.');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedResponses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/saved-responses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // After deletion, remove the response from the state
      setSavedResponses((prev) => prev.filter((response) => response.id !== id));
    } catch (err) {
      setError('Failed to delete the response.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Saved Responses
      </Typography>
      {savedResponses.length === 0 ? (
        <Typography>No saved responses found.</Typography>
      ) : (
        savedResponses.map((response) => (
          <Box
            key={response.id}
            sx={{
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#1e1e1e',
              borderRadius: '8px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {response.heading}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(response.id)}
              sx={{ marginTop: '10px' }}
            >
              Delete
            </Button>
            <ReactMarkdown>{response.response_text}</ReactMarkdown>
            <Typography variant="caption" color="textSecondary">
              Date: {new Date(response.timestamp).toLocaleString()}
            </Typography>
            
          </Box>
        ))
      )}
    </Box>
  );
};

export default SavedResponses;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Typography, CircularProgress } from '@mui/material';

// const SavedResponses = () => {
//   const [savedResponses, setSavedResponses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSavedResponses = async () => {
//       try {
//         const res = await axios.get('http://127.0.0.1:8000/saved-responses/', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         // Access the saved_responses key from the response object
//         setSavedResponses(res.data.saved_responses);
//       } catch (err) {
//         setError('Failed to fetch saved responses.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSavedResponses();
//   }, []);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }

//   return (
//     <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//       <Typography variant="h4" gutterBottom>
//         Saved Responses
//       </Typography>
//       {savedResponses.length === 0 ? (
//         <Typography>No saved responses found.</Typography>
//       ) : (
//         savedResponses.map((response) => (
//           <Box
//             key={response.id}
//             sx={{ marginBottom: '20px', padding: '10px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               {response.heading} {/* Display the heading */}
//             </Typography>
//             <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
//               {response.response_text}
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               Date: {new Date(response.timestamp).toLocaleString()} {/* Formatting the date */}
//             </Typography>
//           </Box>
//         ))
//       )}
//     </Box>
//   );
// };

// export default SavedResponses;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Typography, CircularProgress } from '@mui/material';

// const SavedResponses = () => {
//   const [savedResponses, setSavedResponses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSavedResponses = async () => {
//       try {
//         const res = await axios.get('http://127.0.0.1:8000/saved-responses/', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         // Access the saved_responses key from the response object
//         setSavedResponses(res.data.saved_responses);
//       } catch (err) {
//         setError('Failed to fetch saved responses.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSavedResponses();
//   }, []);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }

//   return (
//     <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//       <Typography variant="h4" gutterBottom>
//         Saved Responses
//       </Typography>
//       {savedResponses.length === 0 ? (
//         <Typography>No saved responses found.</Typography>
//       ) : (
//         savedResponses.map((response) => (
//           <Box
//             key={response.id}
//             sx={{ marginBottom: '20px', padding: '10px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}
//           >
//             <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//               Response {response.id}:
//             </Typography>
//             <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
//               {response.response_text}
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               Date: {new Date(response.timestamp).toLocaleString()} {/* Formatting the date */}
//             </Typography>
//           </Box>
//         ))
//       )}
//     </Box>
//   );
// };

// export default SavedResponses;
