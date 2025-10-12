import { Client, Databases, ID, Query } from 'node-appwrite';

/**
 * Appwrite Function: Referral Handler
 * Handles referral creation, tracking, and rewards
 */

// Referral configuration
const REFERRAL_CONFIG = {
  levels: [
    { level: 1, signupReward: 50, firstPurchaseReward: 100, commissionRate: 5.0 },
    { level: 2, signupReward: 25, firstPurchaseReward: 50, commissionRate: 2.5 },
    { level: 3, signupReward: 10, firstPurchaseReward: 25, commissionRate: 1.0 },
    { level: 4, signupReward: 5, firstPurchaseReward: 10, commissionRate: 0.5 },
  ],
  maxLevels: 4,
};

/**
 * Initialize Appwrite client
 */
function initClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  
  return new Databases(client);
}

/**
 * Generate unique affiliate code
 */
function generateAffiliateCode() {
  const prefix = 'REF';
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}${random}`;
}

/**
 * Handle new user registration with referral code
 */
async function handleUserRegistration(databases, databaseId, userId, userName, userEmail, referralCode) {
  try {
    console.log(`Processing registration for user: ${userId}`);
    
    // Generate affiliate code for new user
    const newAffiliateCode = generateAffiliateCode();
    
    let referrerId = null;
    
    // If referral code provided, find referrer
    if (referralCode) {
      console.log(`Looking up referral code: ${referralCode}`);
      
      const referrerPrefs = await databases.listDocuments(
        databaseId,
        'user_preferences',
        [Query.equal('affiliateCode', referralCode), Query.limit(1)]
      );
      
      if (referrerPrefs.documents.length > 0) {
        referrerId = referrerPrefs.documents[0].userId;
        console.log(`Found referrer: ${referrerId}`);
        
        // Create referral record
        await createReferralChain(databases, databaseId, referrerId, userId, userName, userEmail);
      } else {
        console.log(`Referral code not found: ${referralCode}`);
      }
    }
    
    // Create user preferences
    await databases.createDocument(
      databaseId,
      'user_preferences',
      ID.unique(),
      {
        userId,
        affiliateCode: newAffiliateCode,
        referredBy: referrerId,
        role: 'customer',
        theme: 'light',
        language: 'ar',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
      }
    );
    
    console.log(`User preferences created with affiliate code: ${newAffiliateCode}`);
    
    return {
      success: true,
      affiliateCode: newAffiliateCode,
      referrerId,
    };
  } catch (error) {
    console.error('Error handling user registration:', error);
    throw error;
  }
}

/**
 * Create referral chain (multi-level)
 */
async function createReferralChain(databases, databaseId, referrerId, newUserId, userName, userEmail) {
  try {
    const chain = [];
    let currentReferrerId = referrerId;
    let level = 1;
    
    // Build referral chain up to max levels
    while (currentReferrerId && level <= REFERRAL_CONFIG.maxLevels) {
      const config = REFERRAL_CONFIG.levels[level - 1];
      
      // Create referral record
      const referral = await databases.createDocument(
        databaseId,
        'referrals',
        ID.unique(),
        {
          referrerId: currentReferrerId,
          referredUserId: newUserId,
          referredUserName: userName,
          referredUserEmail: userEmail,
          status: 'active',
          reward: config.signupReward,
          level,
        }
      );
      
      // Create signup earning
      await databases.createDocument(
        databaseId,
        'referral_earnings',
        ID.unique(),
        {
          referrerId: currentReferrerId,
          referredUserId: newUserId,
          amount: config.signupReward,
          percentage: 0,
          level,
          type: 'signup',
          status: 'completed',
        }
      );
      
      console.log(`Created level ${level} referral: ${currentReferrerId} -> ${newUserId} (${config.signupReward} EGP)`);
      
      chain.push({
        level,
        referrerId: currentReferrerId,
        reward: config.signupReward,
      });
      
      // Get next level referrer
      const referrerPrefs = await databases.listDocuments(
        databaseId,
        'user_preferences',
        [Query.equal('userId', currentReferrerId), Query.limit(1)]
      );
      
      if (referrerPrefs.documents.length > 0 && referrerPrefs.documents[0].referredBy) {
        currentReferrerId = referrerPrefs.documents[0].referredBy;
        level++;
      } else {
        break;
      }
    }
    
    console.log(`Referral chain created: ${chain.length} levels`);
    return chain;
  } catch (error) {
    console.error('Error creating referral chain:', error);
    throw error;
  }
}

/**
 * Handle first purchase reward
 */
async function handleFirstPurchase(databases, databaseId, userId, orderId, orderAmount) {
  try {
    console.log(`Processing first purchase for user: ${userId}`);
    
    // Get user's referrals
    const referrals = await databases.listDocuments(
      databaseId,
      'referrals',
      [Query.equal('referredUserId', userId)]
    );
    
    if (referrals.documents.length === 0) {
      console.log('No referrals found for this user');
      return { success: true, rewards: [] };
    }
    
    const rewards = [];
    
    // Process each level
    for (const referral of referrals.documents) {
      const config = REFERRAL_CONFIG.levels[referral.level - 1];
      
      // Create first purchase earning
      await databases.createDocument(
        databaseId,
        'referral_earnings',
        ID.unique(),
        {
          referrerId: referral.referrerId,
          referredUserId: userId,
          orderId,
          amount: config.firstPurchaseReward,
          percentage: 0,
          level: referral.level,
          type: 'first_purchase',
          status: 'completed',
        }
      );
      
      // Update referral reward
      await databases.updateDocument(
        databaseId,
        'referrals',
        referral.$id,
        {
          reward: referral.reward + config.firstPurchaseReward,
        }
      );
      
      console.log(`First purchase reward: Level ${referral.level} - ${config.firstPurchaseReward} EGP`);
      
      rewards.push({
        level: referral.level,
        referrerId: referral.referrerId,
        reward: config.firstPurchaseReward,
      });
    }
    
    return { success: true, rewards };
  } catch (error) {
    console.error('Error handling first purchase:', error);
    throw error;
  }
}

/**
 * Handle commission on purchase
 */
async function handlePurchaseCommission(databases, databaseId, userId, orderId, orderAmount) {
  try {
    console.log(`Processing commission for order: ${orderId} (${orderAmount} EGP)`);
    
    // Get user's referrals
    const referrals = await databases.listDocuments(
      databaseId,
      'referrals',
      [Query.equal('referredUserId', userId), Query.equal('status', 'active')]
    );
    
    if (referrals.documents.length === 0) {
      console.log('No active referrals found');
      return { success: true, commissions: [] };
    }
    
    const commissions = [];
    
    // Calculate commission for each level
    for (const referral of referrals.documents) {
      const config = REFERRAL_CONFIG.levels[referral.level - 1];
      const commission = (orderAmount * config.commissionRate) / 100;
      
      // Create commission earning
      await databases.createDocument(
        databaseId,
        'referral_earnings',
        ID.unique(),
        {
          referrerId: referral.referrerId,
          referredUserId: userId,
          orderId,
          amount: commission,
          percentage: config.commissionRate,
          level: referral.level,
          type: 'commission',
          status: 'completed',
        }
      );
      
      // Update referral total reward
      await databases.updateDocument(
        databaseId,
        'referrals',
        referral.$id,
        {
          reward: referral.reward + commission,
        }
      );
      
      console.log(`Commission: Level ${referral.level} - ${commission.toFixed(2)} EGP (${config.commissionRate}%)`);
      
      commissions.push({
        level: referral.level,
        referrerId: referral.referrerId,
        commission,
        rate: config.commissionRate,
      });
    }
    
    return { success: true, commissions };
  } catch (error) {
    console.error('Error handling commission:', error);
    throw error;
  }
}

/**
 * Main function handler
 */
export default async ({ req, res, log, error }) => {
  try {
    log('Referral Handler Function started');
    
    const databases = initClient();
    const databaseId = process.env.APPWRITE_DATABASE_ID;
    
    // Parse request
    const payload = JSON.parse(req.body || '{}');
    const { action, ...data } = payload;
    
    log(`Action: ${action}`);
    
    let result;
    
    switch (action) {
      case 'register':
        // Handle new user registration
        result = await handleUserRegistration(
          databases,
          databaseId,
          data.userId,
          data.userName,
          data.userEmail,
          data.referralCode
        );
        break;
      
      case 'first_purchase':
        // Handle first purchase reward
        result = await handleFirstPurchase(
          databases,
          databaseId,
          data.userId,
          data.orderId,
          data.orderAmount
        );
        break;
      
      case 'purchase':
        // Handle purchase commission
        result = await handlePurchaseCommission(
          databases,
          databaseId,
          data.userId,
          data.orderId,
          data.orderAmount
        );
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    log('Function completed successfully');
    
    return res.json({
      success: true,
      action,
      result,
    });
  } catch (err) {
    error(`Function error: ${err.message}`);
    
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500
    );
  }
};
