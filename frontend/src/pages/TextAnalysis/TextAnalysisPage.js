import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  TextField, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Chip,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { ArrowBack, Send, Language } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TextAnalysisPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('english');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Separate conversation states for each language
  const [englishConversation, setEnglishConversation] = useState([]);
  const [tamilConversation, setTamilConversation] = useState([]);

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  const emotionColors = {
    // English emotions
    'neutral': 'default',
    'joy': 'success',
    'sadness': 'info',
    'fear': 'warning',
    'surprise': 'secondary',
    'anger': 'error',
    'disgust': 'error',
    
    // Tamil emotions
    'அருவருப்பு': 'error',
    'ஆச்சரியம்': 'secondary',
    'கோபம்': 'error',
    'சோகம்': 'info',
    'நடுநிலை': 'default',
    'பயம்': 'warning',
    'மகிழ்ச்சி': 'success'
  };

  const getCurrentConversation = () => {
    return language === 'english' ? englishConversation : tamilConversation;
  };

  const updateConversation = (newMessage) => {
    if (language === 'english') {
      setEnglishConversation(prev => [...prev, newMessage]);
    } else {
      setTamilConversation(prev => [...prev, newMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
  
    // Add user message to conversation
    const userMessage = {
      text: inputText,
      sender: 'user',
      language,
      timestamp: new Date().toLocaleTimeString()
    };
  
    updateConversation(userMessage);
    setInputText('');
    setIsProcessing(true);
  
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          language: language
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      
      const botMessage = {
        text: language === 'english' 
          ? `Detected Emotion: ${data.emotion}` 
          : `கண்டறியப்பட்ட உணர்ச்சி: ${data.emotion}`,
        sender: 'bot',
        language,
        timestamp: new Date().toLocaleTimeString(),
        emotion: data.emotion
      };
  
      updateConversation(botMessage);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: language === 'english' 
          ? 'Error analyzing emotion' 
          : 'உணர்ச்சியை பகுப்பாய்வு செய்ய பிழை',
        sender: 'bot',
        language,
        timestamp: new Date().toLocaleTimeString()
      };
      updateConversation(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentConversation = getCurrentConversation();

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start',
        height: 'calc(100vh - 200px)', // Adjusted height
        mt: 6 // Added margin to account for the back button
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}>
          Text Emotion Analysis
        </Typography>

        {/* Language Selection */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleLanguageChange}
            aria-label="language selection"
          >
            <ToggleButton 
              value="english" 
              aria-label="english"
              sx={{ width: 120, position: 'relative' }}
            >
              English
              {language === 'english' && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main'
                  }}
                />
              )}
            </ToggleButton>
            <ToggleButton 
              value="tamil" 
              aria-label="tamil"
              sx={{ width: 120, position: 'relative' }}
            >
              Tamil
              {language === 'tamil' && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main'
                  }}
                />
              )}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Chat Container - Modified for proper scrolling */}
        <Paper elevation={3} sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          height: '100%' // Ensure it takes available space
        }}>
          {/* Chat Messages - Now properly scrollable */}
          <Box sx={{ 
            flex: 1,
            p: 2, 
            overflowY: 'auto',
            bgcolor: 'background.default',
            maxHeight: 'calc(100% - 72px)' // Leaves space for input area
          }}>
            <List>
              {currentConversation.map((msg, index) => (
                <ListItem key={index} sx={{
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {msg.sender === 'bot' && (
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Language />
                      </Avatar>
                    </ListItemAvatar>
                  )}
                  <Paper elevation={1} sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0'
                  }}>
                    <ListItemText 
                      primary={msg.text} 
                      secondary={msg.timestamp}
                      secondaryTypographyProps={{
                        color: msg.sender === 'user' ? 'primary.contrastText' : 'text.secondary'
                      }}
                    />
                    {msg.emotion && (
                      <Chip
                        label={msg.emotion}
                        color={emotionColors[msg.emotion]}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Paper>
                  {msg.sender === 'user' && (
                    <ListItemAvatar sx={{ ml: 1 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>U</Avatar>
                    </ListItemAvatar>
                  )}
                </ListItem>
              ))}
              {isProcessing && (
                <ListItem sx={{ justifyContent: 'flex-start' }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Language />
                    </Avatar>
                  </ListItemAvatar>
                  <Paper elevation={1} sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: 'background.paper',
                    borderRadius: '18px 18px 18px 0'
                  }}>
                    <Typography fontStyle="italic">
                      {language === 'english' ? 'Analyzing emotion...' : 'உணர்ச்சியை பகுப்பாய்வு செய்கிறது...'}
                    </Typography>
                  </Paper>
                </ListItem>
              )}
            </List>
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={language === 'english' ? 'Type your message...' : 'உங்கள் செய்தியை தட்டச்சு செய்க...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isProcessing}
                sx={{ minWidth: 'auto', width: 120 }}
              >
                <Send />
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TextAnalysisPage;