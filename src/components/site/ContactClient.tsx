"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle, Clock, Building2, Factory } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_SECONDS = 3;

export function ContactClient() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  // Bot traps: a field no human can see, plus the time the form was rendered.
  // Scripted submissions fill every input and post almost instantly.
  const [honeypot, setHoneypot] = useState('');
  const mountedAt = useRef<number | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // The Career page links here with the job title already in the query string.
  // Read it from the URL directly rather than with useSearchParams: that hook
  // would force this whole subtree behind a Suspense boundary and drop the
  // contact details out of the server-rendered HTML. Syncing once on mount from
  // an external source (the URL) is the intended use of an effect here — the
  // server cannot know the query string for a statically rendered page.
  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get('subject');
    if (subject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => (prev.subject ? prev : { ...prev, subject: subject.slice(0, 150) }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (name.length < 2) return 'Please enter your full name.';
    if (name.length > 100) return 'Name is too long.';
    if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.';
    if (formData.phone.trim().length > 30) return 'Phone number is too long.';
    if (formData.subject.trim().length > 150) return 'Subject is too long.';
    if (message.length < 10) return 'Please describe your requirement in at least 10 characters.';
    if (message.length > 5000) return 'Message is too long. Please keep it under 5000 characters.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silently accept honeypot hits so bots get no signal that they were caught.
    // A null mount time means the effect has not run yet, so skip the timing
    // check rather than punishing a genuine user for a race we caused.
    const elapsedSeconds = mountedAt.current === null
      ? Infinity
      : (Date.now() - mountedAt.current) / 1000;
    if (honeypot.trim() !== '' || elapsedSeconds < MIN_FILL_SECONDS) {
      setStatus('success');
      setWhatsappUrl('');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      return;
    }

    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setErrorMsg(validationError);
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('contact_messages').insert([{
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      subject: formData.subject.trim() || null,
      message: formData.message.trim(),
    }]);

    if (error) {
      setStatus('error');
      setErrorMsg('Message could not be sent. Please try again or call us directly.');
      console.error('Contact form error:', error);
    } else {
      // Create WhatsApp message format
      const waMessage = `*New Contact Request*
*Name:* ${formData.name.trim()}
*Email:* ${formData.email.trim()}
*Phone:* ${formData.phone.trim() || 'N/A'}
*Subject:* ${formData.subject.trim() || 'N/A'}
*Message:*
${formData.message.trim()}`;

      const encodedMessage = encodeURIComponent(waMessage);
      // Ensure the phone number format is correct (include country code without + or 00)
      const waUrl = `https://wa.me/8801711787556?text=${encodedMessage}`;

      // Opening after an await loses the user-activation gesture in some
      // browsers, so keep the URL around to offer as a manual link instead.
      const opened = window.open(waUrl, '_blank');
      setWhatsappUrl(opened ? '' : waUrl);

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      mountedAt.current = Date.now();
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Get In Touch"
        description="Have a project in mind? Tell us about it and our engineering team will get back to you within one business day."
      />

      <section className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            {/* Corporate Office */}
            <div className="flex items-start gap-4 border border-border bg-surface p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-primary shadow-red">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Corporate Office</div>
                <div className="mt-1 text-foreground">7/6, Garden Street, Ring Road, Shyamoli, Dhaka-1207</div>
              </div>
            </div>

            {/* Factory Address */}
            <div className="flex items-start gap-4 border border-border bg-surface p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-primary shadow-red">
                <Factory className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Factory Address</div>
                <div className="mt-1 text-foreground">Hemayatpur, Savar, Dhaka</div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex items-start gap-4 border border-border bg-surface p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-primary shadow-red">
                <Phone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Phone</div>
                <a href="tel:+8801711787556" className="mt-1 block text-foreground hover:text-primary transition-colors">+880 1711-787556</a>
                <a href="tel:+8801711991775" className="block text-foreground hover:text-primary transition-colors">+880 1711-991775</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 border border-border bg-surface p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-primary shadow-red">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Email</div>
                <a href="mailto:citysteel.corporation@gmail.com" className="mt-1 text-foreground hover:text-primary transition-colors">citysteel.corporation@gmail.com</a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4 border border-border bg-surface p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-primary shadow-red">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Business Hours</div>
                <div className="mt-1 text-foreground">Saturday – Thursday: 9:00 AM – 6:00 PM</div>
                <div className="text-muted-foreground">Friday: Closed</div>
              </div>
            </div>
          </div>

          <form className="relative border border-border bg-surface p-8 lg:col-span-3" onSubmit={handleSubmit}>
            <h2 className="mb-6 font-display text-3xl font-bold uppercase">
              Send Us a <span className="text-gradient-red">Message</span>
            </h2>

            {status === 'success' ? (
              <div className="border border-green-500/30 bg-green-50 p-6 text-center rounded-lg">
                <CheckCircle className="mx-auto h-10 w-10 text-green-600 mb-3" />
                <div className="mb-2 font-display text-2xl font-bold text-green-700">Thank you!</div>
                <p className="text-sm text-green-600">Your message has been received.</p>
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
                  >
                    Also send via WhatsApp <Send className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="text-sm text-green-600 font-medium mt-2">WhatsApp has been opened automatically. Please press &quot;Send&quot; to forward your message directly to our team.</p>
                )}
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {status === 'error' && (
                  <div className="flex items-center gap-2 border border-red-300 bg-red-50 p-4 rounded-lg text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}
                {/* Honeypot — hidden from humans, irresistible to bots. */}
                <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="company-website">Company website</label>
                  <input
                    id="company-website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                  <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <Field label="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center gap-3 bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    <>Send Message <Send className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, name, type = "text", required, value, onChange }: {
  label: string; name: string; type?: string; required?: boolean;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label} {required && '*'}
      </label>
      <input
        type={type} name={name} required={required} value={value} onChange={onChange}
        className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
