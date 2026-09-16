import {
  BrainCircuit, AlertTriangle, TrendingUp, Lightbulb,
  CheckCircle2, XCircle, Sparkles, BookOpen, Info,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { Card, SectionTitle, Badge, ProgressBar } from '@/components/ui';
import { skillGapData, skillsVsDemand } from '@/data/mockData';

const radarData = skillsVsDemand.map((s) => ({
  skill: s.skill,
  Training: s.training,
  Demand: s.demand,
}));

export function SkillGapAI() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skill Gap AI</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Comparing skills taught vs skills demanded by the job market</p>
      </div>

      {/* Provenance */}
      <div className="flex items-center gap-2">
        <Badge color="amber">SYNTHETIC DEMO</Badge>
        <Badge color="gray">SIMULATED</Badge>
        <span className="text-xs text-gray-400">Job demand data is simulated for prototype</span>
      </div>

      {/* AI confidence banner */}
      <Card className="border-l-4 border-l-brand-400 p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <BrainCircuit className="h-6 w-6 shrink-0 text-brand-500" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Analysis</h3>
              <Badge color="brand">Confidence: {skillGapData.aiConfidence}%</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{skillGapData.aiExplanation}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">Skill Alignment:</span>
              <div className="w-32"><ProgressBar value={skillGapData.alignmentPercentage} color={skillGapData.alignmentPercentage > 70 ? 'emerald' : 'amber'} /></div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{skillGapData.alignmentPercentage}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Insufficient evidence note */}
      <Card className="border-l-4 border-l-amber-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">Insufficient Evidence (Partial)</p>
            <p className="text-gray-500 dark:text-gray-400">{skillGapData.insufficientEvidenceNote}</p>
          </div>
        </div>
      </Card>

      {/* Gap comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Skills Taught vs Market Demand" icon={<TrendingUp className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsVsDemand} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="skill" stroke="#9ca3af" fontSize={10} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#9ca3af" fontSize={12} unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="training" fill="#3380fc" radius={[4, 4, 0, 0]} name="Training %" />
              <Bar dataKey="demand" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Demand %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Skill Coverage Radar" icon={<BrainCircuit className="h-5 w-5" />} />
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" className="dark:opacity-20" />
              <PolarAngleAxis dataKey="skill" stroke="#9ca3af" fontSize={10} />
              <PolarRadiusAxis stroke="#9ca3af" fontSize={10} angle={90} />
              <Radar name="Training" dataKey="Training" stroke="#3380fc" fill="#3380fc" fillOpacity={0.3} />
              <Radar name="Demand" dataKey="Demand" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Matching skills */}
      <Card className="p-5">
        <SectionTitle title="Matching Skills" subtitle="Skills where training meets market demand" icon={<CheckCircle2 className="h-5 w-5" />} />
        <div className="space-y-3">
          {skillGapData.matchingSkills.map((skill) => (
            <div key={skill.skill} className="rounded-lg border border-emerald-200 p-3 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{skill.skill}</span>
                </div>
                <Badge color="emerald" size="sm">{skill.alignment}% aligned</Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Training Coverage</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={skill.trainingLevel} color="brand" />
                    <span className="text-sm font-medium">{skill.trainingLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Market Demand</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={skill.demandLevel} color="accent" />
                    <span className="text-sm font-medium">{skill.demandLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Missing skills */}
      <Card className="p-5">
        <SectionTitle title="Missing Skills (Critical Gaps)" subtitle="High demand but low training coverage" icon={<AlertTriangle className="h-5 w-5" />} />
        <div className="space-y-4">
          {skillGapData.missingSkills.map((gap) => (
            <div key={gap.skill} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{gap.skill}</span>
                </div>
                <Badge color={gap.severity === 'Critical' ? 'rose' : gap.severity === 'High' ? 'amber' : 'gray'}>
                  {gap.severity}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Training Coverage</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={gap.trainingLevel} color="rose" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{gap.trainingLevel}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Market Demand</p>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar value={gap.demandLevel} color="brand" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{gap.demandLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emerging skills */}
      <Card className="p-5">
        <SectionTitle title="Emerging Skills" subtitle="Growing demand not yet in curricula" icon={<Sparkles className="h-5 w-5" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {skillGapData.emergingSkills.map((skill) => (
            <div key={skill.skill} className="rounded-lg bg-gradient-to-br from-brand-50 to-accent-50 p-4 dark:from-brand-900/20 dark:to-accent-900/20">
              <p className="font-medium text-gray-900 dark:text-white">{skill.skill}</p>
              <p className="text-xs text-gray-500">{skill.trend}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Relevance:</span>
                <ProgressBar value={skill.relevance} color="accent" />
                <span className="text-xs font-medium">{skill.relevance}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations with explanations */}
      <Card className="p-5">
        <SectionTitle title="AI Recommended Upskilling" subtitle="Each recommendation includes an explanation" icon={<Lightbulb className="h-5 w-5" />} />
        <div className="space-y-4">
          {skillGapData.recommendationExplanations.map((rec, i) => (
            <div key={i} className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.recommendation}</p>
                  <div className="mt-2 rounded-md bg-white/60 px-3 py-2 dark:bg-gray-900/40">
                    <p className="text-xs font-semibold text-brand-600 uppercase">Why?</p>
                    <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{rec.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Curriculum suggestions */}
      <Card className="p-5">
        <SectionTitle title="Curriculum Suggestions" icon={<BookOpen className="h-5 w-5" />} />
        <div className="space-y-3">
          {skillGapData.curriculumSuggestions.map((sug, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-accent-50 px-3 py-3 dark:bg-accent-900/20">
              <BookOpen className="h-5 w-5 shrink-0 text-accent-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{sug}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Example */}
      <Card className="p-5 border-l-4 border-l-accent-400">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Example Analysis</h3>
        <div className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <p className="text-xs font-medium text-emerald-600 uppercase">Training</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Python, ML, SQL</p>
          </div>
          <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-900/20">
            <p className="text-xs font-medium text-brand-600 uppercase">Market Demand</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Python, ML, SQL, Cloud, Power BI</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
            <p className="text-xs font-medium text-rose-600 uppercase">Gap</p>
            <p className="mt-1 text-gray-700 dark:text-gray-300">Cloud + Power BI</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
