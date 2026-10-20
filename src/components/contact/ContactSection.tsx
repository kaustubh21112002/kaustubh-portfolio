import React, { useState } from 'react';
import { Mail, Linkedin, Github, Send, Copy, Check, MapPin, Phone, Info, AlertCircle, FileText } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

const MAX_MESSAGE_LENGTH = 1500;

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [dispatchAttempted, setDispatchAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const buildFormattedMessage = () => {
    return [
      `To: ${portfolioConfig.fullName} <${portfolioConfig.socials.email}>`,
      `Subject: [Portfolio Inquiry] ${formData.subject.trim() || 'Opportunity Discussion'}`,
      `From: ${formData.name.trim()} (${formData.email.trim()})`,
      '',
      'Message:',
      formData.message.trim()
    ].join('\n');
  };

  const copyFormattedMessage = async () => {
    if (!formData.message.trim() && !formData.name.trim()) {
      setValidationError('Please enter at least your name or a message to copy.');
      return;
    }
    setValidationError(null);

    const textToCopy = buildFormattedMessage();
    let success = false;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 4000);
    } else {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 5000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setValidationError('Please complete all required fields before dispatching.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    const subject = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject.trim() || 'Opportunity Discussion'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
    );

    window.location.href = `mailto:${portfolioConfig.socials.email}?subject=${subject}&body=${body}`;
    setDispatchAttempted(true);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2500);
  };

  return (
    <section id="contact" className="py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0e1017] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-3">
            <span className="font-bold text-red-400">(08)</span>
            <span>Direct Contact • Inquiries & Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Let’s Discuss Analytics & Research
          </h2>
          <p className="text-white/75 text-base mt-2 max-w-xl mx-auto">
            Available for Business Analyst, Data Analyst, and Valuation roles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Direct Contact Channels</h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Connect directly via verified email, phone, or professional networks.
                </p>
              </div>

              {/* Email Pill Box */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono text-white/75 uppercase">Email Address</div>
                    <a
                      href={`mailto:${portfolioConfig.socials.email}`}
                      className="text-xs xl:text-sm font-mono text-white hover:text-red-400 transition-colors block break-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                    >
                      {portfolioConfig.socials.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/75 hover:text-white transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  title="Copy email"
                  aria-label="Copy direct email address to clipboard"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone / WhatsApp Box */}
              {portfolioConfig.socials.phone && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/75 uppercase">Direct Phone</div>
                    <a
                      href={`tel:${portfolioConfig.socials.phone}`}
                      className="text-xs sm:text-sm font-mono text-white hover:text-emerald-400 transition-colors block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                    >
                      {portfolioConfig.socials.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-3">
                <a
                  href={portfolioConfig.socials.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                        LinkedIn Profile
                      </div>
                      <div className="text-xs font-mono text-white/75">linkedin.com/in/kaustubhnandurkar</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/75 group-hover:text-white transition-colors">
                    ↗
                  </span>
                </a>

                <a
                  href={portfolioConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                        GitHub Profile
                      </div>
                      <div className="text-xs font-mono text-white/75">github.com/kaustubh21112002</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/75 group-hover:text-white transition-colors">
                    ↗
                  </span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/75 pt-2 border-t border-white/5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Location: {portfolioConfig.location}</span>
              </div>
            </div>
          </div>

          {/* Direct Email Dispatcher */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-5 shadow-xl"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-white">Send a Direct Message</h3>
                <span className="text-[11px] font-mono text-white/60 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  Client-side Dispatch
                </span>
              </div>

              {validationError && (
                <div role="alert" className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono uppercase text-white/75 mb-1.5">Your Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hiring Manager / Team Lead"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono uppercase text-white/75 mb-1.5">Your Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. contact@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono uppercase text-white/75 mb-1.5">Inquiry Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Role Opportunity / Valuation Model Inquiry"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase text-white/75">Message / Details *</label>
                  <span className={`text-[11px] font-mono ${formData.message.length > MAX_MESSAGE_LENGTH ? 'text-red-400 font-bold' : 'text-white/60'}`}>
                    {formData.message.length} / {MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please specify role scope, analytical questions, or discussion topics..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors resize-none"
                />
              </div>

              {/* Action Buttons: Primary Mail App Dispatch & Secondary Copy Message */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Send message via default mail client application"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all ${
                    isSubmitting
                      ? 'bg-white/60 text-black/60 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/95 shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 cursor-pointer'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400`}
                >
                  <span>{isSubmitting ? 'Opening Mail Client...' : 'Open in Default Email Client'}</span>
                  <Send className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={copyFormattedMessage}
                  aria-label="Copy formatted message to clipboard for webmail"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white font-mono text-xs tracking-wider transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Copy className="w-3.5 h-3.5 text-red-400" />
                  <span>Copy Formatted Message for Webmail</span>
                </button>
              </div>

              {/* Truthful Dispatch Notice */}
              {dispatchAttempted && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-left space-y-2 font-sans">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-300 font-bold">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Email Client Launch Notice</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Your default email application should open with your pre-filled inquiry. If your email application does not launch automatically, click “Copy Formatted Message for Webmail” above and send directly to{' '}
                    <span className="font-mono text-white font-semibold">{portfolioConfig.socials.email}</span>.
                  </p>
                </div>
              )}

              {/* Copy Feedback */}
              {copyStatus === 'copied' && (
                <p className="text-center text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Formatted message copied to clipboard. Ready to paste into Gmail, Outlook, or webmail.</span>
                </p>
              )}
              {copyStatus === 'failed' && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-left">
                  <p className="text-xs font-mono text-amber-300">
                    Clipboard access unavailable. Please select and copy your text below:
                  </p>
                  <textarea
                    readOnly
                    rows={4}
                    value={buildFormattedMessage()}
                    className="w-full p-2.5 bg-black/60 rounded-lg text-xs font-mono text-white/90 border border-white/10"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              )}
            </form>
          </div>
        </div>


        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/75">
          <div>
            © {new Date().getFullYear()} {portfolioConfig.fullName}. All analytical methodologies preserved.
          </div>
          <div>
            Independent Research & Portfolio Demonstration
          </div>
        </div>
      </div>
    </section>
  );
};
