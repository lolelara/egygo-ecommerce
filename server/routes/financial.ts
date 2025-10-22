/**
 * Financial Routes - Server API
 * معالجة المعاملات المالية
 */

import { Router, Request, Response } from 'express';
import { Client, Databases, Storage, Query, ID } from 'node-appwrite';

const router = Router();

// Initialize Appwrite
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

/**
 * GET /api/financial/stats
 * Get financial statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { userType, userId } = req.query;

    // Platform-wide stats (Admin only)
    if (!userId) {
      const [
        pendingWithdrawals,
        completedWithdrawals,
        pendingMerchantPayments,
        verifiedMerchantPayments
      ] = await Promise.all([
        databases.listDocuments(DATABASE_ID, 'withdrawalRequests', [
          Query.equal('status', 'pending'),
        ]),
        databases.listDocuments(DATABASE_ID, 'withdrawalRequests', [
          Query.equal('status', 'completed'),
        ]),
        databases.listDocuments(DATABASE_ID, 'merchantPayments', [
          Query.equal('status', 'pending'),
        ]),
        databases.listDocuments(DATABASE_ID, 'merchantPayments', [
          Query.equal('status', 'verified'),
        ])
      ]);

      const totalPendingWithdrawals = pendingWithdrawals.documents.reduce(
        (sum: number, doc: any) => sum + (doc.amount || 0), 0
      );

      const totalCompletedWithdrawals = completedWithdrawals.documents.reduce(
        (sum: number, doc: any) => sum + (doc.amount || 0), 0
      );

      const totalPendingMerchantPayments = pendingMerchantPayments.documents.reduce(
        (sum: number, doc: any) => sum + (doc.platformFee || 0), 0
      );

      const totalPlatformRevenue = verifiedMerchantPayments.documents.reduce(
        (sum: number, doc: any) => sum + (doc.platformFee || 0), 0
      );

      return res.json({
        platformStats: {
          pendingWithdrawals: {
            count: pendingWithdrawals.total,
            amount: totalPendingWithdrawals
          },
          completedWithdrawals: {
            count: completedWithdrawals.total,
            amount: totalCompletedWithdrawals
          },
          pendingMerchantPayments: {
            count: pendingMerchantPayments.total,
            amount: totalPendingMerchantPayments
          },
          platformRevenue: totalPlatformRevenue
        }
      });
    }

    // User-specific stats
    if (userType === 'merchant') {
      const payments = await databases.listDocuments(DATABASE_ID, 'merchantPayments', [
        Query.equal('merchantId', userId as string),
      ]);

      const totalAmount = payments.documents.reduce(
        (sum: number, doc: any) => sum + (doc.totalAmount || 0), 0
      );
      const totalFees = payments.documents.reduce(
        (sum: number, doc: any) => sum + (doc.platformFee || 0), 0
      );

      return res.json({
        merchantStats: {
          totalPayments: payments.total,
          totalAmount,
          totalFees,
          pending: payments.documents.filter((d: any) => d.status === 'pending').length,
          verified: payments.documents.filter((d: any) => d.status === 'verified').length,
        }
      });
    }

    if (userType === 'affiliate') {
      const withdrawals = await databases.listDocuments(DATABASE_ID, 'withdrawalRequests', [
        Query.equal('userId', userId as string),
        Query.equal('userType', 'affiliate'),
      ]);

      const totalRequested = withdrawals.documents.reduce(
        (sum: number, doc: any) => sum + (doc.amount || 0), 0
      );
      const totalCompleted = withdrawals.documents
        .filter((d: any) => d.status === 'completed')
        .reduce((sum: number, doc: any) => sum + (doc.amount || 0), 0);

      return res.json({
        affiliateStats: {
          totalWithdrawals: withdrawals.total,
          totalRequested,
          totalCompleted,
          pending: withdrawals.documents.filter((d: any) => d.status === 'pending').length,
        }
      });
    }

    res.status(400).json({ error: 'Invalid request parameters' });
  } catch (error: any) {
    console.error('Error getting financial stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/financial/transactions
 * Get financial transactions
 */
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const { type, userId, status, limit = 50, offset = 0 } = req.query;

    const queries = [];
    if (userId) {
      queries.push(Query.equal(type === 'merchant' ? 'merchantId' : 'userId', userId as string));
    }
    if (status) {
      queries.push(Query.equal('status', status as string));
    }
    queries.push(Query.limit(Number(limit)));
    queries.push(Query.offset(Number(offset)));
    queries.push(Query.orderDesc('$createdAt'));

    const collection = type === 'merchant' ? 'merchantPayments' : 'withdrawalRequests';
    const transactions = await databases.listDocuments(DATABASE_ID, collection, queries);

    res.json({
      transactions: transactions.documents,
      total: transactions.total
    });
  } catch (error: any) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/financial/merchant-payment/submit
 * Submit merchant payment with proof
 */
router.post('/merchant-payment/submit', async (req: Request, res: Response) => {
  try {
    const {
      merchantId,
      merchantName,
      orderId,
      totalAmount,
      commissionAmount,
      platformFee,
      transferProof,
      paymentMethod,
      accountDetails,
      notes
    } = req.body;

    // Validate required fields
    if (!merchantId || !orderId || !totalAmount || !platformFee) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payment = await databases.createDocument(
      DATABASE_ID,
      'merchantPayments',
      ID.unique(),
      {
        merchantId,
        merchantName,
        orderId,
        totalAmount,
        commissionAmount: commissionAmount || 0,
        platformFee,
        transferProof: transferProof || '',
        paymentMethod: paymentMethod || '',
        accountDetails: accountDetails || '',
        notes: notes || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );

    // Create notification for admin
    try {
      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId: 'admin',
          title: '💰 دفعة تاجر جديدة',
          message: `${merchantName} قام برفع إثبات دفع بمبلغ ${totalAmount} ج.م`,
          type: 'info',
          read: false,
          relatedId: payment.$id,
          metadata: JSON.stringify({
            type: 'merchant_payment',
            paymentId: payment.$id,
            merchantId,
            amount: totalAmount
          })
        }
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      payment
    });
  } catch (error: any) {
    console.error('Error submitting merchant payment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/financial/merchant-payment/verify
 * Verify merchant payment (Admin only)
 */
router.post('/merchant-payment/verify', async (req: Request, res: Response) => {
  try {
    const { paymentId, status, verifiedBy, notes } = req.body;

    if (!paymentId || !status || !verifiedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payment = await databases.updateDocument(
      DATABASE_ID,
      'merchantPayments',
      paymentId,
      {
        status,
        verifiedAt: new Date().toISOString(),
        verifiedBy,
        notes: notes || ''
      }
    );

    // Get payment details for notification
    const paymentDoc = payment as any;

    // Notify merchant
    try {
      const message = status === 'verified'
        ? `تم التحقق من دفعتك بمبلغ ${paymentDoc.totalAmount} ج.م`
        : `تم رفض دفعتك. السبب: ${notes || 'غير محدد'}`;

      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId: paymentDoc.merchantId,
          title: status === 'verified' ? '✅ تم التحقق من الدفع' : '❌ تم رفض الدفع',
          message,
          type: status === 'verified' ? 'success' : 'alert',
          read: false,
          relatedId: paymentId,
          metadata: JSON.stringify({
            type: 'payment_verification',
            paymentId,
            status
          })
        }
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      payment
    });
  } catch (error: any) {
    console.error('Error verifying merchant payment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/financial/withdrawal/request
 * Request withdrawal
 */
router.post('/withdrawal/request', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      userName,
      userType,
      amount,
      method,
      accountDetails,
      phoneNumber,
      bankName,
      accountNumber,
      accountHolder
    } = req.body;

    // Validate required fields
    if (!userId || !userName || !userType || !amount || !method || !accountDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check minimum withdrawal amount
    if (amount < 100) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is 100 EGP' });
    }

    // Check user balance (simplified - should be more robust)
    const user = await databases.getDocument(DATABASE_ID, 'users', userId);
    const userBalance = (user as any).totalEarnings || 0;

    if (amount > userBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const withdrawal = await databases.createDocument(
      DATABASE_ID,
      'withdrawalRequests',
      ID.unique(),
      {
        userId,
        userName,
        userType,
        amount,
        method,
        accountDetails,
        phoneNumber: phoneNumber || '',
        bankName: bankName || '',
        accountNumber: accountNumber || '',
        accountHolder: accountHolder || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );

    // Create notification for admin
    try {
      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId: 'admin',
          title: '💸 طلب سحب جديد',
          message: `${userName} طلب سحب ${amount} ج.م عبر ${method}`,
          type: 'info',
          read: false,
          relatedId: withdrawal.$id,
          metadata: JSON.stringify({
            type: 'withdrawal_request',
            withdrawalId: withdrawal.$id,
            userId,
            amount,
            method
          })
        }
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Create notification for user
    try {
      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId,
          title: '✅ تم إرسال طلب السحب',
          message: `طلبك لسحب ${amount} ج.م قيد المراجعة. سيتم المعالجة خلال 7 أيام عمل.`,
          type: 'info',
          read: false,
          relatedId: withdrawal.$id,
          metadata: JSON.stringify({
            type: 'withdrawal_submitted',
            withdrawalId: withdrawal.$id,
            amount
          })
        }
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      withdrawal
    });
  } catch (error: any) {
    console.error('Error requesting withdrawal:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/financial/withdrawal/process
 * Process withdrawal (Admin only)
 */
router.post('/withdrawal/process', async (req: Request, res: Response) => {
  try {
    const { withdrawalId, status, processedBy, paymentProof, transactionId, rejectionReason, notes } = req.body;

    if (!withdrawalId || !status || !processedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const withdrawal = await databases.updateDocument(
      DATABASE_ID,
      'withdrawalRequests',
      withdrawalId,
      {
        status,
        processedAt: new Date().toISOString(),
        processedBy,
        paymentProof: paymentProof || '',
        transactionId: transactionId || '',
        rejectionReason: rejectionReason || '',
        notes: notes || ''
      }
    );

    const withdrawalDoc = withdrawal as any;

    // If completed, deduct from user balance
    if (status === 'completed') {
      try {
        const user = await databases.getDocument(DATABASE_ID, 'users', withdrawalDoc.userId);
        const currentBalance = (user as any).totalEarnings || 0;
        const newBalance = currentBalance - withdrawalDoc.amount;

        await databases.updateDocument(
          DATABASE_ID,
          'users',
          withdrawalDoc.userId,
          {
            totalEarnings: Math.max(0, newBalance)
          }
        );
      } catch (balanceError) {
        console.error('Error updating balance:', balanceError);
      }
    }

    // Notify user
    try {
      let title = '';
      let message = '';
      let type: 'success' | 'alert' | 'info' = 'info';

      if (status === 'completed') {
        title = '🎉 تم تحويل المبلغ';
        message = `تم تحويل ${withdrawalDoc.amount} ج.م إلى حسابك بنجاح. رقم المعاملة: ${transactionId || 'غير متوفر'}`;
        type = 'success';
      } else if (status === 'rejected') {
        title = '❌ تم رفض طلب السحب';
        message = `تم رفض طلب سحب ${withdrawalDoc.amount} ج.م. السبب: ${rejectionReason || 'غير محدد'}`;
        type = 'alert';
      } else if (status === 'processing') {
        title = '⏳ جاري معالجة طلبك';
        message = `طلب سحب ${withdrawalDoc.amount} ج.م قيد المعالجة حالياً`;
        type = 'info';
      }

      await databases.createDocument(
        DATABASE_ID,
        'notifications',
        ID.unique(),
        {
          userId: withdrawalDoc.userId,
          title,
          message,
          type,
          read: false,
          relatedId: withdrawalId,
          metadata: JSON.stringify({
            type: 'withdrawal_processed',
            withdrawalId,
            status,
            amount: withdrawalDoc.amount
          })
        }
      );
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      withdrawal
    });
  } catch (error: any) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/financial/withdrawals
 * Get withdrawal requests
 */
router.get('/withdrawals', async (req: Request, res: Response) => {
  try {
    const { userId, userType, status, limit = 50, offset = 0 } = req.query;

    const queries = [];
    if (userId) {
      queries.push(Query.equal('userId', userId as string));
    }
    if (userType) {
      queries.push(Query.equal('userType', userType as string));
    }
    if (status) {
      queries.push(Query.equal('status', status as string));
    }
    queries.push(Query.limit(Number(limit)));
    queries.push(Query.offset(Number(offset)));
    queries.push(Query.orderDesc('$createdAt'));

    const withdrawals = await databases.listDocuments(DATABASE_ID, 'withdrawalRequests', queries);

    res.json({
      withdrawals: withdrawals.documents,
      total: withdrawals.total
    });
  } catch (error: any) {
    console.error('Error getting withdrawals:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/financial/merchant-payments
 * Get merchant payments
 */
router.get('/merchant-payments', async (req: Request, res: Response) => {
  try {
    const { merchantId, status, limit = 50, offset = 0 } = req.query;

    const queries = [];
    if (merchantId) {
      queries.push(Query.equal('merchantId', merchantId as string));
    }
    if (status) {
      queries.push(Query.equal('status', status as string));
    }
    queries.push(Query.limit(Number(limit)));
    queries.push(Query.offset(Number(offset)));
    queries.push(Query.orderDesc('$createdAt'));

    const payments = await databases.listDocuments(DATABASE_ID, 'merchantPayments', queries);

    res.json({
      payments: payments.documents,
      total: payments.total
    });
  } catch (error: any) {
    console.error('Error getting merchant payments:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
