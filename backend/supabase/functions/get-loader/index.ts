import { serve } from 'https://deno.land/std@0.200.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import * as crypto from '../_shared/crypto.ts'
import { CORS } from '../_shared/cors.ts'
import { isPublicGame } from '../_shared/rbxVerify.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_KEY')!
)

const JWT_SECRET = Deno.env.get('JWT_SECRET')!

// anti-bypass block (embedded in every loader)
const ANTI_BYPASS = `
local player = game:GetService("Players").LocalPlayer
if not player then player = game:GetService("Players").PlayerAdded:Wait() end
local ok,PartName = pcall(function() return Instance.new("Part").Name end)
if not ok or PartName ~= "Part" then warn("nice try buddy gl next time") return end
local hb = game:GetService("RunService").Heartbeat:Wait()
if type(hb) ~= "number" or hb <= 0 then warn("nice try buddy gl next time") return end
local f = Instance.new("Folder")
for i = 1,5 do Instance.new("Folder", f) end
if #f:GetDescendants() ~= 5 then warn("nice try buddy gl next time") return end
local camOK = pcall(function() return workspace.CurrentCamera.CFrame:Inverse() end)
if not camOK then warn("nice try buddy gl next time") return end
if debug.getinfo(coroutine.wrap).what ~= "C" then warn("nice try buddy gl next time") return end
local funcs = {
  xpcall, pairs, ipairs, require, typeof, type,
  tostring, tonumber, getmetatable, rawequal,
  next, select, unpack or table.unpack,
  error, assert, warn, print,
  math.abs, math.acos, math.asin, math.atan, math.atan2,
  math.ceil, math.cos, math.cosh, math.deg, math.exp,
  math.floor, math.fmod, math.frexp, math.ldexp, math.log,
  math.log10, math.max, math.min, math.modf, math.pow,
  math.rad, math.random, math.sin, math.sinh, math.sqrt,
  math.tan, math.tanh, math.pi, math.huge,
  string.byte, string.char, string.find, string.format,
  string.gmatch, string.gsub, string.len, string.lower,
  string.match, string.rep, string.reverse, string.sub, string.upper,
  table.concat, table.insert, table.pack, table.remove, table.sort,
  os.clock, os.date, os.difftime, os.time,
  Vector3.new, Vector2.new, Color3.new, UDim2.new, Rect.new,
  CFrame.new, Ray.new, NumberRange.new, NumberSequence.new,
  ColorSequence.new, PhysicalProperties.new,
  Instance.new, game.GetService, game.FindService,
  tick, wait, delay, spawn, elapsedTime,
  utf8.len, utf8.char, utf8.codes, utf8.codepoint, utf8.graphemes
}
local fail = 0
for _,fn in ipairs(funcs) do
  local ok = pcall(fn)
  if not ok then fail = fail + 1 end
end
local CONST_HASH = math.pi + 1/3 + #{"a","b","c"} + string.len("123456")
if CONST_HASH ~= (math.pi + 1/3 + 3 + 6) then warn("nice try buddy gl next time") return end
print(fail > 0 and ("detected "..fail.." times") or "Undetected!")
`

function generateKickEncrypted(reason: string, slug: string, tk: string) {
  const keyStr = `${slug}:${tk}:ULTv2`
  const key = new TextEncoder().encode(keyStr)
  const data = new TextEncoder().encode(`warn("${reason}") return`)
  const enc = crypto.xorBytes(data, key)
  return `local o=table.create;local j=1;local h="${crypto.bytesToHex(enc)}";local b=o(math.floor(#h/2));for i=1,#h,2 do b[j]=tonumber(h:sub(i,i+1),16) or 0;j=j+1 end;local k=table.create(#"${keyStr}";for i=1,#"${keyStr}" do k[i]=string.byte("${keyStr}",i) end;local out=table.create(#b);for i=1,#b do out[i]=string.char(bit32.bxor(b[i],k[((i-1)%#k)+1])) end;loadstring(table.concat(out))()`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const uid = url.searchParams.get('uid')
  const ts = url.searchParams.get('ts')
  const tk = url.searchParams.get('tk')
  const placeId = url.searchParams.get('pid')

  if (!slug || !uid || !ts || !tk || !placeId) {
    return new Response('missing params', { status: 400, headers: CORS })
  }

  // timestamp window 60 s
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(ts)) > 60) {
    return new Response(generateKickEncrypted('token expired', slug, tk), { headers: { ...CORS, 'Content-Type': 'text/plain' } })
  }

  // verify token
  const payload = `${slug}:${uid}:${ts}`
  const expected = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload + JWT_SECRET))
  const expectedHex = Array.from(new Uint8Array(expected)).map(b => b.toString(16).padStart(2, '0')).join('')
  if (expectedHex !== tk) {
    return new Response(generateKickEncrypted('invalid token', slug, tk), { headers: { ...CORS, 'Content-Type': 'text/plain' } })
  }

  // Roblox checks
  try {
    await rbxGet(`/users/${uid}`)
    if (!await isPublicGame(placeId)) throw new Error('private')
  } catch {
    return new Response(generateKickEncrypted('bypass found fuck off', slug, tk), { headers: { ...CORS, 'Content-Type': 'text/plain' } })
  }

  // fetch script
  const { data: script, error } = await supabase
    .from('scripts')
    .select('id,name,code,tier,owner')
    .eq('id', slug)
    .single()

  if error || !script) {
    return new Response(generateKickEncrypted('script not found', slug, tk), { headers: { ...CORS, 'Content-Type': 'text/plain' } })
  }

  // premium ? whitelist check
  if (script.tier === 'premium') {
    const { data: wl } = await supabase
      .from('whitelist')
      .select('expires_at')
      .eq('script_id', script.id)
      .eq('roblox_id', uid)
      .single()

    if (!wl || (wl.expires_at && new Date(wl.expires_at) < new Date())) {
      return new Response(generateKickEncrypted('not whitelisted', slug, tk), { headers: { ...CORS, 'Content-Type': 'text/plain' } })
    }
  }

  // build final loader
  const keyStr = `${slug}:${tk}:ULTv2`
  const key = new TextEncoder().encode(keyStr)
  const data = new TextEncoder().encode(script.code)
  const enc = crypto.xorBytes(data, key)
  const hex = crypto.bytesToHex(enc)

  const loader = `-- Phantom Protection Loader
local player = game:GetService("Players").LocalPlayer
if not player then player = game:GetService("Players").PlayerAdded:Wait() end
local userId = tostring(player.UserId)
local ts = tostring(os.time())
local tk = "${tk}"
local slug = "${slug}"
local placeId = game.PlaceId

local url = "https://${url.hostname}/functions/v1/get-loader?slug="..slug.."&uid="..userId.."&ts="..ts.."&tk="..tk.."&pid="..placeId
local s,r = pcall(function() return game:HttpGet(url) end)
if s and r then
  local h = "${hex}"
  local o = table.create(math.floor(#h/2))
  local j = 1
  for i = 1,#h,2 do o[j] = tonumber(h:sub(i,i+1),16) or 0; j = j+1 end
  local k = table.create(#"${keyStr}")
  for i = 1,#"${keyStr}" do k[i] = string.byte("${keyStr}",i) end
  local out = table.create(#o)
  for i = 1,#o do out[i] = string.char(bit32.bxor(o[i],k[((i-1)%#k)+1])) end
  local f,e = loadstring(table.concat(out))
  if f then f() else warn("E:"..tostring(e)) end
else
  warn("Network error")
end
`
  // bump executions
  await supabase.rpc('increment_executions', { id: script.id })

  return new Response(loader, { headers: { ...CORS, 'Content-Type': 'text/plain' } })
})
