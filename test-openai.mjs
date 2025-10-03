import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const apiKey = process.env.VITE_OPENAI_API_KEY;

console.log('\n🔍 Testing OpenAI API Connection...\n');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : '❌ MISSING');

if (!apiKey) {
  console.error('❌ VITE_OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

try {
  console.log('\n🔄 Initializing OpenAI client...');
  const client = new OpenAI({ apiKey });
  
  console.log('✅ Client initialized');
  console.log('\n📤 Sending test message...');
  
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'أنت مساعد ذكي باللهجة المصرية'
      },
      {
        role: 'user',
        content: 'ازيك؟'
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  console.log('\n✅ Response received!');
  console.log('\n📨 AI Response:');
  console.log('═══════════════════════════════════════');
  console.log(completion.choices[0].message.content);
  console.log('═══════════════════════════════════════\n');
  
  console.log('✅ OpenAI API is working correctly!\n');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
  process.exit(1);
}
