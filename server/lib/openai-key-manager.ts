import OpenAI from 'openai';
import {
  DATABASE_ID,
  COLLECTIONS,
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  Query,
} from './appwrite';

export type OpenAIKeyAdminView = {
  id: string;
  label: string;
  maskedKey: string;
  status: 'active' | 'inactive' | 'error';
  priority: number;
  isDefault: boolean;
  lastTestedAt?: string;
  lastError?: string;
};

type OpenAIKeyDocument = {
  $id: string;
  label?: string;
  apiKey: string;
  status?: string;
  priority?: number;
  isDefault?: boolean;
  lastTestedAt?: string;
  lastError?: string;
  [key: string]: any;
};

function maskKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '*'.repeat(key.length);
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function toAdminView(doc: OpenAIKeyDocument): OpenAIKeyAdminView {
  return {
    id: doc.$id,
    label: doc.label || 'Unnamed key',
    maskedKey: maskKey(doc.apiKey),
    status: (doc.status as any) || 'inactive',
    priority: typeof doc.priority === 'number' ? doc.priority : 100,
    isDefault: !!doc.isDefault,
    lastTestedAt: doc.lastTestedAt,
    lastError: doc.lastError,
  };
}

async function getAllKeyDocuments(): Promise<OpenAIKeyDocument[]> {
  try {
    const result = await listDocuments(COLLECTIONS.OPENAI_KEYS, [Query.limit(100)]);
    return (result.documents as any[]) as OpenAIKeyDocument[];
  } catch (error) {
    console.error('Error loading OpenAI keys from Appwrite:', error);
    return [];
  }
}

function sortKeys(keys: OpenAIKeyDocument[]): OpenAIKeyDocument[] {
  return keys
    .slice()
    .sort((a, b) => {
      const defA = a.isDefault ? 1 : 0;
      const defB = b.isDefault ? 1 : 0;
      if (defA !== defB) return defB - defA;
      const priA = typeof a.priority === 'number' ? a.priority : 9999;
      const priB = typeof b.priority === 'number' ? b.priority : 9999;
      return priA - priB;
    });
}

function isAuthError(error: any): boolean {
  const status = error?.status || error?.response?.status;
  if (status === 401 || status === 403 || status === 429) return true;
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('invalid api key')) return true;
  if (message.includes('incorrect api key')) return true;
  if (message.includes('rate limit')) return true;
  if (message.includes('quota')) return true;
  return false;
}

async function updateKeyStatus(id: string, status: 'active' | 'inactive' | 'error', lastError?: string) {
  const data: any = {
    status,
    lastTestedAt: new Date().toISOString(),
  };
  if (lastError) {
    data.lastError = lastError.slice(0, 1000);
  } else {
    data.lastError = '';
  }
  try {
    await updateDocument(COLLECTIONS.OPENAI_KEYS, id, data);
  } catch (error) {
    console.error('Failed to update OpenAI key status:', error);
  }
}

export async function getAdminKeys(): Promise<OpenAIKeyAdminView[]> {
  const docs = await getAllKeyDocuments();
  const sorted = sortKeys(docs);
  return sorted.map(toAdminView);
}

export async function createAdminKey(input: {
  label: string;
  apiKey: string;
  priority?: number;
  isDefault?: boolean;
}): Promise<OpenAIKeyAdminView> {
  const priority = typeof input.priority === 'number' ? input.priority : 100;

  if (input.isDefault) {
    const existing = await getAllKeyDocuments();
    const updates = existing
      .filter((doc) => doc.isDefault)
      .map((doc) => updateDocument(COLLECTIONS.OPENAI_KEYS, doc.$id, { isDefault: false }));
    if (updates.length) {
      await Promise.all(updates);
    }
  }

  const doc = await createDocument(COLLECTIONS.OPENAI_KEYS, {
    label: input.label,
    apiKey: input.apiKey,
    status: 'inactive',
    priority,
    isDefault: !!input.isDefault,
    lastTestedAt: null,
    lastError: '',
  });

  return toAdminView(doc as any);
}

export async function updateAdminKey(
  id: string,
  data: Partial<{ label: string; priority: number; status: 'active' | 'inactive' | 'error'; isDefault: boolean }>,
): Promise<OpenAIKeyAdminView> {
  const updateData: any = {};
  if (typeof data.label === 'string') updateData.label = data.label;
  if (typeof data.priority === 'number') updateData.priority = data.priority;
  if (typeof data.status === 'string') updateData.status = data.status;

  if (typeof data.isDefault === 'boolean') {
    if (data.isDefault) {
      const existing = await getAllKeyDocuments();
      const updates = existing
        .filter((doc) => doc.isDefault && doc.$id !== id)
        .map((doc) => updateDocument(COLLECTIONS.OPENAI_KEYS, doc.$id, { isDefault: false }));
      if (updates.length) {
        await Promise.all(updates);
      }
    }
    updateData.isDefault = data.isDefault;
  }

  const doc = await updateDocument(COLLECTIONS.OPENAI_KEYS, id, updateData);
  return toAdminView(doc as any);
}

export async function deleteAdminKey(id: string): Promise<void> {
  await deleteDocument(COLLECTIONS.OPENAI_KEYS, id);
}

export async function testAdminKey(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const doc = (await getDocument(COLLECTIONS.OPENAI_KEYS, id)) as any as OpenAIKeyDocument;
    if (!doc || !doc.apiKey) {
      throw new Error('API key not found');
    }

    const client = new OpenAI({ apiKey: doc.apiKey });
    await client.models.list();

    await updateKeyStatus(id, 'active');
    return { ok: true };
  } catch (error: any) {
    console.error('Error testing OpenAI key:', error);
    const message = error?.message || 'Unknown error';
    await updateKeyStatus(id, 'error', message);
    return { ok: false, error: message };
  }
}

export async function activateAdminKey(id: string): Promise<OpenAIKeyAdminView> {
  const existing = await getAllKeyDocuments();
  const updates = existing
    .filter((doc) => doc.isDefault && doc.$id !== id)
    .map((doc) => updateDocument(COLLECTIONS.OPENAI_KEYS, doc.$id, { isDefault: false }));

  if (updates.length) {
    await Promise.all(updates);
  }

  const doc = await updateDocument(COLLECTIONS.OPENAI_KEYS, id, { isDefault: true, status: 'active' });
  return toAdminView(doc as any);
}

export async function withOpenAIClient<T>(
  handler: (client: OpenAI) => Promise<T>,
): Promise<T> {
  const docs = sortKeys(await getAllKeyDocuments());
  const errors: any[] = [];

  for (const doc of docs) {
    if (!doc.apiKey) continue;
    const client = new OpenAI({ apiKey: doc.apiKey });

    try {
      const result = await handler(client);
      await updateKeyStatus(doc.$id, 'active');
      return result;
    } catch (error: any) {
      console.error('OpenAI key error:', error);
      if (isAuthError(error)) {
        await updateKeyStatus(doc.$id, 'error', error?.message);
        errors.push(error);
        continue;
      }
      throw error;
    }
  }

  const envKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (envKey) {
    const client = new OpenAI({ apiKey: envKey });
    return handler(client);
  }

  const aggregateError = new Error('لا يوجد أي مفتاح OpenAI صالح متاح');
  (aggregateError as any).details = errors.map((e: any) => e?.message).filter(Boolean);
  throw aggregateError;
}
