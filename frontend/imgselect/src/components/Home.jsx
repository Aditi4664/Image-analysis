import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Container } from '@mui/material';
import ImageSplitter from './ImageSplitter'; // Adjust the path if needed

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #a18cd1, #fbc2eb)', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', color: 'white', mb: 6 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Image Split & Analysis
          </Typography>
          <Typography variant="h6">
            Upload an image, select two points, and let AI analyze the relationship between the parts
          </Typography>
        </Box>

        {/* Instructions Card */}
        <Paper elevation={4} sx={{ p: 3, mb: 4, border: '2px solid #4caf50' }}>
          <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
            How to use:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Upload an image using the area below" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Click two points on the image to define the split line" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Enter your question about the relationship between the parts" />
            </ListItem>
            <ListItem>
              <ListItemText primary='4. Click "Analyze" to get AI insights' />
            </ListItem>
          </List>
        </Paper>

        {/* Image Splitter Section */}
        <Box
          sx={{
            border: '2px dashed #90caf9',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: 'white',
          }}
        >
          <ImageSplitter />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
