import fetch from 'node-fetch';

const API_KEY = 'AIzaSyDmoRgmtilsd1_D8BVYWtZjuttM6k9Qoco';

(async () => {
    console.log('Listing Models...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            console.log('Available Models:');
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods?.join(', ')})`));
            } else {
                console.log('No models found in response.');
            }
        } else {
            console.log(`❌ ListModels FAILED (${response.status}) - ${data.error?.message}`);
        }
    } catch (error) {
        console.log(`❌ ListModels ERROR - ${error.message}`);
    }
})();
