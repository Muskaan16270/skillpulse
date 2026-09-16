import { useState, useCallback } from 'react';
import {
  BadgeCheck, Award, Briefcase, GraduationCap, TrendingUp,
  FileCheck, Download, Share2, QrCode, X, Copy, Check, Link2, ShieldCheck,
} from 'lucide-react';
import { Card, SectionTitle, Badge, EvidenceBadge, ProgressBar } from '@/components/ui';
import { trainees } from '@/data/mockData';

export function SkillPassport() {
  const [selectedId, setSelectedId] = useState(trainees[0].id);
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const trainee = trainees.find((t) => t.id === selectedId) || trainees[0];

  const shareLink = `https://skill-passport.demo/app/p/${trainee.unifiedId.replace(/-/g, '').toLowerCase()}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareLink]);

  // Stable pseudo-random QR pattern based on trainee ID
  const qrCells = Array.from({ length: 256 }).map((_, i) => {
    const seed = (trainee.id.charCodeAt(0) + trainee.id.charCodeAt(1) + i * 7) % 3;
    return seed !== 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skill Passport</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Verified, portable record of skills, training, and employment outcomes</p>
      </div>

      {/* Trainee selector */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Select Trainee:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            {trainees.map((t) => (
              <option key={t.id} value={t.id}>{t.name} — {t.unifiedId}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Passport card */}
      <Card className="overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-accent-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-xl font-bold">
                {trainee.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{trainee.name}</h2>
                <p className="text-sm text-brand-100">{trainee.unifiedId}</p>
                <p className="text-xs text-brand-200">{trainee.district}, {trainee.state}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-8 w-8 text-white/80" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Skills + Certifications */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <Award className="h-4 w-4 text-brand-500" /> Verified Skills
                </h3>
                <div className="mt-2 space-y-2">
                  {trainee.skills.map((skill) => (
                    <div key={skill} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{skill}</span>
                      <Badge color="emerald" size="sm">Verified</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <GraduationCap className="h-4 w-4 text-accent-500" /> Training & Certification
                </h3>
                <div className="mt-2 space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainee.courseName}</span>
                      <Badge color={trainee.certified ? 'emerald' : 'amber'} size="sm">{trainee.certified ? 'Certified' : 'Pending'}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{trainee.providerName} • {trainee.cohort}</p>
                    <p className="text-xs text-gray-400">{trainee.education}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Employment + Progression */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <Briefcase className="h-4 w-4 text-violet-500" /> Employment Outcome
                </h3>
                <div className="mt-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Status</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">{trainee.employmentStatus}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Job Role</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">{trainee.jobRole || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Industry</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">{trainee.industry || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Salary</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">{trainee.salaryRange || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Relevance</dt>
                      <dd>{trainee.jobRelevance ? <Badge color={trainee.jobRelevance === 'High' ? 'emerald' : 'amber'} size="sm">{trainee.jobRelevance}</Badge> : '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Retention</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">{trainee.isRetained ? `${trainee.retentionMonths} months` : 'Pending'}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-500">Evidence</dt>
                      <dd><EvidenceBadge state={trainee.evidence} /></dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <TrendingUp className="h-4 w-4 text-emerald-500" /> Experience & Progression
                </h3>
                <div className="mt-2 space-y-2">
                  {trainee.followUps.map((f) => (
                    <div key={f.period} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{f.period}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{f.employed ? `₹${f.salary?.toLocaleString('en-IN') || '—'}` : 'Not employed'}</span>
                        {f.employed && <Badge color="emerald" size="sm">Active</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skill Readiness */}
          <div className="mt-6 rounded-lg bg-gradient-to-r from-brand-50 to-accent-50 p-4 dark:from-brand-900/20 dark:to-accent-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Skill Readiness Index</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Prototype Indicator — Not an Official Government Score</p>
              </div>
              <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{trainee.skillReadinessScore}<span className="text-lg text-gray-400">/100</span></p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              <Share2 className="h-4 w-4" /> Share Skill Passport
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <QrCode className="h-4 w-4" /> Generate QR
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
      </Card>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowQR(false)}>
          <Card className="max-w-sm p-6" >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Skill Passport QR</h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 flex flex-col items-center">
              {/* Fake QR */}
              <div className="grid h-48 w-48 grid-cols-8 gap-0.5 rounded-lg bg-white p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`} />
                ))}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">{trainee.name}</p>
              <p className="text-xs text-gray-500">{trainee.unifiedId}</p>
              <p className="mt-2 text-xs text-gray-400">Scan to verify skills and certifications</p>
              <p className="mt-1 text-xs text-amber-500">Prototype QR — not a real verification link</p>
            </div>
          </Card>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowShare(false)}>
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Skill Passport</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate a shareable link and QR code for this passport</p>
                </div>
                <button onClick={() => setShowShare(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left: QR + Copy Link */}
                <div className="space-y-4">
                  {/* QR Card */}
                  <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                    <div className="flex flex-col items-center">
                      <div className="relative rounded-xl bg-white p-3 shadow-sm">
                        <div className="grid grid-cols-16 gap-px" style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}>
                          {qrCells.map((filled, i) => (
                            <div
                              key={i}
                              className={`aspect-square rounded-[1px] ${filled ? 'bg-gray-900' : 'bg-white'}`}
                            />
                          ))}
                        </div>
                        {/* Corner markers */}
                        <div className="absolute left-1 top-1 h-8 w-8 rounded border-2 border-gray-900 bg-white">
                          <div className="m-1 h-4 w-4 rounded-sm bg-gray-900" />
                        </div>
                        <div className="absolute right-1 top-1 h-8 w-8 rounded border-2 border-gray-900 bg-white">
                          <div className="m-1 h-4 w-4 rounded-sm bg-gray-900" />
                        </div>
                        <div className="absolute bottom-1 left-1 h-8 w-8 rounded border-2 border-gray-900 bg-white">
                          <div className="m-1 h-4 w-4 rounded-sm bg-gray-900" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <BadgeCheck className="h-4 w-4 text-brand-500" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{trainee.unifiedId}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">{trainee.name} • {trainee.district}</p>
                    </div>
                  </div>

                  {/* Copy Share Link */}
                  <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Shareable Link</p>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
                        <Link2 className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="truncate text-xs text-gray-600 dark:text-gray-300">{shareLink}</span>
                      </div>
                      <button
                        onClick={handleCopy}
                        className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          copied
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-brand-600 text-white hover:bg-brand-700'
                        }`}
                      >
                        {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                      </button>
                    </div>
                  </div>

                  {/* Demo note */}
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-900/20">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Demo QR — no real personal data is shared. This link and QR code are for prototype demonstration only.
                    </p>
                  </div>
                </div>

                {/* Right: Shared Preview */}
                <div className="space-y-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Shared Preview — what others will see:</p>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700">
                    {/* Preview Header */}
                    <div className="rounded-t-xl bg-gradient-to-r from-brand-600 to-accent-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-sm font-bold backdrop-blur">
                          {trainee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{trainee.name}</p>
                          <p className="text-xs text-brand-100">{trainee.unifiedId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Preview Body */}
                    <div className="space-y-4 p-4">
                      {/* Verified Skills */}
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                          <Award className="h-3.5 w-3.5 text-brand-500" /> Verified Skills
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {trainee.skills.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                              <BadgeCheck className="h-3 w-3" /> {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certification */}
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                          <GraduationCap className="h-3.5 w-3.5 text-accent-500" /> Certification
                        </p>
                        <div className="mt-1.5 rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">{trainee.courseName}</span>
                            <Badge color={trainee.certified ? 'emerald' : 'amber'} size="sm">{trainee.certified ? 'Certified' : 'Pending'}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{trainee.providerName} • {trainee.cohort}</p>
                        </div>
                      </div>

                      {/* Employment Outcome */}
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                          <Briefcase className="h-3.5 w-3.5 text-violet-500" /> Employment Outcome
                        </p>
                        <div className="mt-1.5 space-y-1.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-medium text-gray-900 dark:text-white">{trainee.employmentStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Role</span>
                            <span className="font-medium text-gray-900 dark:text-white">{trainee.jobRole || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Industry</span>
                            <span className="font-medium text-gray-900 dark:text-white">{trainee.industry || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Retention</span>
                            <span className="font-medium text-gray-900 dark:text-white">{trainee.isRetained ? `${trainee.retentionMonths} months` : 'Pending'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Evidence Status */}
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                          <FileCheck className="h-3.5 w-3.5 text-gray-500" /> Evidence Status
                        </p>
                        <div className="mt-1.5 flex items-center justify-between rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
                          <span className="text-xs text-gray-500">Verification Level</span>
                          <EvidenceBadge state={trainee.evidence} />
                        </div>
                      </div>

                      {/* Skill Readiness */}
                      <div className="rounded-lg bg-gradient-to-r from-brand-50 to-accent-50 p-2.5 dark:from-brand-900/20 dark:to-accent-900/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">Readiness Index</span>
                          <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{trainee.skillReadinessScore}<span className="text-xs text-gray-400">/100</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowShare(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => { setShowShare(false); setShowQR(true); }}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center justify-center gap-2"><QrCode className="h-4 w-4" /> View Full QR</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
