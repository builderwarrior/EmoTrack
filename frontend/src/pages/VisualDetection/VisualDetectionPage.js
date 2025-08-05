import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const VisualDetectionPage = () => {
  const navigate = useNavigate();

  const startDetection = () => {
    fetch('http://localhost:5000/run_emotion_detection');
  };

  const stopDetection = () => {
    fetch('http://localhost:5000/stop_emotion_detection');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 3 }}>
      {/* Back Button */}
      <Box sx={{ alignSelf: 'flex-start' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          BACK TO HOME
        </Button>
      </Box>

      {/* Centered Buttons */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Emotion Detection Control</Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" color="primary" onClick={startDetection}>
            Start Emotion Detection
          </Button>
          <Button variant="contained" color="secondary" onClick={stopDetection}>
            Stop Emotion Detection
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VisualDetectionPage;
