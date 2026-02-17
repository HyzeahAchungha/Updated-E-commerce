import axios from 'axios';

// MTN MoMo API Configuration
// TODO: Replace with your MTN MoMo credentials
const MTN_MOMO_CONFIG = {
  // Sandbox or Production URL
  baseURL: 'https://sandbox.momodeveloper.mtn.com', // Change to production URL when ready
  collectionPrimaryKey: 'YOUR_COLLECTION_PRIMARY_KEY_HERE',
  collectionSecondaryKey: 'YOUR_COLLECTION_SECONDARY_KEY_HERE',
  collectionUserId: 'YOUR_USER_ID_HERE',
  collectionApiKey: 'YOUR_API_KEY_HERE',
  callbackUrl: 'https://your-domain.com/api/momo/callback', // TODO: Replace with your callback URL
  currency: 'XAF', // Central African CFA franc (Cameroon)
  environment: 'sandbox' // Change to 'production' when ready
};

/**
 * Generate UUID for MTN MoMo transactions
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get access token from MTN MoMo API
 */
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      `${MTN_MOMO_CONFIG.baseURL}/collection/token/`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.collectionPrimaryKey,
          'Authorization': `Basic ${btoa(`${MTN_MOMO_CONFIG.collectionUserId}:${MTN_MOMO_CONFIG.collectionApiKey}`)}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting MTN MoMo access token:', error);
    throw new Error('Failed to authenticate with MTN MoMo');
  }
};

/**
 * Request payment from customer
 * @param {Object} paymentData - Payment information
 * @param {number} paymentData.amount - Amount to charge
 * @param {string} paymentData.phoneNumber - Customer's phone number (237XXXXXXXXX format)
 * @param {string} paymentData.orderId - Order ID for reference
 * @param {string} paymentData.customerName - Customer name
 * @returns {Promise<Object>} Payment response
 */
export const requestPayment = async (paymentData) => {
  try {
    const { amount, phoneNumber, orderId, customerName } = paymentData;

    // Validate phone number format (Cameroon: 237XXXXXXXXX)
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!cleanPhone.match(/^237\d{9}$/)) {
      throw new Error('Invalid phone number format. Use format: 237XXXXXXXXX');
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Generate reference ID for this transaction
    const referenceId = generateUUID();

    // Request payment
    const response = await axios.post(
      `${MTN_MOMO_CONFIG.baseURL}/collection/v1_0/requesttopay`,
      {
        amount: amount.toString(),
        currency: MTN_MOMO_CONFIG.currency,
        externalId: orderId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: cleanPhone
        },
        payerMessage: `Payment for Achungha Order #${orderId}`,
        payeeNote: `Order #${orderId} - ${customerName}`
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': MTN_MOMO_CONFIG.environment,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.collectionPrimaryKey,
          'Content-Type': 'application/json'
        }
      }
    );

    // Return reference ID to check payment status later
    return {
      success: true,
      referenceId: referenceId,
      message: 'Payment request sent. Customer will receive a prompt on their phone.'
    };

  } catch (error) {
    console.error('MTN MoMo payment error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Payment request failed'
    };
  }
};

/**
 * Check payment status
 * @param {string} referenceId - Transaction reference ID
 * @returns {Promise<Object>} Payment status
 */
export const checkPaymentStatus = async (referenceId) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${MTN_MOMO_CONFIG.baseURL}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': MTN_MOMO_CONFIG.environment,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.collectionPrimaryKey
        }
      }
    );

    const status = response.data.status;

    return {
      status: status,
      successful: status === 'SUCCESSFUL',
      pending: status === 'PENDING',
      failed: status === 'FAILED',
      data: response.data
    };

  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      status: 'UNKNOWN',
      successful: false,
      pending: false,
      failed: true,
      error: error.message
    };
  }
};

/**
 * Poll payment status until completion
 * @param {string} referenceId - Transaction reference ID
 * @param {number} maxAttempts - Maximum polling attempts (default: 20)
 * @param {number} intervalMs - Polling interval in milliseconds (default: 3000)
 * @returns {Promise<Object>} Final payment status
 */
export const pollPaymentStatus = async (referenceId, maxAttempts = 20, intervalMs = 3000) => {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++;

      try {
        const status = await checkPaymentStatus(referenceId);

        // Payment successful
        if (status.successful) {
          clearInterval(interval);
          resolve({
            success: true,
            status: 'SUCCESSFUL',
            message: 'Payment completed successfully',
            data: status.data
          });
        }
        
        // Payment failed
        else if (status.failed) {
          clearInterval(interval);
          resolve({
            success: false,
            status: 'FAILED',
            message: 'Payment failed or was cancelled',
            data: status.data
          });
        }
        
        // Max attempts reached
        else if (attempts >= maxAttempts) {
          clearInterval(interval);
          resolve({
            success: false,
            status: 'TIMEOUT',
            message: 'Payment verification timeout. Please check your transaction status.',
            data: status.data
          });
        }
        
        // Still pending, continue polling
        
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, intervalMs);
  });
};

/**
 * Get account balance (for admin use)
 */
export const getAccountBalance = async () => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${MTN_MOMO_CONFIG.baseURL}/collection/v1_0/account/balance`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': MTN_MOMO_CONFIG.environment,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.collectionPrimaryKey
        }
      }
    );

    return {
      success: true,
      balance: response.data.availableBalance,
      currency: response.data.currency
    };

  } catch (error) {
    console.error('Error getting account balance:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Validate account holder (optional - check if phone number is valid)
 */
export const validateAccountHolder = async (phoneNumber, accountHolderIdType = 'MSISDN') => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${MTN_MOMO_CONFIG.baseURL}/collection/v1_0/accountholder/${accountHolderIdType}/${phoneNumber}/active`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': MTN_MOMO_CONFIG.environment,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.collectionPrimaryKey
        }
      }
    );

    return {
      valid: response.data.result === true,
      message: response.data.result ? 'Account is active' : 'Account not found'
    };

  } catch (error) {
    return {
      valid: false,
      message: 'Unable to validate account'
    };
  }
};

export default {
  requestPayment,
  checkPaymentStatus,
  pollPaymentStatus,
  getAccountBalance,
  validateAccountHolder
};