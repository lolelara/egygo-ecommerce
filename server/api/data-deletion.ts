/**
 * Facebook Data Deletion Callback
 * Handles data deletion requests from Facebook users
 */

import { Request, Response } from 'express';
import { Client, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

interface DataDeletionRequest {
  email: string;
  reason?: string;
  timestamp: string;
  signed_request?: string; // From Facebook
}

/**
 * Handle data deletion request
 */
export async function handleDataDeletion(req: Request, res: Response) {
  try {
    const { email, reason, timestamp, signed_request } = req.body as DataDeletionRequest;

    // Validate request
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        message: 'البريد الإلكتروني مطلوب'
      });
    }

    // Log the deletion request
    console.log('📧 Data deletion request received:', {
      email,
      reason: reason || 'Not provided',
      timestamp,
      hasFacebookSignature: !!signed_request
    });

    // Create deletion request record
    try {
      await databases.createDocument(
        DATABASE_ID,
        'dataDeletionRequests', // You need to create this collection
        'unique()',
        {
          email,
          reason: reason || '',
          requestedAt: timestamp || new Date().toISOString(),
          status: 'pending',
          source: signed_request ? 'facebook' : 'web',
          facebookSignedRequest: signed_request || '',
        }
      );
    } catch (dbError) {
      console.error('Error saving deletion request:', dbError);
      // Continue even if DB save fails
    }

    // Send confirmation email (implement your email service)
    // await sendDeletionConfirmationEmail(email);

    // Return success response
    // For Facebook callback, return specific format
    if (signed_request) {
      return res.json({
        url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/#/data-deletion-status`,
        confirmation_code: generateConfirmationCode(email)
      });
    }

    // For web form submission
    return res.json({
      success: true,
      message: 'تم استلام طلب حذف البيانات بنجاح',
      confirmationCode: generateConfirmationCode(email),
      estimatedDeletionDate: getEstimatedDeletionDate()
    });

  } catch (error: any) {
    console.error('Error handling data deletion:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'حدث خطأ في معالجة الطلب'
    });
  }
}

/**
 * Generate confirmation code
 */
function generateConfirmationCode(email: string): string {
  const timestamp = Date.now();
  const hash = Buffer.from(`${email}-${timestamp}`).toString('base64');
  return hash.substring(0, 12).toUpperCase();
}

/**
 * Get estimated deletion date (30 days from now)
 */
function getEstimatedDeletionDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

/**
 * Handle GET request - Show deletion instructions
 */
export function showDeletionInstructions(req: Request, res: Response) {
  res.json({
    title: 'EgyGo - Data Deletion Instructions',
    instructions: [
      {
        step: 1,
        ar: 'اذهب إلى صفحة حذف البيانات',
        en: 'Go to the data deletion page',
        url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/#/data-deletion`
      },
      {
        step: 2,
        ar: 'أدخل بريدك الإلكتروني المرتبط بحسابك',
        en: 'Enter your email address associated with your account'
      },
      {
        step: 3,
        ar: 'اضغط على "إرسال طلب الحذف"',
        en: 'Click "Submit Deletion Request"'
      },
      {
        step: 4,
        ar: 'ستتلقى رسالة تأكيد على بريدك الإلكتروني',
        en: 'You will receive a confirmation email'
      },
      {
        step: 5,
        ar: 'سيتم حذف بياناتك خلال 30 يوماً',
        en: 'Your data will be deleted within 30 days'
      }
    ],
    contact: {
      email: 'privacy@egygo.com',
      whatsapp: '+201234567890'
    },
    deletionUrl: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/#/data-deletion`
  });
}
