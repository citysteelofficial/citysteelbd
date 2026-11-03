import { supabase } from '@/lib/supabase';

/**
 * Contact form endpoint.
 *
 * The form used to insert into `contact_messages` straight from the browser.
 * It now posts here, so validation runs on the server, repeat senders are
 * throttled, and every new lead can be emailed to the office.
 *
 * Email is optional: it is sent only when both env vars are set in Vercel.
 *   RESEND_API_KEY     — API key from resend.com
 *   LEAD_NOTIFY_EMAIL  — inbox that receives the alerts (comma-separated for several)
 * Without them the message is still saved and shown in /admin/messages.
 */

export const dynamic = 'force-dynamic';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort, per server instance. Enough to stop one browser looping the form.
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type Lead = { name: string; email: string; phone: string; subject: string; message: string };

async function sendLeadEmail(lead: Lead, page: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const rows: Array<[string, string]> = [
    ['Name', lead.name],
    ['Phone', lead.phone || '—'],
    ['Email', lead.email],
    ['Subject', lead.subject || '—'],
    ['Page', page || '/contact'],
  ];
  const phoneDigits = lead.phone.replace(/[^\d]/g, '');
  const waDigits = phoneDigits.startsWith('0') ? `88${phoneDigits}` : phoneDigits;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;color:#111">
    <h2 style="margin:0 0 4px;color:#b91c1c">New enquiry from citysteelbd.com</h2>
    <p style="margin:0 0 16px;color:#555;font-size:13px">${escapeHtml(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }))} (Dhaka)</p>
    <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="color:#555;width:90px;vertical-align:top"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join('')}
    </table>
    <p style="margin:16px 0 4px"><b>Message</b></p>
    <div style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;font-size:14px">${escapeHtml(lead.message)}</div>
    <p style="margin-top:20px;font-size:14px">
      ${lead.phone ? `<a href="tel:${escapeHtml(lead.phone)}">Call</a> · ` : ''}
      ${waDigits.length >= 10 ? `<a href="https://wa.me/${waDigits}">WhatsApp</a> · ` : ''}
      <a href="mailto:${escapeHtml(lead.email)}">Reply by email</a> ·
      <a href="https://citysteelbd.com/admin/messages">Open admin</a>
    </p>
  </div>`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || 'City Steel Website <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: lead.email,
        subject: `New lead: ${lead.name}${lead.subject ? ` — ${lead.subject}` : ''}`.slice(0, 180),
        html,
      }),
      signal: controller.signal,
    });
    if (!res.ok) console.error('Lead email failed:', res.status, await res.text());
  } catch (err) {
    console.error('Lead email error:', err);
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (str(body.company_website, 200) !== '') {
    return Response.json({ ok: true });
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: 'Too many messages. Please call us at 01711-787556.' },
      { status: 429 },
    );
  }

  const lead: Lead = {
    name: str(body.name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 30),
    subject: str(body.subject, 150),
    message: str(body.message, 5000),
  };

  if (lead.name.length < 2) return Response.json({ ok: false, error: 'Please enter your full name.' }, { status: 400 });
  if (!EMAIL_PATTERN.test(lead.email)) return Response.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  if (lead.message.length < 10) return Response.json({ ok: false, error: 'Please describe your requirement in at least 10 characters.' }, { status: 400 });

  const { error } = await supabase.from('contact_messages').insert([{
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    subject: lead.subject || null,
    message: lead.message,
  }]);

  if (error) {
    console.error('Contact insert error:', error);
    return Response.json(
      { ok: false, error: 'Message could not be sent. Please try again or call us directly.' },
      { status: 500 },
    );
  }

  await sendLeadEmail(lead, str(body.page, 200));
  return Response.json({ ok: true });
}
