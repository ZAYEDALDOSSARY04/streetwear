import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function getFrom() {
  return process.env.RESEND_FROM_EMAIL || 'StreetMap <onboarding@resend.dev>'
}

export async function sendOrderConfirmation({ to, orderNumber, items, total, currency, shippingAddress }) {
  const itemsHtml = items.map(i =>
    `<tr><td>${i.product?.name ?? i.name}</td><td>${i.size}</td><td>${i.quantity}</td><td>${currency} ${(i.price * i.quantity).toFixed(0)}</td></tr>`
  ).join('')

  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `Order Confirmed — ${orderNumber} | StreetMap`,
    html: `
      <h2>Your order is confirmed ✓</h2>
      <p>Order: <strong>${orderNumber}</strong></p>
      <table border="1" cellpadding="8">
        <tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr>
        ${itemsHtml}
      </table>
      <p><strong>Total: ${currency} ${total}</strong></p>
      <p>Shipping to: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}</p>
      <p>Thank you for supporting local streetwear. 10% of your purchase goes directly to the shop owner.</p>
      <p>— StreetMap Team</p>
    `,
  })
}

export async function sendShopNewOrder({ to, shopName, orderNumber, item, total, currency }) {
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: `New Order #${orderNumber} | ${shopName} Dashboard`,
    html: `
      <h2>You have a new order! 🎉</h2>
      <p>Order: <strong>${orderNumber}</strong></p>
      <p>Item: ${item}</p>
      <p>Total (your earnings): ${currency} ${(total * 0.9).toFixed(0)}</p>
      <p>Log in to your dashboard to confirm and ship.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard/orders">View Dashboard →</a>
    `,
  })
}

export async function sendVerificationEmail({ to, name, token }) {
  const link = `${process.env.NEXTAUTH_URL}/register/verify-email?token=${token}`
  return getResend().emails.send({
    from: getFrom(),
    to,
    subject: 'Verify your StreetMap account',
    html: `
      <h2>Welcome to StreetMap, ${name}!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${link}" style="background:#E8FF00;color:#0A0A0A;padding:12px 24px;text-decoration:none;font-weight:bold;display:inline-block">Verify Email</a>
      <p>Link expires in 24 hours.</p>
    `,
  })
}
