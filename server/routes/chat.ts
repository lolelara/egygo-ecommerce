import { RequestHandler } from "express";
import { withOpenAIClient } from "../lib/openai-key-manager";
import { logAIUsage } from "../lib/ai-usage";

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

    // Call OpenAI API via key manager (Appwrite collection + env fallback)
    const completion = await withOpenAIClient((client) => client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    }));

    const response = {
      message: completion.choices[0]?.message?.content || 'عذراً، ما قدرتش أفهم. جرب تاني 🙏',
      usage: completion.usage,
    };

    // Log AI usage (best-effort)
    try {
      const usage = completion.usage as any;
      await logAIUsage({
        feature: 'chat',
        route: '/api/chat',
        model: (completion as any).model || 'gpt-4o-mini',
        tokensPrompt: usage?.prompt_tokens,
        tokensCompletion: usage?.completion_tokens,
        tokensTotal: usage?.total_tokens,
        userId: null,
        metadata: null,
      });
    } catch (e) {
      // لا نمنع الرد على المستخدم بسبب خطأ في تسجيل الاستخدام
      console.error('Failed to log AI usage for /api/chat:', e);
    }

    res.json(response);
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    res.status(500).json({
      error: 'حصل خطأ في الاتصال بالخدمة. جرب تاني بعد شوية 🙏',
      details: error.message
    });
  }
};
