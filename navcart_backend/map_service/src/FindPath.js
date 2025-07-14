import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { MongoClient } from 'mongodb'

const app = new Hono()
const client = new MongoClient('mongodb+srv://mukesh:12345@cluster0.cfejaad.mongodb.net/')
const dbName = 'department_graph'    // <---- MUST match your MongoDB Compass!
let db

async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}

async function buildGraph() {
  const db = await connectDB()
  const nodes = await db.collection('nodes').find({}).toArray()
  const graph = {}
  nodes.forEach(node => {
    const name = node.name
    graph[name] = []
    const dirs = node.directions || {}
    for (const dir of ['left', 'right', 'straight', 'back']) {
      if (Array.isArray(dirs[dir]) && dirs[dir].length) {
        graph[name].push(...dirs[dir])
      }
    }
  })
  return graph
}

function bfs(graph, start, goal) {
  let queue = [[start]]
  let visited = new Set()
  while (queue.length) {
    let path = queue.shift()
    let node = path[path.length - 1]
    if (node === goal) return path
    if (!visited.has(node)) {
      visited.add(node)
      if (graph[node]) {
        for (let neighbor of graph[node]) {
          queue.push([...path, neighbor])
        }
      }
    }
  }
  return null
}

function* permutation(arr) {
  if (arr.length === 0) yield []
  else {
    for (let i = 0; i < arr.length; i++) {
      const rest = arr.slice(0, i).concat(arr.slice(i + 1))
      for (const perm of permutation(rest)) {
        yield [arr[i], ...perm]
      }
    }
  }
}

app.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const { start, end, departments } = body
    console.log('\n=== NEW PATHFIND REQUEST ===')
    console.log('Start:', start)
    console.log('End:', end)
    console.log('Departments to visit:', departments)

    if (!start || !end || !Array.isArray(departments) || departments.length === 0) {
      console.error("Missing parameters:", {start, end, departments})
      return c.json({ error: "Missing required parameters." }, 400)
    }

    // Always treat the last department as "Checkouts"
    const checkouts = departments[departments.length - 1]
    const mustVisits = departments.slice(0, -1)
    const graph = await buildGraph()

    console.log('All graph nodes:', Object.keys(graph))
    for (let node of departments) {
      if (!graph[node]) {
        console.warn(`WARNING: Department '${node}' NOT found in graph!`)
      }
    }
    if (!graph[start]) console.warn(`WARNING: Start node '${start}' not found!`)
    if (!graph[end]) console.warn(`WARNING: End node '${end}' not found!`)
    if (!graph[checkouts]) console.warn(`WARNING: Checkouts node '${checkouts}' not found!`)

    const perms = [...permutation(mustVisits)]
    console.log(`Trying ${perms.length} department permutations...`)
    let bestPath = null
    let bestLen = Infinity

    for (const order of perms) {
      let path = []
      let cur = start
      let valid = true

      for (const dept of order) {
        const subPath = bfs(graph, cur, dept)
        if (!subPath) {
          console.warn(`No path from ${cur} to ${dept}!`)
          valid = false
          break
        }
        path = path.concat(subPath.slice(cur === start ? 0 : 1))
        cur = dept
      }

      const toCheckouts = bfs(graph, cur, checkouts)
      if (!toCheckouts) {
        console.warn(`No path from ${cur} to Checkouts!`)
        valid = false
        continue
      }
      path = path.concat(toCheckouts.slice(cur === start && order.length === 0 ? 0 : 1))
      cur = checkouts

      const toExit = bfs(graph, cur, end)
      if (!toExit) {
        console.warn(`No path from ${cur} to Exit!`)
        valid = false
        continue
      }
      path = path.concat(toExit.slice(1))

      if (valid && path.length < bestLen) {
        bestPath = path
        bestLen = path.length
      }
    }
    if (!bestPath) {
      console.error("No valid path found for this request!")
      return c.json({ error: "No valid path found." }, 404)
    }
    console.log('Best path found:', bestPath, '\n')
    return c.json({ path: bestPath })
  } catch (err) {
    console.error('FindPath server error:', err)
    return c.json({ error: "Pathfinding server error.", details: err.message || String(err) }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
