import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [context, setContext] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("screenshots", files[i]);
    }
    formData.append("context", context);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setInstructions(response.data.instructions);
    } catch (error) {
      console.error("Error generating instructions:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Context (optional)"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={context}
        onChange={(e) => setContext(e.target.value)}
        sx={{ mb: 2 }}
      />

      <input
        accept="image/*"
        id="upload-files"
        multiple
        type="file"
        onChange={handleFileChange}
      />

      <Button
        variant="contained"
        component="span"
        sx={{ mt: 2, display: 'block' }}
        onClick={handleSubmit}
      >
        Generate Instructions
      </Button>

      {instructions && (
        <Box mt={4} p={2} bgcolor="lightgray">
          <h3>Generated Instructions:</h3>
          <p>{instructions}</p>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
