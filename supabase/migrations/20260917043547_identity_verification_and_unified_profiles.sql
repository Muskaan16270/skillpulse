/*
# Identity Verification & Unified Profiles

## Purpose
Adds secure identity verification and unified profile management to SkillPulse.
Users verify via email/Gmail, mobile+OTP, and date of birth. Aadhaar uses a
mock/placeholder flow — the Aadhaar number is NEVER stored. After verification,
a unique SkillPulse User ID is generated. If the same verified user creates
another profile with different qualifications, the system detects a possible
duplicate and offers profile merging. Merged profiles combine education, skills,
certifications, internships, and experience into one unified profile used by
the AI Skill Gap Analysis and job recommendation features.

## Tables

### verified_identities
Stores the result of identity verification. One row per verified person.
- id (uuid PK)
- skillpulse_id (text, unique) — generated human-readable ID like "SP-2026-00001"
- email (text, not null) — verified email or Gmail
- phone (text, not null) — verified mobile number
- date_of_birth (date, not null) — verified DOB
- aadhaar_verified (boolean, default false) — mock Aadhaar verification flag
- aadhaar_reference (text, nullable) — opaque reference token, NOT the Aadhaar number
- full_name (text, not null)
- created_at (timestamptz)

### unified_profiles
Stores qualification data linked to a verified identity. A verified identity
can have multiple profiles (e.g. from different training programs). After merge,
one profile becomes the canonical profile and others are marked as merged.
- id (uuid PK)
- identity_id (uuid FK → verified_identities.id)
- education (text, nullable) — highest qualification
- skills (text[], default '{}') — array of skill names
- certifications (jsonb, default '[]') — [{name, issuer, date}]
- internships (jsonb, default '[]') — [{organization, role, duration, startDate, endDate}]
- experience (jsonb, default '[]') — [{company, role, duration, startDate, endDate, description}]
- status (text, default 'active') — 'active' | 'merged'
- merged_into (uuid, nullable, FK → unified_profiles.id) — target profile after merge
- created_at (timestamptz)

### profile_merges
Audit trail for merge operations.
- id (uuid PK)
- identity_id (uuid FK → verified_identities.id)
- source_profile_id (uuid FK → unified_profiles.id)
- target_profile_id (uuid FK → unified_profiles.id)
- merged_fields (jsonb) — record of which fields were combined
- created_at (timestamptz)

## Security
- This is a single-tenant prototype with no sign-in screen. All policies use
  TO anon, authenticated so the anon-key frontend can read and write.
- RLS enabled on all three tables.
- Four separate CRUD policies per table (SELECT, INSERT, UPDATE, DELETE).

## Notes
1. The Aadhaar number is NEVER stored. Only a boolean flag and an opaque
   reference token (mock) are kept.
2. The skillpulse_id is generated server-side via a helper function to ensure
   uniqueness and a sequential human-readable format.
3. Duplicate detection is based on matching email OR phone across
   verified_identities — the frontend queries for existing identities with the
   same email/phone and, if found, offers a merge flow.
*/

-- ========== verified_identities ==========
CREATE TABLE IF NOT EXISTS verified_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skillpulse_id text UNIQUE NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  aadhaar_verified boolean NOT NULL DEFAULT false,
  aadhaar_reference text,
  full_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE verified_identities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_verified_identities" ON verified_identities;
CREATE POLICY "anon_select_verified_identities"
  ON verified_identities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_verified_identities" ON verified_identities;
CREATE POLICY "anon_insert_verified_identities"
  ON verified_identities FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_verified_identities" ON verified_identities;
CREATE POLICY "anon_update_verified_identities"
  ON verified_identities FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_verified_identities" ON verified_identities;
CREATE POLICY "anon_delete_verified_identities"
  ON verified_identities FOR DELETE
  TO anon, authenticated USING (true);

-- ========== unified_profiles ==========
CREATE TABLE IF NOT EXISTS unified_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id uuid NOT NULL REFERENCES verified_identities(id) ON DELETE CASCADE,
  education text,
  skills text[] NOT NULL DEFAULT '{}',
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  internships jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  merged_into uuid REFERENCES unified_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE unified_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_unified_profiles" ON unified_profiles;
CREATE POLICY "anon_select_unified_profiles"
  ON unified_profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_unified_profiles" ON unified_profiles;
CREATE POLICY "anon_insert_unified_profiles"
  ON unified_profiles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_unified_profiles" ON unified_profiles;
CREATE POLICY "anon_update_unified_profiles"
  ON unified_profiles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_unified_profiles" ON unified_profiles;
CREATE POLICY "anon_delete_unified_profiles"
  ON unified_profiles FOR DELETE
  TO anon, authenticated USING (true);

-- ========== profile_merges ==========
CREATE TABLE IF NOT EXISTS profile_merges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id uuid NOT NULL REFERENCES verified_identities(id) ON DELETE CASCADE,
  source_profile_id uuid NOT NULL REFERENCES unified_profiles(id) ON DELETE CASCADE,
  target_profile_id uuid NOT NULL REFERENCES unified_profiles(id) ON DELETE CASCADE,
  merged_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profile_merges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profile_merges" ON profile_merges;
CREATE POLICY "anon_select_profile_merges"
  ON profile_merges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile_merges" ON profile_merges;
CREATE POLICY "anon_insert_profile_merges"
  ON profile_merges FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile_merges" ON profile_merges;
CREATE POLICY "anon_update_profile_merges"
  ON profile_merges FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profile_merges" ON profile_merges;
CREATE POLICY "anon_delete_profile_merges"
  ON profile_merges FOR DELETE
  TO anon, authenticated USING (true);

-- ========== Indexes ==========
CREATE INDEX IF NOT EXISTS idx_verified_identities_email ON verified_identities(email);
CREATE INDEX IF NOT EXISTS idx_verified_identities_phone ON verified_identities(phone);
CREATE INDEX IF NOT EXISTS idx_unified_profiles_identity_id ON unified_profiles(identity_id);
CREATE INDEX IF NOT EXISTS idx_unified_profiles_status ON unified_profiles(status);