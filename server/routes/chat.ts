import { RequestHandler } from "express";
import OpenAI from "openai";

// Initialize OpenAI with server-side key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
});

interface ChatRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export const handleChatCompletion: RequestHandler = async (req, res) => {
  try {
    const { messages } = req.body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    // Call OpenAI API server-side (secure)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = {
      message: completion.choices[0]?.message?.content || 'عذراً، ما قدرتش أفهم. جرب تاني 🙏',
      usage: completion.usage,
    };

    res.json(response);
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    res.status(500).json({
      error: 'حصل خطأ في الاتصال بالخدمة. جرب تاني بعد شوية 🙏',
      details: error.message
    });
  }
};
