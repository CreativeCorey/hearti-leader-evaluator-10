import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ImportAssessment {
  user_email: string;
  user_name?: string;
  organization_name?: string;
  assessment_date: string;
  answers: Record<string, any>;
  dimension_scores: Record<string, number>;
  overall_score: number;
  demographics?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user is an admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    const { assessments }: { assessments: ImportAssessment[] } = await req.json()

    if (!Array.isArray(assessments) || assessments.length === 0) {
      throw new Error('Invalid assessments data')
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each assessment
    for (const assessment of assessments) {
      try {
        // Validate required fields
        if (!assessment.user_email || !assessment.assessment_date || !assessment.answers) {
          results.failed++
          results.errors.push(`Missing required fields for ${assessment.user_email}`)
          continue
        }

        // Find or create organization
        let organizationId = null
        if (assessment.organization_name) {
          const { data: existingOrg } = await supabaseClient
            .from('organizations')
            .select('id')
            .eq('name', assessment.organization_name.trim())
            .single()

          if (existingOrg) {
            organizationId = existingOrg.id
          } else {
            const { data: newOrg, error: orgError } = await supabaseClient
              .from('organizations')
              .insert({
                name: assessment.organization_name.trim(),
                description: `Auto-created during bulk import`
              })
              .select('id')
              .single()

            if (!orgError && newOrg) {
              organizationId = newOrg.id
            }
          }
        }

        // Find or create user profile
        let userId = null
        const { data: existingUser } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('email', assessment.user_email.toLowerCase().trim())
          .single()

        if (existingUser) {
          userId = existingUser.id
        } else {
          // Create a new user profile with a generated UUID
          const { data: newUser, error: userError } = await supabaseClient
            .from('profiles')
            .insert({
              email: assessment.user_email.toLowerCase().trim(),
              name: assessment.user_name || null,
              organization_id: organizationId,
              role: 'user'
            })
            .select('id')
            .single()

          if (userError) {
            results.failed++
            results.errors.push(`Failed to create user ${assessment.user_email}: ${userError.message}`)
            continue
          }

          userId = newUser.id
        }

        // Insert assessment
        const { error: assessmentError } = await supabaseClient
          .from('assessments')
          .insert({
            user_id: userId,
            email: assessment.user_email.toLowerCase().trim(),
            organization_id: organizationId,
            date: assessment.assessment_date,
            answers: assessment.answers,
            dimension_scores: assessment.dimension_scores,
            overall_score: assessment.overall_score,
            demographics: assessment.demographics || null
          })

        if (assessmentError) {
          results.failed++
          results.errors.push(`Failed to insert assessment for ${assessment.user_email}: ${assessmentError.message}`)
          continue
        }

        results.successful++

      } catch (error) {
        results.failed++
        results.errors.push(`Error processing ${assessment.user_email}: ${error.message}`)
      }
    }

    // Log the import activity
    await supabaseClient
      .from('data_access_logs')
      .insert({
        user_id: user.id,
        action: 'bulk_import',
        details: {
          total_assessments: assessments.length,
          successful: results.successful,
          failed: results.failed
        }
      })
      .catch(() => {}) // Don't fail the import if logging fails

    return new Response(
      JSON.stringify(results),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Bulk import error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        successful: 0,
        failed: 0,
        errors: [error.message || 'Internal server error']
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})