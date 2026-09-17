export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Internship {
  organization: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface VerifiedIdentity {
  id: string;
  skillpulse_id: string;
  email: string;
  phone: string;
  date_of_birth: string;
  aadhaar_verified: boolean;
  aadhaar_reference: string | null;
  full_name: string;
  created_at: string;
}

export interface UnifiedProfile {
  id: string;
  identity_id: string;
  education: string | null;
  skills: string[];
  certifications: Certification[];
  internships: Internship[];
  experience: ExperienceEntry[];
  status: 'active' | 'merged';
  merged_into: string | null;
  created_at: string;
}

export interface ProfileMerge {
  id: string;
  identity_id: string;
  source_profile_id: string;
  target_profile_id: string;
  merged_fields: Record<string, unknown>;
  created_at: string;
}

export interface MergedProfileData {
  skills: string[];
  certifications: Certification[];
  internships: Internship[];
  experience: ExperienceEntry[];
  education: string | null;
}

export function generateSkillPulseId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `SP-${year}-${random}`;
}

export function mergeProfileData(profiles: UnifiedProfile[]): MergedProfileData {
  const skills = new Set<string>();
  const certifications: Certification[] = [];
  const internships: Internship[] = [];
  const experience: ExperienceEntry[] = [];
  let education: string | null = null;

  for (const profile of profiles) {
    for (const skill of profile.skills) {
      skills.add(skill);
    }
    for (const cert of profile.certifications) {
      if (!certifications.some((c) => c.name === cert.name && c.issuer === cert.issuer)) {
        certifications.push(cert);
      }
    }
    for (const internship of profile.internships) {
      if (!internships.some((i) => i.organization === internship.organization && i.role === internship.role)) {
        internships.push(internship);
      }
    }
    for (const exp of profile.experience) {
      if (!experience.some((e) => e.company === exp.company && e.role === exp.role)) {
        experience.push(exp);
      }
    }
    if (profile.education && !education) {
      education = profile.education;
    }
  }

  return {
    skills: Array.from(skills),
    certifications,
    internships,
    experience,
    education,
  };
}
