export async function rbxGet(path: string) {
  const r = await fetch(`https://api.roblox.com${path}`)
  if (!r.ok) throw new Error('rbx-api-fail')
  return r.json()
}

export async function isPublicGame(placeId: string): Promise<boolean> {
  try {
    const u = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
    if (!u.ok) return false
    const { universeId } = await u.json()

    const g = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`)
    if (!g.ok) return false
    const { data } = await g.json()

    return (
      data?.[0] &&
      data[0].rootPlaceId.toString() === placeId &&
      data[0].isPlayable === true
    )
  } catch {
    return false
  }
}
