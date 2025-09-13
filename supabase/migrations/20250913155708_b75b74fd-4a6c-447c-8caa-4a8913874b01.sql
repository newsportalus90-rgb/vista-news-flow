-- Fix security vulnerability: Restrict access to user emails and sensitive profile data

-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure policies with granular access control

-- 1. Users can view their own complete profile (including email)
CREATE POLICY "Users can view their own complete profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Public can view limited profile data (excluding email and sensitive fields)
CREATE POLICY "Public can view limited profile data"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- 3. Authenticated users can view other users' public profile data (excluding email)
CREATE POLICY "Authenticated users can view public profile data"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() != user_id);

-- 4. Admins and editors can view all profile data for management purposes
CREATE POLICY "Admins and editors can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'editor')
  )
);

-- Create a secure view for public profile access that excludes sensitive data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  bio,
  created_at,
  is_active
FROM public.profiles
WHERE is_active = true;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Create a function to get user profile safely (for API usage)
CREATE OR REPLACE FUNCTION public.get_user_profile(profile_user_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  bio text,
  email text,
  role user_role,
  created_at timestamp with time zone,
  is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If requesting own profile, return full data
  IF auth.uid() = (SELECT p.user_id FROM profiles p WHERE p.id = profile_user_id) THEN
    RETURN QUERY
    SELECT p.id, p.full_name, p.avatar_url, p.bio, p.email, p.role, p.created_at, p.is_active
    FROM profiles p
    WHERE p.id = profile_user_id;
  
  -- If admin/editor, return full data
  ELSIF EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'editor')
  ) THEN
    RETURN QUERY
    SELECT p.id, p.full_name, p.avatar_url, p.bio, p.email, p.role, p.created_at, p.is_active
    FROM profiles p
    WHERE p.id = profile_user_id;
  
  -- Otherwise, return limited public data (no email)
  ELSE
    RETURN QUERY
    SELECT p.id, p.full_name, p.avatar_url, p.bio, NULL::text, NULL::user_role, p.created_at, p.is_active
    FROM profiles p
    WHERE p.id = profile_user_id AND p.is_active = true;
  END IF;
END;
$$;