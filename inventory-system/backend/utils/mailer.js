const nodemailer = require('nodemailer');

/**
 * Creates a transporter using Gmail (or any SMTP).
 * Set MAIL_USER and MAIL_PASS in your .env file.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS     // Use an App Password, not account password
  }
});

/**
 * Sends a refund request email to the supplier.
 * @param {Object} opts
 * @param {string} opts.supplierEmail   - recipient email
 * @param {string} opts.supplierName    - company name
 * @param {string} opts.contactPerson   - contact person at supplier
 * @param {string} opts.orderId         - original order ID
 * @param {string} opts.spareName       - name of the spare part
 * @param {number} opts.quantityOrdered - qty that was ordered
 * @param {number} opts.amount          - total amount paid (₹)
 * @param {string} opts.razorpayOrderId - Razorpay order ID (proof of payment)
 * @param {string} opts.razorpayPaymentId - Razorpay payment ID
 * @param {string} opts.reason          - reason for refund request
 */
async function sendRefundEmail(opts) {
  const {
    supplierEmail,
    supplierName,
    contactPerson,
    orderId,
    spareName,
    quantityOrdered,
    amount,
    razorpayOrderId,
    razorpayPaymentId,
    reason
  } = opts;

  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; color:#333; }
    .wrapper { max-width:640px; margin:30px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%); padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:700; letter-spacing:-0.5px; }
    .header p { margin:6px 0 0; color:rgba(255,255,255,0.8); font-size:13px; }
    .badge { display:inline-block; background:rgba(255,255,255,0.2); color:#fff; padding:4px 14px; border-radius:100px; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-top:12px; }
    .body { padding:36px 40px; }
    .greeting { font-size:16px; color:#444; margin-bottom:24px; line-height:1.6; }
    .info-box { background:#fff8f8; border:1px solid #fde8e8; border-radius:8px; padding:20px 24px; margin-bottom:24px; }
    .info-box h3 { margin:0 0 14px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#c0392b; }
    .info-row { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px solid #fde8e8; font-size:14px; }
    .info-row:last-child { border-bottom:none; }
    .info-row .label { color:#777; }
    .info-row .value { font-weight:600; color:#222; text-align:right; max-width:60%; }
    .highlight-box { background:#fff3cd; border-left:4px solid #f39c12; border-radius:4px; padding:14px 18px; margin-bottom:24px; font-size:14px; color:#7d5a00; line-height:1.6; }
    .reason-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px 20px; margin-bottom:24px; }
    .reason-box h3 { margin:0 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#555; }
    .reason-box p { margin:0; font-size:14px; color:#333; line-height:1.6; }
    .amount-row { background: linear-gradient(135deg, #c0392b, #e74c3c); border-radius:8px; padding:18px 24px; text-align:center; margin-bottom:24px; }
    .amount-row .label { color:rgba(255,255,255,0.8); font-size:12px; text-transform:uppercase; letter-spacing:1px; }
    .amount-row .value { color:#fff; font-size:28px; font-weight:700; margin-top:4px; }
    .steps { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:18px 24px; margin-bottom:24px; }
    .steps h3 { margin:0 0 12px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#15803d; }
    .steps ol { margin:0; padding-left:20px; font-size:14px; color:#166534; line-height:2; }
    .footer { background:#f8f8f8; padding:24px 40px; text-align:center; border-top:1px solid #eee; }
    .footer p { margin:0; font-size:12px; color:#aaa; line-height:1.8; }
    .footer strong { color:#666; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⚠️ Refund Request Notice</h1>
      <p>SpareCo Inventory Management System</p>
      <span class="badge">URGENT · ACTION REQUIRED</span>
    </div>
    <div class="body">
      <p class="greeting">
        Dear <strong>${contactPerson || supplierName}</strong>,<br><br>
        We are writing to formally request a <strong>refund</strong> for a recent purchase order that has been discarded from our system. Please process this refund at your earliest convenience.
      </p>

      <div class="info-box">
        <h3>📋 Order Details</h3>
        <div class="info-row"><span class="label">Order ID</span><span class="value">${orderId}</span></div>
        <div class="info-row"><span class="label">Spare Part</span><span class="value">${spareName}</span></div>
        <div class="info-row"><span class="label">Quantity Ordered</span><span class="value">${quantityOrdered} Units</span></div>
        <div class="info-row"><span class="label">Supplier Company</span><span class="value">${supplierName}</span></div>
        <div class="info-row"><span class="label">Date of Request</span><span class="value">${date}</span></div>
        ${razorpayOrderId ? `<div class="info-row"><span class="label">Razorpay Order ID</span><span class="value">${razorpayOrderId}</span></div>` : ''}
        ${razorpayPaymentId ? `<div class="info-row"><span class="label">Payment Reference</span><span class="value">${razorpayPaymentId}</span></div>` : ''}
      </div>

      <div class="amount-row">
        <div class="label">Total Amount to be Refunded</div>
        <div class="value">₹${Number(amount).toLocaleString('en-IN')}</div>
      </div>

      <div class="reason-box">
        <h3>📝 Reason for Refund</h3>
        <p>${reason || 'Order discarded — goods not required / order cancelled by management.'}</p>
      </div>

      <div class="highlight-box">
        ⚠️ <strong>Please note:</strong> This order has been officially cancelled in our procurement system. Kindly <strong>do not dispatch</strong> any goods against this order. If goods have already been shipped, please arrange for their return.
      </div>

      <div class="steps">
        <h3>✅ Requested Next Steps</h3>
        <ol>
          <li>Acknowledge receipt of this refund request via email</li>
          <li>Initiate the refund of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> to our account</li>
          <li>Provide a refund acknowledgement/receipt within 3–5 business days</li>
          <li>Contact us immediately if there are any discrepancies</li>
        </ol>
      </div>

      <p style="font-size:14px; color:#555; line-height:1.7;">
        For any queries, please contact our procurement team. We value our business relationship with <strong>${supplierName}</strong> and look forward to your prompt resolution of this matter.
      </p>
    </div>
    <div class="footer">
      <p>
        <strong>SpareCo Procurement Team</strong><br>
        Optimum Inventory Control of Machine Spares &amp; Consumables<br>
        This is an automated email generated by the SpareCo Inventory Management System.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"SpareCo Procurement" <${process.env.MAIL_USER}>`,
    to: supplierEmail,
    subject: `[REFUND REQUEST] Purchase Order #${orderId} – ₹${Number(amount).toLocaleString('en-IN')} | SpareCo`,
    html
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendRefundEmail };
