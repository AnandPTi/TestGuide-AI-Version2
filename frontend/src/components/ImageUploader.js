import React from 'react';
import { Button, TextField, Grid, Card, CardMedia, CircularProgress, Typography } from '@mui/material';

const ImageUploader = ({ images, context, handleImageUpload, setContext, handleSubmit, loading, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '30px', backgroundColor: '#fff', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px', maxWidth: '500px' }}>
    <input
      accept="image/*"
      type="file"
      multiple
      onChange={handleImageUpload}
      style={{ marginBottom: '20px' }}
    />

    <TextField
      label="Optional Context"
      variant="outlined"
      multiline
      rows={4}
      fullWidth
      value={context}
      onChange={(e) => setContext(e.target.value)}
      style={{ marginBottom: '20px' }}
    />

    <Grid container spacing={2}>
      {Array.from(images).map((image, index) => (
        <Grid item key={index}>
          <Card>
            <CardMedia
              component="img"
              height="100"
              image={URL.createObjectURL(image)}
              alt={`Image ${index + 1}`}
            />
          </Card>
        </Grid>
      ))}
    </Grid>

    <Button
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={loading || images.length === 0}
      style={{ marginTop: '20px' }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : 'Describe Testing Instructions'}
    </Button>

    {error && <Typography color="error">{error}</Typography>}
  </div>
);

export default ImageUploader;

























































































