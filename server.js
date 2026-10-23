require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateLessonPlan } = require('./utils/aiGenerator');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store (for demo / free tier). Later replace with database.
const history = [];

// ========== ROUTES ==========

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mispah Lesplan Generator is running' });
});

// Generate lesson plan + test
app.post('/api/generate', async (req, res) => {
  try {
    const {
      vak,
      graad,
      kwartaal,
      week,
      datum,
      tema,
      doelstellings,
      includeTest = true,
      language = 'af'
    } = req.body;

    if (!tema || !doelstellings) {
      return res.status(400).json({ error: 'Tema en Doelstellings is verpligtend.' });
    }

    console.log(`Generating plan for: ${vak} - ${tema}`);

    const result = await generateLessonPlan({
      vak,
      graad,
      kwartaal,
      week,
      datum,
      tema,
      doelstellings,
      includeTest
    });

    // Save to history
    const entry = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      vak,
      tema,
      graad,
      week,
      result
    };
    history.unshift(entry);
    if (history.length > 50) history.pop(); // Keep last 50

    res.json({
      success: true,
      data: result,
      id: entry.id
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      error: 'Kon nie die lesplan genereer nie. Kontroleer jou API-sleutel of probeer weer.',
      details: error.message
    });
  }
});

// Get history
app.get('/api/history', (req, res) => {
  res.json({ history: history.slice(0, 20) });
});

// Get single history item
app.get('/api/history/:id', (req, res) => {
  const item = history.find(h => h.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Nie gevind nie' });
  res.json(item);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mispah Lesplan Generator running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}`);
});
