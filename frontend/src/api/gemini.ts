const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

async function trackUsage(operation: string, durationMs: number, status: 'success' | 'error', estimatedTokens = 0) {
  try {
    await fetch(`${BACKEND_URL}/api/gemini/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, durationMs, status, estimatedTokens }),
    });
  } catch {
    // non-critical — don't let tracking failures affect the user
  }
}

async function ask(prompt: string, operation = 'unknown'): Promise<string> {
  const start = Date.now();
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Gemini API error:', res.status, err);
      trackUsage(operation, Date.now() - start, 'error');
      throw new Error(`Gemini error ${res.status}: ${err?.error?.message ?? res.statusText}`);
    }

    const data = await res.json();

    // Gemini 2.5 may return multiple parts — find the text part (not thought)
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const textPart = parts.find((p: any) => p.text && !p.thought);
    const text = textPart?.text ?? parts[parts.length - 1]?.text ?? '';

    const estimatedTokens = Math.ceil(prompt.length / 4) + Math.ceil(text.length / 4);
    trackUsage(operation, Date.now() - start, 'success', estimatedTokens);

    console.log('Gemini response preview:', text.slice(0, 150));
    return text;
  } catch (err) {
    if (!(err instanceof Error && err.message.startsWith('Gemini error'))) {
      trackUsage(operation, Date.now() - start, 'error');
    }
    throw err;
  }
}

function extractJson(text: string, type: 'array' | 'object'): string {
  // Remove markdown fences
  const clean = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const pattern = type === 'array' ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const match = clean.match(pattern);
  if (!match) {
    console.error('Raw Gemini text (no JSON found):', clean);
    throw new Error('No JSON in response');
  }
  return match[0];
}

export interface ActivitySuggestion {
  name: string;
  category: string;
  description: string;
  rating: number;
  image: string;
}

export interface DestinationInsights {
  estimatedBudget: string;
  weather: string;
  bestSeason: string;
  tips: string[];
  currency: string;
  language: string;
}

const categoryImages: Record<string, string> = {
  Adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
  Nature: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  Culture: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80',
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
  Beach: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
  History: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=80',
  Shopping: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  Nightlife: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
  Wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  Sightseeing: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
  Entertainment: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=400&q=80',
};

// Pick image by fuzzy matching category
function getImage(category: string): string {
  const exact = categoryImages[category];
  if (exact) return exact;
  const key = Object.keys(categoryImages).find(
    (k) => k.toLowerCase() === category.toLowerCase()
  );
  return key ? categoryImages[key] : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80';
}

export interface StopSuggestion {
  city: string;
  country: string;
  description: string;
  recommendedDays: number;
  highlights: string[];
}

export const geminiApi = {
  getSuggestions: async (destination: string): Promise<ActivitySuggestion[]> => {
    const prompt = `List 6 diverse top activities and places to visit in ${destination}. 
Make sure to include a MIX of different types — not all the same category.
Use ONLY these categories: Adventure, Nature, Culture, Food, Beach, History, Shopping, Nightlife, Wellness, Sports, Sightseeing, Entertainment.
Return a JSON array:
[{"name":"string","category":"one of the above","description":"one sentence max","rating":4.5}]`;

    const text = await ask(prompt, 'getSuggestions');
    const json = extractJson(text, 'array');
    const items = JSON.parse(json) as Omit<ActivitySuggestion, 'image'>[];
    return items.map((item) => ({
      ...item,
      rating: Math.min(5, Math.max(3.5, Number(item.rating) || 4.5)),
      image: getImage(item.category),
    }));
  },

  getInsights: async (destination: string): Promise<DestinationInsights> => {
    const prompt = `Travel insights for ${destination}. Return a JSON object:
{"estimatedBudget":"$X-$Y per person","weather":"brief description","bestSeason":"months","currency":"currency name","language":"main language","tips":["tip1","tip2","tip3"]}`;

    const text = await ask(prompt, 'getInsights');
    const json = extractJson(text, 'object');
    return JSON.parse(json) as DestinationInsights;
  },

  getStopSuggestions: async (destination: string): Promise<StopSuggestion[]> => {
    const prompt = `Suggest 6 must-visit places, landmarks, or attractions in ${destination} that a traveler should add as stops in their itinerary.
These should be specific places within ${destination}, not other cities.
For each place include the name (as city field), a short area/district (as country field), a one-sentence description, recommended number of days or hours to spend (as a number of days, use 1 for half-day visits), and 3 short highlights.
Return a JSON array:
[{"city":"place name","country":"area or district","description":"one sentence","recommendedDays":1,"highlights":["highlight1","highlight2","highlight3"]}]`;

    const text = await ask(prompt, 'getStopSuggestions');
    const json = extractJson(text, 'array');
    return JSON.parse(json) as StopSuggestion[];
  },
};
