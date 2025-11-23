import fetch from 'node-fetch';

const API_KEY = '9857d976-13a6-4074-884c-353100615598'; // Using the key from previous context if available, or I'll ask user to provide it. 
// Wait, I don't have the key in plain text in the file I read (it was masked or variable).
// I will use a placeholder and ask the user to run it with their key if needed, OR I can try to read it from the database if I had access, but I don't want to complicate it.
// Actually, the user's error log didn't show the key.
// I'll assume the key is correct in the app and just test the payload structure with a dummy key to see if I get 401 (Unauthorized) instead of 400 (Bad Request). 
// If I get 401, it means the payload is valid but key is wrong (which is fine for this test).
// If I get 400, the payload is still wrong.

async function testSambaNova() {
    const systemPrompt = `You are a helpful assistant. Return JSON.`;
    const userPrompt = `Hello`;

    try {
        const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer TEST_KEY`
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.3-70B-Instruct",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
                temperature: 0.7
                // response_format removed
            })
        });

        console.log(`Status: ${response.status}`);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

testSambaNova();
