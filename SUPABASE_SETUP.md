# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

## 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Database Setup

Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor.

## 4. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a bucket called `uploads`
3. Set it to public

## 5. Authentication Setup

1. Go to Authentication > Settings
2. Configure your site URL
3. Add your domain to allowed origins

## 6. Row Level Security

The schema includes RLS policies for security.
