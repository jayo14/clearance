
import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../components/UI';
import { 
  Book, Shield, Code, Server, ChevronRight, FileText, 
  CheckCircle, AlertCircle, Search, Menu, X
} from 'lucide-react';

type DocSection = 'student' | 'officer' | 'technical';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState<DocSection>('student');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: 'student', label: 'Student Guide', icon: Book },
    { id: 'officer', label: 'Officer Guide', icon: Shield },
    { id: 'technical', label: 'Technical Docs', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 transform transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h1 className="font-bold text-xl">Docs</h1>
          <button onClick={() => setIsMenuOpen(false)} className="md:hidden"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => { setActiveSection(section.id as DocSection); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === section.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground dark:text-muted-foreground hover:bg-muted hover:bg-accent'
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-border">
            <a href="/" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2">
                <ChevronRight size={16} className="rotate-180" /> Back to App
            </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-12">
        <button onClick={() => setIsMenuOpen(true)} className="md:hidden mb-6 p-2 bg-card rounded-lg border shadow-sm">
            <Menu size={24} />
        </button>

        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            
            {/* STUDENT GUIDE */}
            {activeSection === 'student' && (
                <section className="space-y-8">
                    <div className="border-b border-border pb-6">
                        <h1 className="text-3xl font-extrabold mb-2">Student User Guide</h1>
                        <p className="text-lg text-muted-foreground">Everything you need to know about completing your clearance.</p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> 1. Logging In</h2>
                            <p className="mb-4 text-muted-foreground dark:text-muted-foreground/80">
                                Use your <strong>JAMB Registration Number</strong> (e.g., 2024987654AB) as your ID. The default password for first-time users is sent to your email.
                            </p>
                            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-lg font-mono text-xs">
                                Tip: Ensure your JAMB number is 10 characters long.
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> 2. Uploading Documents</h2>
                            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground dark:text-muted-foreground/80">
                                <li>Navigate to the <strong>Dashboard</strong>.</li>
                                <li>Click on an Office Card (e.g., Admissions) or "Start Clearance".</li>
                                <li>Click the upload zone or drag and drop your file.</li>
                                <li>Wait for the <strong>AI Verification</strong> to confirm legibility.</li>
                                <li>Click <strong>Submit</strong> once all documents for that office are uploaded.</li>
                            </ol>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-primary" /> 3. Checking Status</h2>
                            <p className="text-muted-foreground dark:text-muted-foreground/80">
                                Go to the <strong>Status & Timeline</strong> page.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="p-3 bg-primary/5 dark:bg-amber-900/20 border border-amber-200 rounded-lg">
                                    <span className="font-bold text-amber-700 block mb-1">Pending</span>
                                    <span className="text-xs text-amber-600">Under review by officer.</span>
                                </div>
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                                    <span className="font-bold text-red-700 block mb-1">Rejected</span>
                                    <span className="text-xs text-red-600">Requires re-upload. Check comments.</span>
                                </div>
                                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                    <span className="font-bold text-primary block mb-1">Approved</span>
                                    <span className="text-xs text-primary">Clearance successful.</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            )}

            {/* OFFICER GUIDE */}
            {activeSection === 'officer' && (
                <section className="space-y-8">
                    <div className="border-b border-border pb-6">
                        <h1 className="text-3xl font-extrabold mb-2">Officer User Guide</h1>
                        <p className="text-lg text-muted-foreground">Procedures for verifying and approving student documents.</p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-xl font-bold mb-4">Navigating the Queue</h2>
                            <p className="mb-4 text-muted-foreground dark:text-muted-foreground/80">
                                The <strong>Clearance Queue</strong> shows all students pending your office's attention.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground dark:text-muted-foreground/80">
                                <li>Use <strong>Filters</strong> to sort by Date (Oldest First recommended).</li>
                                <li>Look for the <span className="text-red-500 font-bold">Urgent</span> tag for submissions older than 3 days.</li>
                                <li>Click "Review" to open the student's file.</li>
                            </ul>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold mb-4">Review Process</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold">Inspect Documents</h4>
                                        <p className="text-sm text-muted-foreground">Use the Zoom and Rotate tools. Check for authenticity and clarity.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold">Checklist Verification</h4>
                                        <p className="text-sm text-muted-foreground">Tick off requirements on the right sidebar as you verify them.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold">Decision</h4>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Approve:</strong> Only if all items are valid.<br/>
                                            <strong>Reject:</strong> Requires a comment explaining why (e.g., "Blurry Image").
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            )}

            {/* TECHNICAL DOCS */}
            {activeSection === 'technical' && (
                <section className="space-y-8">
                    <div className="border-b border-border pb-6">
                        <h1 className="text-3xl font-extrabold mb-2">Technical Documentation</h1>
                        <p className="text-lg text-muted-foreground">Architecture, API reference, and setup.</p>
                    </div>

                    <div className="grid gap-6">
                        <Card>
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Server size={20} /> System Architecture</h3>
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 mb-4">
                                The system is a React SPA communicating with a backend API (Django REST Framework).
                            </p>
                            <div className="bg-slate-100 dark:bg-secondary p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                Client (React) --HTTPS--&gt; API Gateway --HTTPS--&gt; Core Service<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&gt; Google Gemini API (AI)<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--&gt; Database (PostgreSQL)
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Code size={20} /> API Endpoints (Reference)</h3>
                            <table className="w-full text-sm text-left">
                                <thead className="border-b dark:border-border">
                                    <tr>
                                        <th className="py-2">Method</th>
                                        <th className="py-2">Endpoint</th>
                                        <th className="py-2">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-slate-800">
                                    <tr>
                                        <td className="py-2 font-mono text-primary">POST</td>
                                        <td className="py-2 font-mono">/auth/login</td>
                                        <td className="py-2">Authenticate user</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-mono text-primary">GET</td>
                                        <td className="py-2 font-mono">/student/:id</td>
                                        <td className="py-2">Get clearance record</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-mono text-primary">POST</td>
                                        <td className="py-2 font-mono">/upload</td>
                                        <td className="py-2">Upload document</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>

                        <div className="p-4 bg-secondary text-white rounded-xl">
                            <h3 className="font-bold mb-2">Runbook: Deployment</h3>
                            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground/80">
                                <li>Run <code>npm run build</code> to generate static assets.</li>
                                <li>Verify <code>API_KEY</code> is set in environment variables.</li>
                                <li>Deploy <code>dist/</code> folder to web server/CDN.</li>
                                <li>Check console for any Critical JS errors.</li>
                            </ol>
                        </div>
                    </div>
                </section>
            )}

        </div>
      </main>
    </div>
  );
}
