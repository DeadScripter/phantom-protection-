import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const EDGE = (path: string) => `http://localhost:54321/functions/v1/${path}`

app.all('/api/*', async (req, res) => {
  const url = EDGE(req.path.replace('/api/', ''))
  const r = await fetch(url, {
    method: req.method,
    headers: { 'Content-Type': 'application/json', ...req.headers },
    body: JSON.stringify(req.body)
  })
  res.status(r.status).send(await r.text())
})

app.listen(4000, () => console.log('API proxy on http://localhost:4000'))
