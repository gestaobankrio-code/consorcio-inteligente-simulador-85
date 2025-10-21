import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  category: 'auto' | 'imovel' | 'caminhao';
  chart_value: number;
  time_to_acquire: number;
  own_resources: number;
  lead_score: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead } = await req.json() as { lead: LeadPayload };

    // Basic validation
    if (!lead || !lead.name || !lead.email || !lead.phone) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clamp time_to_acquire to avoid DB constraint issues
    const time_to_acquire = Math.max(6, Math.min(240, lead.time_to_acquire));

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Insert lead securely using service role
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        category: lead.category,
        chart_value: lead.chart_value,
        time_to_acquire,
        own_resources: lead.own_resources,
        lead_score: lead.lead_score
      })
      .select()
      .single();

    if (error || !data) {
      console.error('submit-lead insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save lead' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Optionally register a form submission interaction
    await supabase
      .from('lead_interactions')
      .insert({ lead_id: data.id, interaction_type: 'form_submit' });

    return new Response(
      JSON.stringify({ lead: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('submit-lead unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
