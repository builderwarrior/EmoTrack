import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button, useTheme } from '@mui/material';
import { Face, TextFields, Timeline, Translate } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      title: 'Facial Emotion AI',
      description: 'Real-time emotion recognition using advanced computer vision',
      icon: <Face sx={{ fontSize: 60 }} />,
      path: '/visual-detection',
      color: theme.palette.primary.main,
    },
    {
      title: 'Multilingual Analysis',
      description: 'Sentiment detection in English and Tamil with NLP',
      icon: <TextFields sx={{ fontSize: 60 }} />,
      secondaryIcon: <Translate sx={{ fontSize: 24, position: 'absolute', bottom: 8, right: 8 }} />,
      path: '/text-analysis',
      color: theme.palette.secondary.main,
    },
    {
      title: 'Emotional Insights',
      description: 'Interactive dashboards showing emotional trends',
      icon: <Timeline sx={{ fontSize: 60 }} />,
      path: '/trends',
      color: theme.palette.success.main,
    },
  ];

  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', duration: 0.8 }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Box textAlign="center" mb={10}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Emotion Intelligence Platform
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Advanced emotion detection through facial expressions and textual analysis
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  borderLeft: `4px solid ${feature.color}`,
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: `${feature.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    mx: 'auto',
                    position: 'relative'
                  }}>
                    {feature.icon}
                    {feature.secondaryIcon}
                  </Box>
                  
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    {feature.description}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(feature.path)}
                    sx={{
                      mt: 'auto',
                      borderColor: feature.color,
                      color: feature.color,
                      '&:hover': {
                        backgroundColor: `${feature.color}08`,
                        borderColor: feature.color
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;