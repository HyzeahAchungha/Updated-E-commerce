// Email service using Resend
// NOTE: For security, this should be implemented on a backend server (Node.js/Express)
// This is a frontend example - move to backend for production

const RESEND_API_KEY = 'YOUR_RESEND_API_KEY_HERE'; // TODO: Replace with your Resend API key
const ADMIN_EMAIL = 'admin@achungha.com'; // TODO: Replace with your admin email
const FROM_EMAIL = 'orders@achungha.com'; // TODO: Replace with your verified Resend email

/**
 * Send order confirmation email to customer
 */
export const sendOrderConfirmation = async (orderData) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: orderData.customerEmail,
        subject: `Order Confirmation #${orderData.orderId}`,
        html: generateCustomerEmailHTML(orderData)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send customer email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending customer email:', error);
    throw error;
  }
};

/**
 * Send order notification to admin
 */
export const sendAdminNotification = async (orderData) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Order Received #${orderData.orderId}`,
        html: generateAdminEmailHTML(orderData)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send admin email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending admin email:', error);
    throw error;
  }
};

/**
 * Generate HTML email for customer
 */
const generateCustomerEmailHTML = (orderData) => {
  const itemsHTML = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Open Sans', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <table style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #69ae14; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Achungha</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #222; margin-top: 0;">Thank You for Your Order!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hi ${orderData.customerName},<br><br>
              We've received your order and we're getting it ready. You'll receive a shipping confirmation email as soon as your order ships.
            </p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 30px 0;">
              <h3 style="color: #222; margin-top: 0;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order Number:</strong> #${orderData.orderId}</p>
              <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            </div>

            <table style="width: 100%; margin: 30px 0; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #69ae14;">Product</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #69ae14;">Name</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #69ae14;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #69ae14;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 15px 10px; text-align: right;">$${orderData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold;">Tax:</td>
                  <td style="padding: 15px 10px; text-align: right;">$${orderData.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #69ae14;">Total:</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #69ae14;">$${orderData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
              <h3 style="color: #222; margin-top: 0;">Shipping Address</h3>
              <p style="margin: 5px 0; color: #666;">
                ${orderData.shippingAddress.name}<br>
                ${orderData.shippingAddress.address}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.country}
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px; line-height: 1.6;">
              If you have any questions about your order, please contact us at 
              <a href="mailto:support@achungha.com" style="color: #69ae14;">support@achungha.com</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #222; padding: 20px; text-align: center; color: white; font-size: 14px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Achungha. All rights reserved.</p>
            <p style="margin: 10px 0 0 0;">Room 6 Sparkland building molyko Buea Cameroon</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Generate HTML email for admin
 */
const generateAdminEmailHTML = (orderData) => {
  const itemsHTML = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <table style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden;">
        <tr>
          <td style="background-color: #69ae14; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Order Received</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #222;">Order #${orderData.orderId}</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Customer Information</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.customerName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customerEmail}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customerPhone || 'N/A'}</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Shipping Address</h3>
              <p style="margin: 5px 0;">
                ${orderData.shippingAddress.name}<br>
                ${orderData.shippingAddress.address}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.country}
              </p>
            </div>

            <h3>Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #69ae14;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #69ae14;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #69ae14;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #69ae14;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 10px; text-align: right;">$${orderData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tax:</td>
                  <td style="padding: 10px; text-align: right;">$${orderData.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #69ae14;">$${orderData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
              <p style="margin: 10px 0 0 0;"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleString()}</p>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default {
  sendOrderConfirmation,
  sendAdminNotification
};