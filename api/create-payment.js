// ─── /api/create-payment.js — Vercel Serverless Function ────────────────────
// Receives cart items + Square card token, validates server-side, charges card.
// NEVER trust amounts from the client — always recalculate here.

const { randomUUID } = require('crypto');

// ⚠️  This MUST match cart.js CATALOGUE prices (in CENTS)
const PRICES = {
  'brownie-regular':    350,
  'brownie-nutella-rv': 500,
  'brownie-biscoff':    550,
  'brownie-box-6':      850,
  'cream-bun-regular':  650,
  'cream-bun-nutella':  750,
  'cream-bun-biscoff':  850,
  'milk-cake-bento':    850,
  'milk-cake-half':    6500,
};

const MIN_QUANTITIES = {
  'milk-cake-bento': 6,
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Validate env vars are present ─────────────────────────────────────────
  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) {
    console.error('Missing Square env vars');
    return res.status(500).json({ error: 'Payment service not configured.' });
  }

  try {
    const { sourceId, cartItems, buyerInfo } = req.body || {};

    // ── Input validation ───────────────────────────────────────────────────
    if (!sourceId || typeof sourceId !== 'string') {
      return res.status(400).json({ error: 'Invalid payment token.' });
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    if (!buyerInfo?.name || !buyerInfo?.email || !buyerInfo?.phone) {
      return res.status(400).json({ error: 'Contact details are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // ── Server-side price calculation ──────────────────────────────────────
    let totalCents = 0;
    for (const item of cartItems) {
      const unitPrice = PRICES[item.id];
      if (!unitPrice) return res.status(400).json({ error: `Unknown item: ${item.id}` });
      const qty = parseInt(item.qty, 10);
      if (!qty || qty < 1) return res.status(400).json({ error: 'Invalid quantity.' });
      const minQty = MIN_QUANTITIES[item.id];
      if (minQty && qty < minQty) {
        return res.status(400).json({ error: `${item.id} requires a minimum of ${minQty}.` });
      }
      totalCents += unitPrice * qty;
    }

    if (totalCents < 100) {
      return res.status(400).json({ error: 'Order total is too low.' });
    }

    // ── Call Square Payments API ───────────────────────────────────────────
    const isProduction = process.env.SQUARE_ENVIRONMENT === 'production';
    const squareBase = isProduction
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    const orderNote = cartItems.map(i => `${i.name} ×${i.qty}`).join(', ');
    const paymentBody = {
      source_id: sourceId,
      idempotency_key: randomUUID(),
      amount_money: { amount: totalCents, currency: 'CAD' },
      location_id: process.env.SQUARE_LOCATION_ID,
      buyer_email_address: buyerInfo.email,
      note: `Order — ${buyerInfo.name} (${buyerInfo.phone}): ${orderNote}${buyerInfo.deliveryDate ? ' · ' + buyerInfo.deliveryDate : ''}${buyerInfo.notes ? ' · Notes: ' + buyerInfo.notes : ''}`,
    };

    const squareRes = await fetch(`${squareBase}/v2/payments`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentBody),
    });

    const squareData = await squareRes.json();

    if (!squareRes.ok || !squareData.payment) {
      const errMsg = squareData.errors?.[0]?.detail || 'Payment declined.';
      console.error('Square error:', squareData.errors);
      return res.status(402).json({ error: errMsg });
    }

    // ── Success ────────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      paymentId: squareData.payment.id,
      totalCents,
      receiptUrl: squareData.payment.receipt_url,
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
