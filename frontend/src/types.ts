export type ScriptTier = 'standard' | 'premium'

export interface Script {
  id: string
  name: string
  code: string
  tier: ScriptTier
  created_at: string
  updated_at: string
  owner: string
  executions: number
}

export interface WhitelistEntry {
  id: string
  script_id: string
  discord_id: string
  roblox_id: string
  expires_at: string | null
}
