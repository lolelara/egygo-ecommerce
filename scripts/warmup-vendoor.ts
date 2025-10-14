/**
 * Vendoor Function Warmup Script
 * يحافظ على Function نشط عبر استدعاءات دورية
 * 
 * تشغيل: tsx scripts/warmup-vendoor.ts
 */

const VENDOOR_FUNCTION_URL = process.env.VITE_VENDOOR_FUNCTION_URL || 'https://68e1f6240030405882c5.fra.appwrite.run';
const WARMUP_INTERVAL = 5 * 60 * 1000; // 5 دقائق

async function warmup() {
  try {
    console.log(`🔥 [${new Date().toLocaleTimeString('ar-EG')}] Warming up Vendoor Function...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/warmup`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Function is warm:`, data);
    } else {
      console.log(`⚠️  Function responded with status: ${response.status}`);
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('⏱️  Timeout - Function is cold, will retry...');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

async function startWarmupLoop() {
  console.log('🚀 Starting Vendoor Function Warmup Service');
  console.log(`🔗 Target: ${VENDOOR_FUNCTION_URL}`);
  console.log(`⏰ Interval: ${WARMUP_INTERVAL / 1000 / 60} minutes`);
  console.log('='.repeat(60) + '\n');
  
  // First warmup immediately
  await warmup();
  
  // Then repeat every interval
  setInterval(async () => {
    await warmup();
  }, WARMUP_INTERVAL);
  
  console.log('\n💡 Warmup service is running. Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping warmup service...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Stopping warmup service...');
  process.exit(0);
});

// Start the service
startWarmupLoop();
