import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScoreRequest {
  chartValue: number;
  ownResources: number;
  timeToAcquire: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chartValue, ownResources, timeToAcquire } = await req.json() as ScoreRequest;
    
    // Validate input
    if (chartValue <= 0 || ownResources < 0 || timeToAcquire < 6) {
      return new Response(
        JSON.stringify({ error: 'Invalid input values' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get lead scoring configuration from database (server-side)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: configData, error: configError } = await supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'lead_scoring')
      .single();

    if (configError || !configData) {
      console.error('Error fetching lead scoring config:', configError);
      return new Response(
        JSON.stringify({ error: 'Lead scoring not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const leadScoring = configData.value as {
      chartValue: {
        min: number;
        mid: number;
        low: number;
        high: number;
        medium: number;
        low_score: number;
      };
      resources: {
        high: number;
        medium: number;
        high_score: number;
        medium_score: number;
      };
      timeToAcquire: {
        fast: number;
        medium: number;
        fast_score: number;
        medium_score: number;
      };
    };

    // Calculate score server-side (secure from manipulation)
    let score = 0;
    
    if (chartValue >= leadScoring.chartValue.min) {
      score += leadScoring.chartValue.high;
    } else if (chartValue >= leadScoring.chartValue.mid) {
      score += leadScoring.chartValue.medium;
    } else if (chartValue >= leadScoring.chartValue.low) {
      score += leadScoring.chartValue.low_score;
    }
    
    const resourcePercentage = (ownResources / chartValue) * 100;
    if (resourcePercentage >= leadScoring.resources.high) {
      score += leadScoring.resources.high_score;
    } else if (resourcePercentage >= leadScoring.resources.medium) {
      score += leadScoring.resources.medium_score;
    }
    
    if (timeToAcquire <= leadScoring.timeToAcquire.fast) {
      score += leadScoring.timeToAcquire.fast_score;
    } else if (timeToAcquire <= leadScoring.timeToAcquire.medium) {
      score += leadScoring.timeToAcquire.medium_score;
    }

    return new Response(
      JSON.stringify({ score }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in calculate-lead-score function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
