import React, { useState, useRef, useEffect } from 'react';
    import { Box, Button, TextField, Typography, Paper } from '@mui/material';
    import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

    const Chatbot = () => {
      const [input, setInput] = useState('');
      const [messages, setMessages] = useState([]);
      const [isOpen, setIsOpen] = useState(false);
      const messagesEndRef = useRef(null); // Referencia para el final de los mensajes

      const handleInputChange = (e) => {
        setInput(e.target.value);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{
              role: "user",
              content: input
            }]
          }),
        });

        const data = await response.json();
        const botMessage = { text: data.choices[0].message.content, sender: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
        setInput('');
      };

      // Desplazar el scroll hacia abajo cada vez que se actualizan los mensajes
      useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [messages]);

      return (
        <Paper elevation={3} style={{ position: 'fixed', bottom: 20, right: 20, width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
          <ChatBubbleOutlineIcon />
          {isOpen && (
            <Box mt={2} style={{ width: 300, maxHeight: '70vh', overflowY: 'auto', padding: 10, backgroundColor: '#ffffff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', position: 'absolute', bottom: '70px', right: '0' }}>
              <div style={{ marginBottom: 10 }}>
                {messages.map((msg, index) => (
                  <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                    <Typography variant="body2" style={{ display: 'inline-block', padding: '8px', borderRadius: '10px', backgroundColor: msg.sender === 'user' ? '#e1f5fe' : '#f1f8e9', color: '#333' }}>
                      <strong>{msg.sender === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.text}
                    </Typography>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Referencia para el final de los mensajes */}
              </div>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe tu pregunta..."
                  onClick={(e) => e.stopPropagation()} // Evitar que el clic cierre el chatbot
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>Enviar</Button>
              </form>
            </Box>
          )}
        </Paper>
      );
    };

    export default Chatbot;
