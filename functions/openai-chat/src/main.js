import { Client } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Initialize Appwrite client (for future DB operations if needed)
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.json(
        { error: 'Method not allowed' },
        405
      );
    }

    // Parse request body
    const body = JSON.parse(req.bodyText || '{}');
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return res.json(
        { error: 'Messages array is required' },
        400
      );
    }

    log('Calling OpenAI API with messages:', messages.length);

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      error('OpenAI API Error:', errorData);
      return res.json(
        { error: 'Failed to get response from OpenAI', details: errorData },
        openaiResponse.status
      );
    }

    const completion = await openaiResponse.json();
    const message = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    log('OpenAI response received successfully');

    return res.json({
      message,
      usage,
    });

  } catch (err) {
    error('Function error:', err.message);
    return res.json(
      { error: 'Internal server error', details: err.message },
      500
    );
  }
};
