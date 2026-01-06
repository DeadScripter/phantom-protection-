import { serve } from 'https://deno.land/std@0.200.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { CORS } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_KEY')!
)

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const { script_id, discord_id, roblox_id, expires } = await req.json()
  if (!script_id || !discord_id || !roblox_id) {
    return new Response('missing body', { status: 400, headers: CORS })
  }

  let expiresAt = null
  if (expires !== 'unlimited') {
    const ms = { h: 3600*1000, d: 86400*1000, m: 30*86400*1000 }[expires as 'h'|'d'|'m'] || 0
    expiresAt = ms ? new Date(Date.now() + ms).toISOString() : null
  }

  const { error } = await supabase
    .from('whitelist')
    .insert({ script_id, discord_id, roblox_id, expires_at: expiresAt })

  if (error) return new Response(error.message, { status: 500, headers: CORS })
  return new Response('ok', { headers: CORS })
})
