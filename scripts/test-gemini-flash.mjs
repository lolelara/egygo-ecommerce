import fetch from 'node-fetch';

const API_KEY = 'AIzaSyDmoRgmtilsd1_D8BVYWtZjuttM6k9Qoco';
const MODEL = 'gemini-flash-latest';

(async () => {
    console.log(`Testing ${MODEL}...`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Hello' }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${MODEL}: SUCCESS`);
            console.log('Response:', data.candidates?.[0]?.content?.parts?.[0]?.text);
        } else {
            const data = await response.json();
            console.log(`❌ ${MODEL}: FAILED (${response.status}) - ${data.error?.message}`);
        }
    } catch (error) {
        console.log(`❌ ${MODEL}: ERROR - ${error.message}`);
    }
})();
