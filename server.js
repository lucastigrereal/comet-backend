require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const COMET_SECRET_KEY = process.env.COMET_SECRET_KEY || 'default-secret-key';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Comet Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Main webhook endpoint from Make.com
app.post('/api/webhook/notion', async (req, res) => {
  try {
    console.log('[WEBHOOK] Received from Make.com:', req.body);
    
    const { secret_key, notion_command_id, comando, fase, entrada, saida_esperada, validacao } = req.body;
    
    // Validate secret key
    if (secret_key !== COMET_SECRET_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Invalid secret key'
      });
    }
    
    // Process command
    const result = {
      success: true,
      message: `Command ${comando} received and processed`,
      notion_command_id: notion_command_id,
      fase: fase,
      comando: comando,
      entrada: entrada,
      saida_esperada: saida_esperada,
      validacao: validacao,
      processed_at: new Date().toISOString(),
      processed_by: 'Comet Backend v1.0',
      status: 'completed'
    };
    
    console.log('[SUCCESS] Command processed:', result);
    res.json(result);
    
  } catch (error) {
    console.error('[ERROR]', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║  🌟 COMET BACKEND v1.0                                 ║`);
  console.log(`║  🚀 Server running on port ${PORT}                                 ║`);
  console.log(`║  📍 Health check: http://localhost:${PORT}/api/health      ║`);
  console.log(`║  🔗 Webhook: http://localhost:${PORT}/api/webhook/notion    ║`);
  console.log(`╚════════════════════════════════════════════════════════╝\n`);
});

module.exports = app;
