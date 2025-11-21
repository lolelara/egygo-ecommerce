import { toast } from "@/hooks/use-toast";

export type AIProvider = 'openai' | 'gemini';

interface GenerateContentOptions {
    provider?: AIProvider;
    apiKey: string;
    systemPrompt?: string;
    userPrompt: string;
    temperature?: number;
}

export async function generateAIContent({
    provider = 'gemini',
    apiKey,
    systemPrompt,
    userPrompt,
    temperature = 0.7
}: GenerateContentOptions): Promise<string> {

    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    try {
        if (provider === 'gemini') {
            // Use the fixed model name
            const model = 'gemini-flash-latest';
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const prompt = systemPrompt ? `${systemPrompt}\n\nUser: ${userPrompt}` : userPrompt;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: temperature,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("No content generated from Gemini");
            }

            return text;
        }

        // Fallback or other providers can be added here (e.g. OpenAI)
        throw new Error("Unsupported provider");

    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
