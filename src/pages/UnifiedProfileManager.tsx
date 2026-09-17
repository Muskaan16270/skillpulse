import { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Plus, Trash2, GraduationCap, Award, Briefcase,
  Building2, CheckCircle2, AlertTriangle, Loader2, Merge,
  ArrowRight, User, Sparkles, BookOpen,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import {
  type VerifiedIdentity,
  type UnifiedProfile,
  type Certification,
  type Internship,
  type ExperienceEntry,
  mergeProfileData,
} from '@/lib/identity';

type View = 'overview' | 'create' | 'merge_confirm' | 'unified';

const SKILL_OPTIONS = [
  'Python', 'SQL', 'Machine Learning', 'Excel', 'Power BI', 'Cloud (AWS)',
  'React', 'Node.js', 'Digital Marketing', 'SEO', 'Data Visualization', 'Tableau',
];
const EDUCATION_OPTIONS = ['10th Pass', '12th Pass', 'Diploma', 'ITI', 'Graduate', 'Post Graduate'];

export function UnifiedProfileManager({
  identity,
  onReset,
}: {
  identity: VerifiedIdentity;
  onReset: () => void;
}) {
  const [view, setView] = useState<View>('overview');
  const [profiles, setProfiles] = useState<UnifiedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [saving, setSaving] = useState(false);

  // Merge state
  const [mergedData, setMergedData] = useState<ReturnType<typeof mergeProfileData> | null>(null);
  const [mergeSaving, setMergeSaving] = useState(false);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('unified_profiles')
        .select('*')
        .eq('identity_id', identity.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      const fetched = (data || []) as UnifiedProfile[];
      setProfiles(fetched);

      const activeProfiles = fetched.filter((p) => p.status === 'active');
      if (activeProfiles.length > 1) {
        setMergedData(mergeProfileData(activeProfiles));
        setView('merge_confirm');
      }
    } catch {
      setError('Could not load profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [identity.id]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const activeProfiles = profiles.filter((p) => p.status === 'active');
  const mergedProfiles = profiles.filter((p) => p.status === 'merged');

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setCustomSkill('');
    }
  };

  const addCertification = () => {
    setCertifications((prev) => [...prev, { name: '', issuer: '', date: '' }]);
  };
  const updateCertification = (i: number, field: keyof Certification, value: string) => {
    setCertifications((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };
  const removeCertification = (i: number) => {
    setCertifications((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addInternship = () => {
    setInternships((prev) => [...prev, { organization: '', role: '', duration: '', startDate: '', endDate: '' }]);
  };
  const updateInternship = (i: number, field: keyof Internship, value: string) => {
    setInternships((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };
  const removeInternship = (i: number) => {
    setInternships((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addExperience = () => {
    setExperience((prev) => [...prev, { company: '', role: '', duration: '', startDate: '', endDate: '', description: '' }]);
  };
  const updateExperience = (i: number, field: keyof ExperienceEntry, value: string) => {
    setExperience((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };
  const removeExperience = (i: number) => {
    setExperience((prev) => prev.filter((_, idx) => idx !== i));
  };

  const resetForm = () => {
    setEducation('');
    setSkills([]);
    setCustomSkill('');
    setCertifications([]);
    setInternships([]);
    setExperience([]);
  };

  const handleSaveProfile = async () => {
    if (!education && skills.length === 0 && certifications.length === 0 && internships.length === 0 && experience.length === 0) {
      setError('Please add at least one qualification before saving.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from('unified_profiles')
        .insert({
          identity_id: identity.id,
          education: education || null,
          skills,
          certifications: JSON.stringify(certifications.filter((c) => c.name.trim())),
          internships: JSON.stringify(internships.filter((i) => i.organization.trim())),
          experience: JSON.stringify(experience.filter((e) => e.company.trim())),
          status: 'active',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setProfiles((prev) => [...prev, data as UnifiedProfile]);
      resetForm();
      setView('overview');
      await loadProfiles();
    } catch {
      setError('Could not save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMerge = async () => {
    if (!mergedData || activeProfiles.length < 2) return;
    setMergeSaving(true);
    setError('');
    try {
      const targetId = activeProfiles[0].id;
      const sourceIds = activeProfiles.slice(1).map((p) => p.id);

      const { error: updateError } = await supabase
        .from('unified_profiles')
        .update({
          skills: mergedData.skills,
          certifications: JSON.stringify(mergedData.certifications),
          internships: JSON.stringify(mergedData.internships),
          experience: JSON.stringify(mergedData.experience),
          education: mergedData.education,
        })
        .eq('id', targetId);

      if (updateError) throw updateError;

      for (const sourceId of sourceIds) {
        await supabase
          .from('unified_profiles')
          .update({ status: 'merged', merged_into: targetId })
          .eq('id', sourceId);

        await supabase.from('profile_merges').insert({
          identity_id: identity.id,
          source_profile_id: sourceId,
          target_profile_id: targetId,
          merged_fields: { skills: mergedData.skills.length, certifications: mergedData.certifications.length, internships: mergedData.internships.length, experience: mergedData.experience.length },
        });
      }

      await loadProfiles();
      setView('unified');
    } catch {
      setError('Could not merge profiles. Please try again.');
    } finally {
      setMergeSaving(false);
    }
  };

  const handleSkipMerge = () => {
    setView('overview');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header with identity info */}
      <Card className="border-l-4 border-l-emerald-400 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{identity.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{identity.email} · {identity.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="emerald" size="sm">Verified</Badge>
            <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-mono font-bold text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
              {identity.skillpulse_id}
            </span>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 dark:bg-rose-900/20">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Merge confirmation */}
      {view === 'merge_confirm' && mergedData && (
        <Card className="animate-fade-in border-l-4 border-l-amber-400 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Possible Duplicate Profile Detected</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                We found {activeProfiles.length} active profiles linked to your identity. Would you like to merge them into a single unified profile?
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="text-xs font-semibold uppercase text-gray-400">Merged Preview</p>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{mergedData.skills.length}</p>
                  <p className="text-xs text-gray-500">Skills</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{mergedData.certifications.length}</p>
                  <p className="text-xs text-gray-500">Certifications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{mergedData.internships.length}</p>
                  <p className="text-xs text-gray-500">Internships</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{mergedData.experience.length}</p>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
              </div>
              {mergedData.education && (
                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500">Highest Education: <span className="font-medium text-gray-900 dark:text-white">{mergedData.education}</span></p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleMerge}
                disabled={mergeSaving}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {mergeSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Merge className="h-4 w-4" />}
                Merge Profiles
              </button>
              <button
                onClick={handleSkipMerge}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Keep Separate
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Overview view */}
      {view === 'overview' && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Your Profiles</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activeProfiles.length} active · {mergedProfiles.length} merged
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setView('create'); }}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" /> Add New Profile
            </button>
          </div>

          {activeProfiles.length === 0 && mergedProfiles.length === 0 && (
            <Card className="p-8 text-center">
              <User className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">No profiles yet</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Create your first profile with your qualifications, skills, and experience.
              </p>
              <button
                onClick={() => setView('create')}
                className="mt-4 flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 mx-auto"
              >
                <Plus className="h-4 w-4" /> Create Profile
              </button>
            </Card>
          )}

          {activeProfiles.map((profile, idx) => (
            <Card key={profile.id} className="p-5 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Profile {idx + 1}</p>
                    <p className="text-xs text-gray-400">{profile.education || 'No education specified'}</p>
                  </div>
                </div>
                {idx === 0 && activeProfiles.length > 1 && (
                  <Badge color="amber" size="sm">Primary</Badge>
                )}
                {activeProfiles.length === 1 && (
                  <Badge color="emerald" size="sm">Active</Badge>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {profile.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Skills</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {profile.skills.map((s) => (
                        <span key={s} className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.certifications.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Certifications</p>
                    <div className="mt-1.5 space-y-1">
                      {profile.certifications.map((c, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{c.name} — {c.issuer}</p>
                      ))}
                    </div>
                  </div>
                )}
                {profile.internships.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Internships</p>
                    <div className="mt-1.5 space-y-1">
                      {profile.internships.map((c, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{c.role} at {c.organization}</p>
                      ))}
                    </div>
                  </div>
                )}
                {profile.experience.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Experience</p>
                    <div className="mt-1.5 space-y-1">
                      {profile.experience.map((c, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{c.role} at {c.company}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {mergedProfiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-400">Merged Profiles</p>
              {mergedProfiles.map((p) => (
                <Card key={p.id} className="p-3 opacity-60">
                  <div className="flex items-center gap-2">
                    <Merge className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Merged into primary profile</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeProfiles.length > 0 && (
            <button
              onClick={() => setView('unified')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-300 bg-brand-50 px-5 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
            >
              <Sparkles className="h-4 w-4" /> View Unified Profile
            </button>
          )}
        </>
      )}

      {/* Create profile form */}
      {view === 'create' && (
        <Card className="animate-fade-in p-6 space-y-6">
          <SectionTitle title="Add New Profile" subtitle="Enter qualifications from a different training program or job" icon={<Plus className="h-5 w-5" />} />

          {/* Education */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" /> Highest Education
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select education level</option>
              {EDUCATION_OPTIONS.map((ed) => (
                <option key={ed} value={ed}>{ed}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    skills.includes(skill)
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                placeholder="Add custom skill…"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={addCustomSkill}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {s}
                    <button onClick={() => toggleSkill(s)} className="text-brand-400 hover:text-brand-600"><Trash2 className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Award className="h-4 w-4" /> Certifications</label>
              <button onClick={addCertification} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {certifications.map((cert, i) => (
              <div key={i} className="mb-2 flex flex-wrap gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <input type="text" value={cert.name} onChange={(e) => updateCertification(i, 'name', e.target.value)} placeholder="Certification name" className="flex-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                <input type="text" value={cert.issuer} onChange={(e) => updateCertification(i, 'issuer', e.target.value)} placeholder="Issuer" className="w-32 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                <input type="date" value={cert.date} onChange={(e) => updateCertification(i, 'date', e.target.value)} className="rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                <button onClick={() => removeCertification(i)} className="text-gray-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>

          {/* Internships */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Building2 className="h-4 w-4" /> Internships</label>
              <button onClick={addInternship} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {internships.map((intern, i) => (
              <div key={i} className="mb-2 space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <input type="text" value={intern.organization} onChange={(e) => updateInternship(i, 'organization', e.target.value)} placeholder="Organization" className="flex-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <input type="text" value={intern.role} onChange={(e) => updateInternship(i, 'role', e.target.value)} placeholder="Role" className="w-32 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <button onClick={() => removeInternship(i)} className="text-gray-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input type="date" value={intern.startDate} onChange={(e) => updateInternship(i, 'startDate', e.target.value)} className="rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <input type="date" value={intern.endDate} onChange={(e) => updateInternship(i, 'endDate', e.target.value)} className="rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <input type="text" value={intern.duration} onChange={(e) => updateInternship(i, 'duration', e.target.value)} placeholder="Duration (e.g. 3 months)" className="flex-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> Work Experience</label>
              <button onClick={addExperience} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {experience.map((exp, i) => (
              <div key={i} className="mb-2 space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <input type="text" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Company" className="flex-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <input type="text" value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} placeholder="Role" className="w-32 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <button onClick={() => removeExperience(i)} className="text-gray-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input type="date" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} className="rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                  <input type="date" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} className="rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Brief description" rows={2} className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Save Profile
            </button>
            <button
              onClick={() => { resetForm(); setView('overview'); }}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Unified profile view */}
      {view === 'unified' && activeProfiles.length > 0 && (
        <UnifiedProfileView
          identity={identity}
          profiles={activeProfiles}
          onReset={onReset}
        />
      )}

      {/* Reset button */}
      {view !== 'create' && (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowRight className="h-4 w-4" /> Start new verification
          </button>
        </div>
      )}
    </div>
  );
}

function UnifiedProfileView({
  identity,
  profiles,
  onReset,
}: {
  identity: VerifiedIdentity;
  profiles: UnifiedProfile[];
  onReset: () => void;
}) {
  const merged = mergeProfileData(profiles);
  const skillCount = merged.skills.length;
  const readinessScore = Math.min(100, Math.round(20 + skillCount * 8 + merged.certifications.length * 5 + merged.experience.length * 7 + merged.internships.length * 5));

  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="border-l-4 border-l-brand-400 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Unified Profile</h3>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Combined from {profiles.length} profile{profiles.length > 1 ? 's' : ''} · ID: {identity.skillpulse_id}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Profile Readiness</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{readinessScore}%</span>
          </div>
          <div className="mt-1.5"><ProgressBar value={readinessScore} color={readinessScore >= 70 ? 'emerald' : 'amber'} /></div>
        </div>
      </Card>

      <Card className="p-5">
        <SectionTitle title="Education" icon={<GraduationCap className="h-5 w-5" />} />
        <p className="text-sm text-gray-700 dark:text-gray-300">{merged.education || 'Not specified'}</p>
      </Card>

      <Card className="p-5">
        <SectionTitle title="Skills" subtitle={`${merged.skills.length} skills`} icon={<BookOpen className="h-5 w-5" />} />
        <div className="flex flex-wrap gap-2">
          {merged.skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              <CheckCircle2 className="h-3 w-3" /> {s}
            </span>
          ))}
          {merged.skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet.</p>}
        </div>
      </Card>

      {merged.certifications.length > 0 && (
        <Card className="p-5">
          <SectionTitle title="Certifications" subtitle={`${merged.certifications.length} certifications`} icon={<Award className="h-5 w-5" />} />
          <div className="space-y-2">
            {merged.certifications.map((c, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-gray-500">{c.issuer} {c.date && `· ${c.date}`}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {merged.internships.length > 0 && (
        <Card className="p-5">
          <SectionTitle title="Internships" subtitle={`${merged.internships.length} internships`} icon={<Building2 className="h-5 w-5" />} />
          <div className="space-y-2">
            {merged.internships.map((c, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.role}</p>
                <p className="text-xs text-gray-500">{c.organization} {c.duration && `· ${c.duration}`}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {merged.experience.length > 0 && (
        <Card className="p-5">
          <SectionTitle title="Work Experience" subtitle={`${merged.experience.length} positions`} icon={<Briefcase className="h-5 w-5" />} />
          <div className="space-y-3">
            {merged.experience.map((c, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.role} at {c.company}</p>
                <p className="text-xs text-gray-500">{c.startDate} – {c.endDate || 'Present'}</p>
                {c.description && <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{c.description}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="rounded-lg bg-brand-50 px-4 py-3 dark:bg-brand-900/20">
        <p className="text-xs text-brand-600 dark:text-brand-400">
          This unified profile is used by AI Skill Gap Analysis and job recommendations.
        </p>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <ArrowRight className="h-4 w-4" /> Start new verification
      </button>
    </div>
  );
}
