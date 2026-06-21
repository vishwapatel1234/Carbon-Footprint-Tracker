import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Helmet for basic secure headers
app.use(helmet());

// Security: CORS configured to allow all origins for easy hackathon integration
app.use(cors());

// Security: Limit JSON payload size to prevent DOS (10kb max)
app.use(express.json({ limit: '10kb' }));

// Security: Content-Type checks to reject non-JSON payloads
app.use((req, res, next) => {
  if (req.method === 'POST' && (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json'))) {
    return res.status(415).json({ error: 'Unsupported Media Type. Body must be application/json' });
  }
  next();
});

// Security: Rate limiting (10 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again after 15 minutes.' }
});

// Helper function to strip HTML tags
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

// Heuristic backup insight generator to ensure the app never crashes if the API is offline/unavailable
const generateMockInsight = (category, breakdown, profile) => {
  const defaultInsights = {
    transport: {
      recommendation: `Based on your logs, transport is your largest emission source. Commuting with ${profile.commuteMode || 'a vehicle'} contributes highly to your profile.`,
      action: "Swap 2 private car trips this week for public transit, cycling, or walking.",
      estimatedSavingKg: 8.5,
      savingExplanation: "Saves around 8.5 kg CO₂ by avoiding fuel combustion on short commuter routes.",
      difficulty: "easy",
      timeToImpact: "this week"
    },
    diet: {
      recommendation: "Your food selections show significant diet-related emissions. Shifting meals away from high-carbon proteins can instantly lower this.",
      action: "Substitute beef or lamb in 2 meals this week with lentils, chickpeas, or paneer.",
      estimatedSavingKg: 6.6,
      savingExplanation: "Reduces methane emissions and heavy land-use impacts associated with red meat production.",
      difficulty: "easy",
      timeToImpact: "this week"
    },
    energy: {
      recommendation: "Home electricity usage makes up a core portion of your weekly impact. Simple vampire power reduction can yield quick gains.",
      action: "Unplug idle appliances (TV, chargers, microwave) at night to eliminate standby draw.",
      estimatedSavingKg: 3.2,
      savingExplanation: "Saves grid electricity (India grid runs ~0.82 kg CO₂/kWh) from vampire loads.",
      difficulty: "easy",
      timeToImpact: "this week"
    },
    shopping: {
      recommendation: "Frequent online deliveries accumulate substantial footprint overhead due to individual package courier shipments.",
      action: "Combine all online orders into a single delivery day instead of multiple individual orders.",
      estimatedSavingKg: 4.5,
      savingExplanation: "Prevents duplicate packaging waste and courier van transit emissions.",
      difficulty: "easy",
      timeToImpact: "this week"
    }
  };

  const selected = defaultInsights[category] || defaultInsights.transport;
  return {
    ...selected,
    category,
    reasoning: `Mock recommendation triggered because no Gemini API key is configured or the service is offline.`
  };
};

// POST /api/insight
app.post('/api/insight', apiLimiter, async (req, res) => {
  try {
    const { profile, currentEntry, history, breakdown, highestImpactCategory } = req.body;

    // Validation
    if (!profile || !currentEntry || !breakdown || !highestImpactCategory) {
      return res.status(400).json({ error: 'Missing required request parameters.' });
    }

    const sanitizedCategory = sanitizeString(highestImpactCategory).toLowerCase();
    const validCategories = ['transport', 'diet', 'energy', 'shopping'];
    const activeCategory = validCategories.includes(sanitizedCategory) ? sanitizedCategory : 'transport';

    const apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

    // If API key is not present, fall back to mock calculations gracefully
    if (!apiKey) {
      const mockResult = generateMockInsight(activeCategory, breakdown, profile);
      return res.json(mockResult);
    }

    // Call Google Generative AI (Gemini) API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We enforce structured JSON format directly in Gemini settings
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            recommendation: { type: 'STRING', description: '2-3 sentences. Address their specific numbers, acknowledge what they do well before suggesting.' },
            action: { type: 'STRING', description: 'One specific, practical action. e.g., Replace 2 of your 5 weekly beef meals with lentils' },
            estimatedSavingKg: { type: 'NUMBER', description: 'Numerical estimate of weekly CO2 savings in kg.' },
            savingExplanation: { type: 'STRING', description: '1 sentence explaining how this savings calculation is achieved.' },
            category: { type: 'STRING', enum: ['diet', 'transport', 'energy', 'shopping'] },
            difficulty: { type: 'STRING', enum: ['easy', 'medium', 'hard'] },
            timeToImpact: { type: 'STRING', enum: ['this week', 'this month', 'long-term'] }
          },
          required: ['recommendation', 'action', 'estimatedSavingKg', 'savingExplanation', 'category', 'difficulty', 'timeToImpact']
        }
      }
    });

    const systemPrompt = `You are a carbon footprint reduction coach with deep knowledge of climate science and behavioral psychology.
You receive a user's actual footprint data broken down by category.
Your job is NOT to give generic climate advice.
Your job is to find the SINGLE highest-leverage action for THIS specific person based on their actual numbers, and explain exactly how much CO2 they would save.
Be specific. Be honest. Be actionable. Not preachy.
Rules:
- Never say "Great job!" or use hollow encouragement.
- Always reference the user's actual numbers, not averages.
- If they are already low-footprint, acknowledge it and give a maintenance tip.
- Difficulty: easy = 0 lifestyle change, medium = small habit, hard = major change.
- estimatedSavingKg must be a realistic number you can back up.`;

    const userMessage = `
User Profile:
- Commute: ${sanitizeString(profile.commuteMode)}
- Country: ${sanitizeString(profile.country)}
- Diet Type: ${sanitizeString(profile.dietType)}
- Housing: ${sanitizeString(profile.homeSize)}

Current Log Entry:
- Transport: ${Number(currentEntry.transportKm || 0)} km
- Meat meals/week: ${Number(currentEntry.meatMeals || 0)}
- Electricity: ${Number(currentEntry.energyKwh || 0)} kWh
- Purchases: ${Number(currentEntry.purchases || 0)} online purchases
- Flights: ${Number(currentEntry.flightHours || 0)} flight hours

Breakdown:
- Transport: ${Number(breakdown.transport || 0)} kg CO₂
- Diet: ${Number(breakdown.diet || 0)} kg CO₂
- Energy: ${Number(breakdown.energy || 0)} kg CO₂
- Shopping: ${Number(breakdown.shopping || 0)} kg CO₂
- Highest Impact Category: ${activeCategory}
`;

    // Enforce a 4-second timeout on Google's API call to prevent Vercel serverless gateway kills
    const apiTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Google Gemini API took too long to respond')), 4000)
    );

    const response = await Promise.race([
      model.generateContent({
        contents: `${systemPrompt}\n\n${userMessage}`
      }),
      apiTimeoutPromise
    ]);

    const replyText = response.response.text().trim();

    try {
      const parsedJSON = JSON.parse(replyText);
      return res.json(parsedJSON);
    } catch (parseError) {
      console.error('Gemini JSON Parse Error:', parseError, 'Raw response:', replyText);
      const mockResult = generateMockInsight(activeCategory, breakdown, profile);
      return res.json(mockResult);
    }

  } catch (error) {
    console.error('Server processing error:', error.message);
    // Hackathon fail-safe: Fall back to local mock insight instead of throwing 500
    const mockResult = generateMockInsight(activeCategory, breakdown, profile);
    return res.json({
      ...mockResult,
      recommendation: `Note: Running in local safe mode (${error.message || 'API key error'}). ${mockResult.recommendation}`
    });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`Backend server successfully listening on port ${PORT}`);
});

export default app;
