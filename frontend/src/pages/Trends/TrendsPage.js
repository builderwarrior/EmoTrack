import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, IconButton } from '@mui/material';
import { ArrowBack, ArrowLeft, ArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, addDays, parseISO } from 'date-fns';

// Emotion labels
const Emotions = {
  'neutral': 'Neutral/நடுநிலை',
  'joy': 'Happy/மகிழ்ச்சி',
  'sadness': 'Sad/வருத்தம்',
  'fear': 'Fear/அச்சம்',
  'surprise': 'Surprise/அதிர்ச்சி',
  'anger': 'Anger/கோபம்',
  'disgust': 'Disgust/வெறுப்பு'
};

const emotionColors = {
  'neutral': '#8884d8',
  'joy': '#82ca9d',
  'sadness': '#ffc658',
  'fear': '#ff8042',
  'surprise': '#00bcd4',
  'anger': '#ff0000',
  'disgust': '#8a2be2'
};

const TrendsPage = () => {
  const navigate = useNavigate();
  const [emotionData, setEmotionData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmotionData(currentDate);
  }, [currentDate]);

  const fetchEmotionData = async (date) => {
    try {
      setLoading(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      console.log('Requesting data for:', dateStr);
      const response = await fetch(`http://localhost:5000/get_emotion_data?date=${dateStr}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setEmotionData(data.data);
      }
    } catch (error) {
      console.error('Error fetching emotion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const previousDay = subDays(currentDate, 1);
    setCurrentDate(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    // Don't allow future dates
    if (nextDay <= new Date()) {
      setCurrentDate(nextDay);
    }
  };

  // Format data for stacked bar chart
  const formatChartData = () => {
    return emotionData.map(hourData => ({
      hour: `${hourData.hour}:00`,
      ...hourData
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>
      
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
        Emotion Trends
      </Typography>
      
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        {format(currentDate, 'MMMM d, yyyy')}
      </Typography>
      
      <Box sx={{ 
        height: '500px', 
        bgcolor: 'background.paper', 
        borderRadius: 2,
        boxShadow: 1,
        p: 4,
        textAlign: 'center'
      }}>
        {loading ? (
          <Typography>Loading data...</Typography>
        ) : emotionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, Emotions[name]]}
                labelFormatter={(label) => `Hour: ${label}`}
              />
              <Legend 
                formatter={(value) => Emotions[value]}
                wrapperStyle={{ paddingTop: '20px' }}
              />
              {Object.keys(Emotions).map(emotion => (
                <Bar 
                  key={emotion}
                  dataKey={emotion}
                  stackId="a"
                  name={emotion}
                  fill={emotionColors[emotion]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No data available for this date</Typography>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<ArrowLeft />}
          onClick={handlePreviousDay}
          disabled={loading}
        >
          Previous Day
        </Button>
        <Button 
          variant="contained" 
          endIcon={<ArrowRight />}
          onClick={handleNextDay}
          disabled={loading || format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
        >
          Next Day
        </Button>
      </Box>
    </Container>
  );
};

export default TrendsPage;