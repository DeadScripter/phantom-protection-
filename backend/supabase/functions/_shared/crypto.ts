// tiny XOR helpers (same algo as your Lua side)
export function hexToBytes(h: string) {
  const out = []
  for (let i = 0; i < h.length; i += 2) out.push(parseInt(h.substr(i, 2), 16))
  return new Uint8Array(out)
}
export function bytesToHex(b: Uint8Array) {
  return Array.from(b, x => ('0' + x.toString(16)).slice(-2)).join('')
}
export function xorBytes(data: Uint8Array, key: Uint8Array) {
  const out = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length]
  return out
}
