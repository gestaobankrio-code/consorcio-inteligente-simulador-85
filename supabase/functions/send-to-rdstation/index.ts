import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  name: string;
  email: string;
  phone: string;
  category: string;
  chartValue: number;
  ownResources: number;
  timeToAcquire: number;
  leadScore: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadData } = await req.json() as { leadData: LeadData };
    
    // Validate input
    if (!leadData?.email || !leadData?.name || !leadData?.phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get RD Station configuration from database (server-side)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: configData, error: configError } = await supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'rdstation_config')
      .single();

    if (configError || !configData) {
      console.error('Error fetching RD Station config:', configError);
      return new Response(
        JSON.stringify({ error: 'RD Station not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const rdConfig = configData.value as { token: string; conversionIdentifier: string };

    // Send conversion to RD Station API (server-side with secure token)
    const rdResponse = await fetch('https://api.rd.services/platform/conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rdConfig.token}`
      },
      body: JSON.stringify({
        event_type: 'CONVERSION',
        event_family: 'CDP',
        payload: {
          conversion_identifier: rdConfig.conversionIdentifier,
          email: leadData.email,
          name: leadData.name,
          mobile_phone: leadData.phone,
          cf_categoria: leadData.category,
          cf_valor_carta: leadData.chartValue,
          cf_recursos_proprios: leadData.ownResources,
          cf_prazo: leadData.timeToAcquire,
          cf_lead_score: leadData.leadScore
        }
      })
    });

    if (!rdResponse.ok) {
      const errorText = await rdResponse.text();
      console.error('RD Station API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send to RD Station' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-to-rdstation function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
