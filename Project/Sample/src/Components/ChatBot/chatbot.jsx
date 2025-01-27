import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  CircularProgress,
  Fade,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './chatBot.css';
import axios from 'axios';
//import { chatWithBot, getChatHistory } from '../../services/chatServices';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching chat history...');
      const response = await axios.post(
        'http://localhost:8080/chatBot/userId',
        {},
        axiosConfig
      );
      console.log('History response:', response.data);
      
      if (response.data.success) {
        setMessages(response.data.history.reverse());
      } else {
        setError('Failed to load chat history: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error.response || error);
      setError(error.response?.data?.message || 'Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || isRateLimited) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/gemini/chat', {
        message: inputMessage
      });

      const botMessage = {
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: error.response?.data?.error || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(error.response?.data?.error || 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <Container maxWidth="lg" className="page-container">
      <Paper elevation={3} className="chatbot-container">
        <Box className="chatbot-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#4f46e5' }}>
              <SmartToyIcon />
            </Avatar>
            <Typography variant="h5" component="h1">
              AI Assistant
            </Typography>
          </Box>
          <Tooltip title="Clear Chat">
            <IconButton 
              onClick={clearChat} 
              color="inherit" 
              disabled={messages.length === 0}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className="messages-container">
          {messages.length === 0 ? (
            <Box className="emptyState">
              <SmartToyIcon sx={{ fontSize: 48, color: '#6366f1', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Welcome to AI Assistant!
              </Typography>
              <Typography color="textSecondary">
                Start a conversation by typing a message below.
              </Typography>
            </Box>
          ) : (
            messages.map((message, index) => (
              <Fade in={true} key={index}>
                <Box
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: message.sender === 'user' ? '#4f46e5' : '#6366f1',
                        width: 32,
                        height: 32
                      }}
                    >
                      {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <div className="message-content">
                        {message.text}
                      </div>
                      <div className="timestamp">
                        <AccessTimeIcon sx={{ fontSize: 12 }} />
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            ))
          )}
          {isLoading && (
            <Box className="message bot-message">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#6366f1',
                    width: 32,
                    height: 32
                  }}
                >
                  <SmartToyIcon />
                </Avatar>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <form onSubmit={handleSendMessage} className="input-container">
          <TextField
            fullWidth
            variant="outlined"
            placeholder={isRateLimited ? "Please wait..." : "Type your message..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading || isRateLimited}
            inputRef={inputRef}
            InputProps={{
              sx: {
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
                '&:focus-within': {
                  backgroundColor: '#ffffff'
                }
              }
            }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || isRateLimited || !inputMessage.trim()}
            sx={{
              bgcolor: '#4f46e5',
              color: 'white',
              '&:hover': {
                bgcolor: '#4338ca'
              },
              '&:disabled': {
                bgcolor: '#e5e7eb',
                color: '#9ca3af'
              },
              width: '50px',
              height: '50px'
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </form>
      </Paper>
    </Container>
  );
};

export default ChatBot;