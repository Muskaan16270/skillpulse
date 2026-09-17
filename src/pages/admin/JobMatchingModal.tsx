import { useState, useMemo } from 'react';
import {
  Briefcase, MapPin, IndianRupee, CheckCircle2, XCircle,
  TrendingUp, Sparkles, X, Info, Award, GraduationCap,
  Building2, Clock, Filter,
} from 'lucide-react';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { trainees, jobListings, calculateJobMatch, calculateJobMatchFromSkills, type JobMatchResult } from '@/data/mockData';

interface JobMatchingModalProps {
  open: boolean;
  onClose: () => void;
  traineeId: string;
  unifiedSkills?: string[];
  unifiedProfileName?: string;
}

export function JobMatchingModal({ open, onClose, traineeId, unifiedSkills, unifiedProfileName }: JobMatchingModalProps) {
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'location'>('match');
  const [locationFilter, setLocationFilter] = useState<string>('All');

  const trainee = useMemo(
    () => trainees.find((t) => t.id === traineeId) || trainees[0],
    [traineeId]
  );

  const useUnified = unifiedSkills !== undefined && unifiedSkills.length > 0;

  const allMatches = useMemo(() => {
    const matches = useUnified
      ? jobListings.map((job) => calculateJobMatchFromSkills(unifiedSkills!, job))
      : jobListings.map((job) => calculateJobMatch(traineeId, job));
    return matches.sort((a, b) => {
        if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
        if (sortBy === 'salary') {
          const aMax = parseInt(a.job.salaryRange.replace(/[^0-9]/g, '').slice(-5));
          const bMax = parseInt(b.job.salaryRange.replace(/[^0-9]/g, '').slice(-5));
          return bMax - aMax;
        }
        return a.job.location.localeCompare(b.job.location);
      });
  }, [traineeId, sortBy, useUnified, unifiedSkills]);

  const locations = useMemo(() => {
    const locs = new Set(jobListings.map((j) => j.location));
    return ['All', ...Array.from(locs).sort()];
  }, []);

  const filteredMatches = useMemo(() => {
    if (locationFilter === 'All') return allMatches;
    return allMatches.filter((m) => m.job.location === locationFilter);
  }, [allMatches, locationFilter]);

  if (!open) return null;

  const bestMatch = allMatches[0]?.matchPercentage || 0;
  const avgMatch = allMatches.length > 0
    ? Math.round(allMatches.reduce((sum, m) => sum + m.matchPercentage, 0) / allMatches.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <Card className="my-8 w-full max-w-4xl overflow-hidden" >
        <div onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 p-5 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI-Assisted Job Matching</h3>
                <Badge color="amber" size="sm">DEMO</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Showing matching jobs for <span className="font-medium text-gray-700 dark:text-gray-300">{useUnified ? (unifiedProfileName || 'Unified Profile') : trainee.name}</span> based on {useUnified ? 'unified profile skills' : 'skills, qualification, training, and location'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Trainee profile summary */}
          <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-brand-500" />
                <div>
                  <p className="text-xs text-gray-400">Skills</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{(useUnified ? unifiedSkills! : trainee.skills).length} skills</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brand-500" />
                <div>
                  <p className="text-xs text-gray-400">Qualification</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{useUnified ? 'Unified Profile' : trainee.education}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-brand-500" />
                <div>
                  <p className="text-xs text-gray-400">{useUnified ? 'Source' : 'Training'}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{useUnified ? 'Verified Identity' : trainee.courseName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-500" />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{useUnified ? 'All' : trainee.district}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(useUnified ? unifiedSkills! : trainee.skills).map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                  <CheckCircle2 className="h-3 w-3" /> {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 p-4">
            <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
              <p className="text-xs text-gray-500">Best Match</p>
              <p className="mt-0.5 text-xl font-bold text-emerald-600 dark:text-emerald-400">{bestMatch}%</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-3 text-center dark:bg-brand-900/20">
              <p className="text-xs text-gray-500">Avg Match</p>
              <p className="mt-0.5 text-xl font-bold text-brand-600 dark:text-brand-400">{avgMatch}%</p>
            </div>
            <div className="rounded-lg bg-accent-50 p-3 text-center dark:bg-accent-900/20">
              <p className="text-xs text-gray-500">Jobs Found</p>
              <p className="mt-0.5 text-xl font-bold text-accent-600 dark:text-accent-400">{filteredMatches.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-4 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Sort by:</span>
              <div className="flex gap-1">
                {(['match', 'salary', 'location'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                      sortBy === s
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job cards */}
          <div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
            {filteredMatches.map((match) => (
              <JobCard key={match.job.id} match={match} traineeDistrict={trainee.district} />
            ))}
            {filteredMatches.length === 0 && (
              <div className="py-8 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-sm text-gray-400">No jobs found for this location filter.</p>
              </div>
            )}
          </div>

          {/* AI disclaimer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 dark:bg-amber-900/20">
              <Info className="h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                AI / DEMO RECOMMENDATION — These job listings are synthetic and generated for demonstration purposes only. Match percentages are based on simulated skill data and do not guarantee employment, interview calls, or job offers. Actual job availability and requirements may vary.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function JobCard({ match, traineeDistrict }: { match: JobMatchResult; traineeDistrict: string }) {
  const { job, matchingSkills, missingSkills, matchPercentage, locationMatch, trainingMatch } = match;

  const matchColor = matchPercentage >= 75 ? 'emerald' : matchPercentage >= 50 ? 'amber' : 'rose';
  const matchBg = matchPercentage >= 75
    ? 'border-l-emerald-400'
    : matchPercentage >= 50
    ? 'border-l-amber-400'
    : 'border-l-rose-400';

  return (
    <div className={`rounded-xl border border-gray-200 border-l-4 p-4 dark:border-gray-700 ${matchBg}`}>
      {/* Top row: title + match percentage */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-gray-900 dark:text-white">{job.title}</h4>
            <Badge color="brand" size="sm">{job.jobType}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {job.employer}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}{locationMatch && job.location === traineeDistrict && <span className="text-emerald-500"> (Your district)</span>}</span>
            <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" /> {job.salaryRange}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Posted {job.postedDate}</span>
          </div>
        </div>
        {/* Match percentage circle */}
        <div className="ml-3 flex flex-col items-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
            matchPercentage >= 75 ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : matchPercentage >= 50 ? 'bg-amber-100 dark:bg-amber-900/30'
            : 'bg-rose-100 dark:bg-rose-900/30'
          }`}>
            <span className={`text-lg font-bold ${
              matchPercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400'
              : matchPercentage >= 50 ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-600 dark:text-rose-400'
            }`}>{matchPercentage}%</span>
          </div>
          <span className="mt-1 text-xs text-gray-400">Match</span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{job.description}</p>

      {/* Match details */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Matching skills */}
        <div className="rounded-lg bg-emerald-50/50 p-3 dark:bg-emerald-900/10">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Matching Skills ({matchingSkills.length})</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {matchingSkills.length > 0 ? matchingSkills.map((s) => (
              <span key={s.skill} className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> {s.skill}
              </span>
            )) : (
              <span className="text-xs text-gray-400">No matching skills</span>
            )}
          </div>
          {matchingSkills.length > 0 && (
            <div className="mt-2">
              <ProgressBar value={matchPercentage} color={matchColor as 'emerald' | 'amber' | 'rose'} />
            </div>
          )}
        </div>

        {/* Missing skills */}
        <div className="rounded-lg bg-rose-50/50 p-3 dark:bg-rose-900/10">
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Missing Skills ({missingSkills.length})</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {missingSkills.length > 0 ? missingSkills.map((s) => (
              <span key={s.skill} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                s.importance === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                : s.importance === 'Important' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'
              }`}>
                <XCircle className="h-3 w-3" /> {s.skill} · {s.importance}
              </span>
            )) : (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">All required skills matched!</span>
            )}
          </div>
        </div>
      </div>

      {/* Eligibility indicators */}
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">Qualification:</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{job.qualification}</span>
        </div>
        {trainingMatch && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Training matches
          </span>
        )}
        {job.location === traineeDistrict && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <MapPin className="h-3 w-3" /> Same district
          </span>
        )}
      </div>
    </div>
  );
}
