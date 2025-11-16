import { Router } from 'express';
import {
  getAdminKeys,
  createAdminKey,
  updateAdminKey,
  deleteAdminKey,
  testAdminKey,
  activateAdminKey,
} from '../lib/openai-key-manager';

const router = Router();

// GET /api/ai/status - public AI keys health summary
router.get('/ai/status', async (_req, res) => {
  try {
    const keys = await getAdminKeys();
    const totalKeys = keys.length;
    const activeKeys = keys.filter((k) => k.status === 'active').length;
    const errorKeys = keys.filter((k) => k.status === 'error').length;
    const inactiveKeys = keys.filter((k) => k.status === 'inactive').length;
    const hasEnvFallback = !!(process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY);

    const status: 'ok' | 'warning' | 'error' =
      activeKeys > 0 || hasEnvFallback
        ? errorKeys > 0
          ? 'warning'
          : 'ok'
        : 'error';

    res.json({
      status,
      totalKeys,
      activeKeys,
      errorKeys,
      inactiveKeys,
      hasEnvFallback,
    });
  } catch (error) {
    console.error('Error getting AI status:', error);
    res.status(500).json({ error: 'فشل في جلب حالة مفاتيح OpenAI' });
  }
});

// GET /api/admin/openai-keys - list all keys
router.get('/admin/openai-keys', async (_req, res) => {
  try {
    const keys = await getAdminKeys();
    res.json(keys);
  } catch (error) {
    console.error('Error fetching OpenAI keys:', error);
    res.status(500).json({ error: 'فشل في تحميل مفاتيح OpenAI' });
  }
});

// POST /api/admin/openai-keys - create new key
router.post('/admin/openai-keys', async (req, res) => {
  try {
    const { label, apiKey, priority, isDefault } = req.body || {};

    if (!label || !apiKey) {
      return res.status(400).json({ error: 'الاسم ومفتاح API مطلوبان' });
    }

    const key = await createAdminKey({
      label,
      apiKey,
      priority: typeof priority === 'number' ? priority : undefined,
      isDefault: typeof isDefault === 'boolean' ? isDefault : undefined,
    });

    res.status(201).json(key);
  } catch (error) {
    console.error('Error creating OpenAI key:', error);
    res.status(500).json({ error: 'فشل في إنشاء مفتاح OpenAI جديد' });
  }
});

// PUT /api/admin/openai-keys/:id - update key
router.put('/admin/openai-keys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, priority, status, isDefault } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'معرف المفتاح مطلوب' });
    }

    const key = await updateAdminKey(id, {
      label,
      priority,
      status,
      isDefault,
    });

    res.json(key);
  } catch (error) {
    console.error('Error updating OpenAI key:', error);
    res.status(500).json({ error: 'فشل في تحديث مفتاح OpenAI' });
  }
});

// DELETE /api/admin/openai-keys/:id - delete key
router.delete('/admin/openai-keys/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'معرف المفتاح مطلوب' });
    }

    await deleteAdminKey(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting OpenAI key:', error);
    res.status(500).json({ error: 'فشل في حذف مفتاح OpenAI' });
  }
});

// POST /api/admin/openai-keys/:id/test - test key
router.post('/admin/openai-keys/:id/test', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'معرف المفتاح مطلوب' });
    }

    const result = await testAdminKey(id);
    res.json(result);
  } catch (error) {
    console.error('Error testing OpenAI key:', error);
    res.status(500).json({ error: 'فشل في اختبار مفتاح OpenAI' });
  }
});

// POST /api/admin/openai-keys/:id/activate - set default/active key
router.post('/admin/openai-keys/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'معرف المفتاح مطلوب' });
    }

    const key = await activateAdminKey(id);
    res.json(key);
  } catch (error) {
    console.error('Error activating OpenAI key:', error);
    res.status(500).json({ error: 'فشل في تفعيل مفتاح OpenAI' });
  }
});

export default router;
