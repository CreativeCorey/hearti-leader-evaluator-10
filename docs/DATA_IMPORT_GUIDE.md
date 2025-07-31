# Historical Data Import Guide

There are several ways to add historical user and assessment data to the database:

## Option 1: Using the Data Import Interface (Recommended)

I've created a React component (`src/components/admin/DataImporter.tsx`) that provides a user-friendly interface for importing JSON data. To use it:

1. Add the component to your admin dashboard or create a dedicated import page
2. Use the "Download Template" button to get the correct JSON format
3. Prepare your data in the required JSON format
4. Paste the data and click "Import Data"

## Option 2: Direct SQL Inserts

You can insert data directly using SQL commands in the Supabase SQL editor:

### Import Users (Profiles)
```sql
INSERT INTO profiles (id, email, name, role, organization_id, created_at, updated_at)
VALUES 
  ('user-id-1', 'user1@example.com', 'User One', 'user', null, now(), now()),
  ('user-id-2', 'admin@example.com', 'Admin User', 'admin', 'org-id', now(), now());
```

### Import Assessments
```sql
INSERT INTO assessments (
  id, user_id, organization_id, date, answers, dimension_scores, 
  overall_score, demographics, email
)
VALUES (
  'assessment-id-1',
  'user-id-1', 
  null,
  '2024-01-01T00:00:00.000Z',
  '[]'::jsonb,
  '{"humility": 85, "empathy": 90, "accountability": 78, "resiliency": 82, "transparency": 88, "inclusivity": 91}'::jsonb,
  85.7,
  '{"managementLevel": "middle", "companySize": "100-500", "jobRole": "manager"}'::jsonb,
  'user1@example.com'
);
```

## Option 3: CSV Import via Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to the Table Editor
3. Select the table (profiles or assessments)
4. Use the "Insert" → "Import data via CSV" option

## Option 4: Programmatic Import

Use the `bulkImportData` function I created:

```typescript
import { bulkImportData } from '@/utils/bulkImport';

const data = {
  users: [
    {
      id: 'user-uuid',
      email: 'user@example.com',
      name: 'User Name',
      role: 'user'
    }
  ],
  assessments: [
    {
      id: 'assessment-uuid',
      userId: 'user-uuid',
      date: new Date().toISOString(),
      answers: [],
      dimensionScores: { /* scores */ },
      overallScore: 85.7
    }
  ]
};

const result = await bulkImportData(data);
```

## Data Format Requirements

### Users (Profiles)
- `id`: UUID (required)
- `email`: String (required)
- `name`: String (optional)
- `role`: 'user' | 'admin' (defaults to 'user')
- `organizationId`: UUID (optional)
- `createdAt`: ISO date string (optional)

### Assessments
- `id`: UUID (required)
- `userId`: UUID (required, must match existing user)
- `date`: ISO date string (required)
- `answers`: Array of answer objects (required)
- `dimensionScores`: Object with dimension scores (required)
- `overallScore`: Number (required)
- `demographics`: Object (optional)
- `organizationId`: UUID (optional)

## Important Notes

1. **User IDs must exist first**: Import users before importing their assessments
2. **UUID Format**: All IDs must be valid UUIDs
3. **Email is required**: The email field is required for assessments
4. **Data Validation**: The import functions include basic validation
5. **Backup**: Always backup your database before bulk imports

Choose the method that best fits your data source and technical comfort level.