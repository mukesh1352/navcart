import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { MongoClient } from 'mongodb'
import fetch from 'node-fetch'

const app = new Hono()

const client = new MongoClient('mongodb+srv://mukesh:12345@cluster0.cfejaad.mongodb.net/')
const dbName = 'department_inventory'   // <-- MUST match your Mongo!
let db

async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}

app.notFound((c) => c.text('Custom 404 Message', 404))

app.get('/', (c) => c.text('Hello Hono!'))

app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const items = body.items
    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: 'Please provide a non-empty "items" array.' }, 400)
    }

    const db = await connectDB()
    const inventory = db.collection('items')

    // Find departments where ANY item matches
    const departments = await inventory.find({
      items: { $in: items }
    }).project({ _id: 0, department: 1 }).toArray()

    let deptNames = departments.map(d => d.department).filter(d => d !== "Checkouts")
    deptNames.push("Checkouts") // always end at Checkouts

    // DEBUG LOGS
    console.log("Requested items:", items)
    console.log("Matched departments:", deptNames)

    const pathfindingPayload = {
      start: "Entrance",
      end: "Exit",
      departments: deptNames
    }
    console.log("Payload sent to FindPath:", pathfindingPayload)

    const pathRes = await fetch('http://localhost:3001', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pathfindingPayload)
    })

    if (!pathRes.ok) {
      console.error("Pathfinder error!", pathRes.status)
      return c.json({ error: "Pathfinding server error." }, 500)
    }

    const pathData = await pathRes.json()
    return c.json({
      departments: deptNames,
      path: pathData.path
    })

  } catch (err) {
    console.error('POST / error:', err)
    return c.text('Internal Server Error', 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
