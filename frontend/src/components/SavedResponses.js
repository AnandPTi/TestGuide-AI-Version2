import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const SavedResponses = () => {
  const [savedResponses, setSavedResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedResponse, setExpandedResponse] = useState({});

  useEffect(() => {
    const fetchSavedResponses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/saved-responses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const sortedResponses = res.data.saved_responses.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setSavedResponses(sortedResponses);
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

  const toggleExpandResponse = (id) => {
    setExpandedResponse((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
        savedResponses.map((response) => {
          const isExpanded = expandedResponse[response.id];
          const textPreview = response.response_text.slice(0, 200); // Preview of first 200 characters

          const formattedDate = new Date(response.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Asia/Kolkata',
            });
          return (
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

              {/* Delete Button with styling and hover */}
              <Button
                onClick={() => handleDelete(response.id)}
                sx={{
                  backgroundColor: '#3f51b5',
                  color: 'white',
                  marginTop: '10px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'red',
                  },
                  transition: 'background-color 0.3s ease',
                }}
              >
                Delete
              </Button>

              {/* Render the response text with "Read More" */}
              <ReactMarkdown>
                {isExpanded ? response.response_text : textPreview}
              </ReactMarkdown>

                {/* ISO Date Format */}
              <Typography variant="caption" color="textSecondary">
                Date: {formattedDate}
              </Typography>
              {/* Read More / Read Less Toggle */}
              {response.response_text.length > 200 && (
                <Button
                  onClick={() => toggleExpandResponse(response.id)}
                  sx={{
                    marginTop: '10px',
                    color: '#3f51b5',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </Button>
              )}

              
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default SavedResponses;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Box, Typography, CircularProgress, Button } from '@mui/material';
// import ReactMarkdown from 'react-markdown';

// const SavedResponses = () => {
//   const [savedResponses, setSavedResponses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSavedResponses = async () => {
//       try {
//         const res = await axios.get('http://127.0.0.1:8000/saved-responses/', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setSavedResponses(res.data.saved_responses);
//       } catch (err) {
//         setError('Failed to fetch saved responses.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSavedResponses();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/saved-responses/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       // After deletion, remove the response from the state
//       setSavedResponses((prev) => prev.filter((response) => response.id !== id));
//     } catch (err) {
//       setError('Failed to delete the response.');
//     }
//   };

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
//             sx={{
//               marginBottom: '20px',
//               padding: '10px',
//               backgroundColor: '#1e1e1e',
//               borderRadius: '8px',
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               {response.heading}
//             </Typography>
//             <Button
//               variant="outlined"
//               color="error"
//               onClick={() => handleDelete(response.id)}
//               sx={{ marginTop: '10px' }}
//             >
//               Delete
//             </Button>
//             <ReactMarkdown>{response.response_text}</ReactMarkdown>
//             <Typography variant="caption" color="textSecondary">
//               Date: {new Date(response.timestamp).toLocaleString()}
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
