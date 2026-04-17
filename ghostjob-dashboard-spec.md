# GhostJob Dashboard Technical Specification

**Date:** April 9, 2026  
**Status:** Draft - Ready for Review  
**Author:** Rumi  

---

## Overview

This spec defines the web dashboard architecture for GhostJob, enabling users to save scanned jobs, view historical data, and track application patterns.

**Current State:** Chrome Extension MVP complete with "Save to Dashboard" functionality  
**Goal:** Full dashboard with auth, saved jobs, and analytics

---

## 1. Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Chrome Ext     │────▶│  Supabase        │────▶│  Next.js App    │
│  (Content.js)   │     │  (Auth + DB)     │     │  (Dashboard UI) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   POST /api/save-job    profiles table           /dashboard
   (with user token)     scanned_jobs table       /dashboard/jobs
                         signals table            /dashboard/analytics
```

---

## 2. Database Schema (Supabase)

### 2.1 Profiles Table (extends auth.users)

```sql
create table profiles (
  id uuid references auth.users(id) primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Policy: Users can only read their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Policy: Users can only update their own profile  
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
```

### 2.2 Scanned Jobs Table

```sql
create table scanned_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  
  -- Job Metadata
  job_title text not null,
  company_name text not null,
  company_id text, -- LinkedIn company ID if available
  location text,
  job_url text,
  salary_range text,
  employment_type text, -- full-time, contract, etc.
  
  -- Ghost Score Results
  ghost_score integer not null check (ghost_score >= 0 and ghost_score <= 100),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  summary text, -- "⚡️ Caution Advised" etc.
  
  -- Raw content (for re-analysis)
  job_description text,
  
  -- Timestamps
  scanned_at timestamp with time zone default now(),
  saved_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Soft delete
  is_archived boolean default false
);

-- Enable RLS
alter table scanned_jobs enable row level security;

-- Policy: Users can CRUD their own jobs
create policy "Users can manage own scanned jobs" on scanned_jobs
  for all using (auth.uid() = user_id);

-- Indexes for performance
create index idx_scanned_jobs_user_id on scanned_jobs(user_id);
create index idx_scanned_jobs_scanned_at on scanned_jobs(scanned_at desc);
create index idx_scanned_jobs_ghost_score on scanned_jobs(ghost_score);
```

### 2.3 Signals Table (detailed breakdown)

```sql
create table job_signals (
  id uuid primary key default gen_random_uuid(),
  scanned_job_id uuid references scanned_jobs(id) on delete cascade not null,
  
  -- Signal details
  signal_type text not null check (signal_type in (
    'vague_description',
    'high_experience_requirement',
    'recent_company',
    'reposted_job',
    'salary_transparent',
    'benefits_mentioned',
    'clear_requirements',
    'hiring_manager_contact',
    'generic_company_email',
    'urgent_language'
  )),
  
  signal_category text not null check (signal_category in ('red_flag', 'green_flag', 'neutral')),
  
  -- Raw evidence
  evidence text, -- The text snippet that triggered this signal
  
  -- Impact on score (-20 to +10)
  score_impact integer,
  
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table job_signals enable row level security;

create policy "Users can view signals for their jobs" on job_signals
  for select using (
    scanned_job_id in (
      select id from scanned_jobs where user_id = auth.uid()
    )
  );

-- Indexes
create index idx_job_signals_scanned_job_id on job_signals(scanned_job_id);
create index idx_job_signals_category on job_signals(signal_category);
```

### 2.4 Application Tracking Table (optional v2)

```sql
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  scanned_job_id uuid references scanned_jobs(id),
  
  status text not null check (status in (
    'applied',
    'phone_screen',
    'interview',
    'offer',
    'rejected',
    'ghosted',
    'withdrawn'
  )),
  
  applied_at timestamp with time zone,
  notes text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

## 3. API Endpoints

### 3.1 Authentication

```typescript
// POST /api/auth/signup
// Body: { email, password, full_name? }
// Returns: { user, session }

// POST /api/auth/login  
// Body: { email, password }
// Returns: { user, session }

// POST /api/auth/logout
// Returns: { success: true }

// GET /api/auth/user
// Returns: { user, profile }
```

### 3.2 Jobs API

```typescript
// POST /api/jobs/save
// Auth: Required (Bearer token)
// Body: {
//   job_title: string,
//   company_name: string,
//   location?: string,
//   job_url: string,
//   salary_range?: string,
//   employment_type?: string,
//   job_description?: string,
//   ghost_score: number,
//   risk_level: 'low' | 'medium' | 'high',
//   summary: string,
//   signals: Array<{
//     signal_type: string,
//     signal_category: 'red_flag' | 'green_flag' | 'neutral',
//     evidence?: string,
//     score_impact: number
//   }>
// }
// Returns: { id, saved_at }

// GET /api/jobs
// Auth: Required
// Query: {
//   page?: number,
//   limit?: number (default: 20, max: 100),
//   sort_by?: 'saved_at' | 'ghost_score' | 'company_name',
//   sort_order?: 'asc' | 'desc',
//   risk_level?: 'low' | 'medium' | 'high',
//   archived?: boolean (default: false)
// }
// Returns: {
//   jobs: Array<JobWithSignals>,
//   pagination: { page, limit, total, total_pages }
// }

// GET /api/jobs/:id
// Auth: Required
// Returns: { job: JobWithSignals }

// PATCH /api/jobs/:id
// Auth: Required
// Body: { is_archived?: boolean, notes?: string }
// Returns: { job }

// DELETE /api/jobs/:id
// Auth: Required
// Returns: { success: true }
```

### 3.3 Analytics API

```typescript
// GET /api/analytics/overview
// Auth: Required
// Returns: {
//   total_jobs_scanned: number,
//   avg_ghost_score: number,
//   risk_distribution: {
//     low: number,
//     medium: number,
//     high: number
//   },
//   top_red_flags: Array<{ signal_type: string, count: number }>,
//   top_green_flags: Array<{ signal_type: string, count: number }>,
//   companies_scanned: number
// }

// GET /api/analytics/trends
// Auth: Required
// Query: { days?: number (default: 30) }
// Returns: {
//   daily: Array<{
//     date: string,
//     jobs_scanned: number,
//     avg_ghost_score: number
//   }>,
//   companies: Array<{
//     company_name: string,
//     jobs_scanned: number,
//     avg_ghost_score: number
//   }>
// }
```

---

## 4. Chrome Extension Integration

### 4.1 Auth Flow

```typescript
// When user clicks "Save to Dashboard"
// 1. Check if user has auth token in chrome.storage.local
// 2. If no token → Open dashboard in new tab to /auth/login
// 3. After login → Dashboard redirects back to extension with token
// 4. Extension stores token and retries save

// Token storage
chrome.storage.local.set({
  'ghostjob_token': session.access_token,
  'ghostjob_user': user.id,
  'ghostjob_expires': session.expires_at
});
```

### 4.2 Save Job Flow

```typescript
// content.js → background.js → Supabase

// In background.js:
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveJob') {
    chrome.storage.local.get(['ghostjob_token'], async (result) => {
      const response = await fetch('https://api.jobghost.io/api/jobs/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${result.ghostjob_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request.jobData)
      });
      const data = await response.json();
      sendResponse(data);
    });
    return true; // Keep channel open for async
  }
});
```

---

## 5. Dashboard UI Routes

```typescript
// /dashboard                    → Overview with stats + recent jobs
// /dashboard/jobs               → List view with filters + search
// /dashboard/jobs/:id           → Job detail view with full signal breakdown
// /dashboard/analytics          → Trends, charts, insights
// /dashboard/settings           → Account, preferences, data export
// /auth/login                   → Login page
// /auth/signup                  → Signup page
// /auth/callback                → OAuth/redirect handler
```

---

## 6. Component Requirements

### 6.1 Dashboard Components

| Component | Props | Description |
|-----------|-------|-------------|
| `GhostScoreCard` | `score: number, size: 'sm' \| 'md' \| 'lg'` | Circular score display with color coding |
| `JobListItem` | `job: JobSummary` | Row showing job title, company, score, saved date |
| `SignalBadge` | `type: SignalType, category: SignalCategory` | Icon + label for red/green flags |
| `RiskDistributionChart` | `data: RiskData[]` | Pie/bar chart of low/medium/high risk jobs |
| `TrendsLineChart` | `data: TrendData[]` | Line chart of scores over time |
| `EmptyState` | `type: 'no-jobs' \| 'no-results'` | Illustration + CTA when no data |
| `JobDetailModal` | `job: JobWithSignals, isOpen, onClose` | Full job view with signal breakdown |

### 6.2 Data Types

```typescript
interface JobSummary {
  id: string;
  job_title: string;
  company_name: string;
  location?: string;
  ghost_score: number;
  risk_level: 'low' | 'medium' | 'high';
  summary: string;
  saved_at: string;
  is_archived: boolean;
}

interface JobWithSignals extends JobSummary {
  job_url: string;
  salary_range?: string;
  employment_type?: string;
  job_description?: string;
  scanned_at: string;
  signals: Signal[];
}

interface Signal {
  id: string;
  signal_type: string;
  signal_category: 'red_flag' | 'green_flag' | 'neutral';
  evidence?: string;
  score_impact: number;
}

type SignalType = 
  | 'vague_description'
  | 'high_experience_requirement'
  | 'recent_company'
  | 'reposted_job'
  | 'salary_transparent'
  | 'benefits_mentioned'
  | 'clear_requirements'
  | 'hiring_manager_contact'
  | 'generic_company_email'
  | 'urgent_language';
```

---

## 7. Implementation Phases

### Phase 1: Auth + Basic Dashboard (MVP)
- [ ] Supabase project setup
- [ ] Database schema migration
- [ ] Auth pages (login/signup)
- [ ] /dashboard overview with empty state
- [ ] API routes for jobs CRUD
- [ ] Extension auth integration

**Est:** 1-2 days

### Phase 2: Job Management
- [ ] Job list view with pagination
- [ ] Job detail view
- [ ] Archive/restore functionality
- [ ] Search and filters

**Est:** 1-2 days

### Phase 3: Analytics
- [ ] Overview stats cards
- [ ] Risk distribution chart
- [ ] Trends over time
- [ ] Company breakdown

**Est:** 1-2 days

### Phase 4: Polish
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Data export (CSV)

**Est:** 1 day

**Total Est:** 4-7 days of focused work

---

## 8. Security Considerations

- All API routes require authentication
- RLS policies enforce user data isolation
- Extension token stored in chrome.storage.local (encrypted by browser)
- Job descriptions truncated in API responses if very large
- Rate limiting on save endpoint (prevent abuse)

---

## 9. Open Questions

1. **Pricing/Free Tier:** Do we limit free users to X saved jobs?
2. **Data Retention:** How long keep archived jobs?
3. **Export:** CSV export format requirements?
4. **Email Notifications:** Weekly digest of high-risk jobs?

---

## Next Steps

1. Review this spec
2. Set up Supabase project
3. Run schema migrations
4. Build Phase 1 (Auth + Basic Dashboard)
5. Update extension to integrate with dashboard API

---

*Ready for review. Let me know what needs adjustment!*
