import React, { useState } from 'react';
import { Mail, Linkedin, Github, Send, Copy, Check, MessageSquare, MapPin, Phone } from 'lucide-react';
import { portfolioConfig } from '../../config/portfolio';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioConfig.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio Inquiry] ${formData.subject || 'Opportunity Discussion'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${portfolioConfig.socials.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
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
          <p className="text-white/60 text-base mt-2 max-w-xl mx-auto">
            Available for Business Analyst, Data Analyst, and Valuation roles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6 shadow-xl">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Direct Contact Channels</h3>
                <p className="text-xs text-white/60 leading-relaxed">
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
                    <div className="text-xs font-mono text-white/65 uppercase">Email Address</div>
                    <a
                      href={`mailto:${portfolioConfig.socials.email}`}
                      className="text-xs xl:text-sm font-mono text-white hover:text-red-400 transition-colors block break-all"
                    >
                      {portfolioConfig.socials.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all shrink-0"
                  title="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone / WhatsApp Box */}
              {portfolioConfig.socials.phone && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/65 uppercase">Direct Phone</div>
                    <a
                      href={`tel:${portfolioConfig.socials.phone}`}
                      className="text-xs sm:text-sm font-mono text-white hover:text-emerald-400 transition-colors block"
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
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                        LinkedIn Profile
                      </div>
                      <div className="text-xs font-mono text-white/65">linkedin.com/in/kaustubhnandurkar</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                    ↗
                  </span>
                </a>

                <a
                  href={portfolioConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                        GitHub Profile
                      </div>
                      <div className="text-xs font-mono text-white/65">github.com/kaustubh21112002</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                    ↗
                  </span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/50 pt-2 border-t border-white/5">
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
              <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hiring Manager / Team Lead"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. contact@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">Inquiry Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Role Opportunity / Valuation Model Inquiry"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/60 mb-1.5">Message / Details</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please specify role scope, analytical questions, or discussion topics..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/60 text-sm focus:border-red-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>

              {submitted && (
                <p className="text-center text-xs font-mono text-emerald-400 mt-2">
                  Opening mail client with pre-filled message...
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/65">
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
