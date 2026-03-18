
import React, { useState } from 'react';
import { Student } from '../types';
import { Button, Card, PageHeader } from '../components/UI';
import { 
  Search, PlayCircle, FileText, MessageCircle, HelpCircle, 
  ChevronDown, Mail, Phone, Clock, Send, 
  CheckCircle, ExternalLink, MessageSquare
} from 'lucide-react';

// FAQ Data Structure
const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    questions: [
      { q: "How do I log in?", a: "You can log in using your JAMB Registration Number and the password you created during the initial setup. If you've forgotten your password, use the reset link on the login page." },
      { q: "What documents do I need?", a: "You need your JAMB Result, O-Level Result, Birth Certificate, and State of Origin Certificate. Specific offices might require additional documents like medical reports or receipts." },
      { q: "Can I complete clearance in multiple sessions?", a: "Yes. The system saves your progress automatically. You can log out and continue from where you left off at any time." }
    ]
  },
  {
    id: 'uploading',
    title: 'Uploading Documents',
    questions: [
      { q: "What file formats are accepted?", a: "We accept PDF, JPG, JPEG, and PNG files. PDF is recommended for text-heavy documents." },
      { q: "What if my file is too large?", a: "The maximum file size is 5MB. You can use online tools to compress your PDF or image before uploading." },
      { q: "Can I replace a document after uploading?", a: "Yes, as long as the status is 'Pending' or 'Rejected'. If a document is 'Approved', you cannot change it." }
    ]
  },
  {
    id: 'review',
    title: 'Review Process',
    questions: [
      { q: "How long does review take?", a: "Most documents are reviewed within 24-48 hours during business days. Peak periods might cause slight delays." },
      { q: "What if my document is rejected?", a: "You will receive a notification explaining the reason for rejection. You can then correct the issue and re-upload the document." },
      { q: "Who reviews my documents?", a: "Verified clearance officers from the respective units (Admissions, Bursary, etc.) review your submissions manually." }
    ]
  },
  {
    id: 'approval',
    title: 'After Approval',
    questions: [
      { q: "How do I download my certificate?", a: "Once all offices have approved your clearance, a 'Download Certificate' button will appear on your dashboard." },
      { q: "What do I do with my certificate?", a: "Print two copies. Keep one for yourself and submit the other to your Faculty Officer for final physical filing." },
      { q: "Can I get a physical copy?", a: "The digital certificate is official. However, you will get a physical stamp on your printed copy at the Faculty Office." }
    ]
  }
];

interface Props {
  student: Student;
  onNavigate: (view: 'dashboard') => void;
}

export default function HelpPage({ student, onNavigate }: Props) {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        setContactMessage('');
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <PageHeader 
          title="Help Center" 
          breadcrumbs={['Dashboard', 'Help & Support']}
          onBreadcrumbClick={(index: number) => {
              if (index === 0) onNavigate('dashboard');
          }}
      />

      {/* Hero Section */}
      <div className="bg-secondary rounded-3xl p-8 md:p-12 text-center text-secondary-foreground mb-10 relative overflow-hidden shadow-xl">
           <div className="relative z-10 max-w-2xl mx-auto">
               <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">How can we help you?</h1>
               <p className="text-secondary-foreground/80 text-lg mb-8">
                   Find answers to common questions, watch tutorials, or get in touch with our support team.
               </p>
               <div className="relative max-w-lg mx-auto">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-foreground/60" size={20} />
                   <input 
                      type="text" 
                      placeholder="Search for answers..." 
                      className="w-full pl-12 pr-4 py-3.5 rounded-full bg-secondary-foreground/10 border border-secondary-foreground/20 backdrop-blur-sm text-secondary-foreground placeholder:text-secondary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-secondary-foreground/20 transition-all"
                   />
               </div>
           </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
               { icon: PlayCircle, label: "Video Tutorial", desc: "Watch walkthrough", action: () => window.open('https://youtube.com', '_blank') },
               { icon: FileText, label: "Requirements", desc: "Download PDF list", action: () => alert("Downloading requirements PDF...") },
               { icon: MessageCircle, label: "Contact Support", desc: "Get in touch", action: () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }) },
               { icon: HelpCircle, label: "FAQs", desc: "Common questions", action: () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }) }
           ].map((item, i) => (
               <Card key={i} onClick={item.action} className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary">
                   <div className="mb-4 p-3 bg-primary/10 text-primary rounded-xl w-fit group-hover:scale-110 transition-transform">
                       <item.icon size={24} />
                   </div>
                   <h3 className="font-bold text-foreground mb-1">{item.label}</h3>
                   <p className="text-sm text-muted-foreground">{item.desc}</p>
               </Card>
           ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Main Content: FAQs */}
          <div className="flex-1 w-full" id="faq-section">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <HelpCircle className="text-primary" /> Frequently Asked Questions
              </h2>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                  {FAQ_CATEGORIES.map(cat => (
                      <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                              activeCategory === cat.id 
                              ? 'bg-primary text-primary-foreground shadow-md' 
                              : 'bg-card text-muted-foreground border border-border hover:bg-muted'
                          }`}
                      >
                          {cat.title}
                      </button>
                  ))}
              </div>

              {/* Accordion */}
              <div className="space-y-4">
                  {FAQ_CATEGORIES.find(c => c.id === activeCategory)?.questions.map((item, idx) => (
                      <div key={idx} className="bg-card rounded-2xl border border-border overflow-hidden">
                          <button 
                              onClick={() => toggleQuestion(item.q)}
                              className="w-full flex items-center justify-between p-5 text-left font-bold text-foreground hover:bg-muted/50 transition-colors"
                          >
                              <span>{item.q}</span>
                              <ChevronDown size={20} className={`text-muted-foreground transition-transform ${openQuestion === item.q ? 'rotate-180' : ''}`} />
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ${openQuestion === item.q ? 'max-h-48' : 'max-h-0'}`}>
                              <div className="p-5 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/50">
                                  {item.a}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Sidebar: Contact & Status */}
          <div className="w-full xl:w-96 space-y-8">
              
              {/* Contact Form */}
              <div id="contact-form" className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
                      <MessageSquare className="text-primary" size={20} /> Contact Support
                  </h3>
                  
                  {showSuccess ? (
                      <div className="text-center py-8 animate-in fade-in zoom-in">
                          <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle size={32} />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">Message Sent!</h4>
                          <p className="text-sm text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                          <Button variant="outline" onClick={() => setShowSuccess(false)}>Send Another</Button>
                      </div>
                  ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Full Name</label>
                              <input type="text" value={student.name} disabled className="w-full p-2.5 bg-muted border-none rounded-lg text-sm text-muted-foreground cursor-not-allowed" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Subject</label>
                              <select 
                                value={contactSubject}
                                onChange={(e) => setContactSubject(e.target.value)}
                                className="w-full p-2.5 bg-muted border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                              >
                                  <option>General Inquiry</option>
                                  <option>Technical Issue</option>
                                  <option>Document Rejection</option>
                                  <option>Payment Issue</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Message</label>
                              <textarea 
                                  required
                                  value={contactMessage}
                                  onChange={(e) => setContactMessage(e.target.value)}
                                  rows={4} 
                                  placeholder="Describe your issue..." 
                                  className="w-full p-3 bg-muted border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                              ></textarea>
                          </div>
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                              {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={16} />
                          </Button>
                      </form>
                  )}

                  <div className="mt-8 pt-6 border-t border-border space-y-4">
                      <a href="mailto:admissions@university.edu" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Mail size={16} /> admissions@university.edu
                      </a>
                      <a href="tel:+2341234567890" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Phone size={16} /> +234 123 456 7890
                      </a>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Clock size={16} /> Mon-Fri, 8AM-5PM
                      </div>
                  </div>
              </div>

              {/* System Status */}
              <Card className="bg-secondary text-secondary-foreground border-none">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                          <div className="w-3 h-3 bg-primary/100 rounded-full"></div>
                          <div className="absolute inset-0 bg-primary/100 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <h4 className="font-bold">System Status</h4>
                  </div>
                  <p className="text-sm text-secondary-foreground/80 mb-2">All systems operational</p>
                  <p className="text-xs text-secondary-foreground/50">Last updated: {new Date().toLocaleTimeString()}</p>
              </Card>

              {/* Useful Links */}
              <Card>
                  <h4 className="font-bold text-foreground mb-4">Useful Links</h4>
                  <div className="space-y-3">
                      {[
                          { label: "University Homepage", url: "#" },
                          { label: "JAMB Portal", url: "https://jamb.gov.ng" },
                          { label: "NYSC Portal", url: "https://portal.nysc.org.ng" },
                          { label: "Download Templates", url: "#" }
                      ].map((link, i) => (
                          <a 
                             key={i} 
                             href={link.url} 
                             target="_blank" 
                             rel="noreferrer"
                             className="flex items-center justify-between p-2 rounded-lg hover:bg-muted group transition-colors"
                          >
                              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">{link.label}</span>
                              <ExternalLink size={14} className="text-muted-foreground/80 group-hover:text-primary" />
                          </a>
                      ))}
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
}
