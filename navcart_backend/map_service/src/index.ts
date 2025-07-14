import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { MongoClient } from "mongodb";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
	"*",
	cors({
		origin: "*", // Allow all origins (for development)
	}),
);

// MongoDB setup
const client = new MongoClient(
	"mongodb+srv://mukesh:12345@cluster0.cfejaad.mongodb.net/",
);
const graphDB = client.db("d_graph");
const inventoryDB = client.db("d_inventory");

// Cache to avoid rebuilding the graph every request
let cachedGraph: Record<string, string[]> = {};

async function buildGraph() {
	if (Object.keys(cachedGraph).length) return cachedGraph;
	const nodes = await graphDB.collection("nodes").find({}).toArray();
	const graph: Record<string, string[]> = {};

	for (const node of nodes) {
		const name = node.name;
		graph[name] = [];
		const dirs = node.directions || {};
		for (const dir of ["left", "right", "straight", "back"]) {
			if (Array.isArray(dirs[dir]) && dirs[dir].length) {
				graph[name].push(...dirs[dir]);
			}
		}
	}

	cachedGraph = graph;
	return graph;
}

function bfs(
	graph: Record<string, string[]>,
	start: string,
	goal: string,
): string[] | null {
	const queue: string[][] = [[start]];
	const visited = new Set<string>();

	while (queue.length) {
		const path = queue.shift();
		if (!path) break;
		const node = path[path.length - 1];
		if (node === goal) return path;
		if (!visited.has(node)) {
			visited.add(node);
			for (const neighbor of graph[node] || []) {
				queue.push([...path, neighbor]);
			}
		}
	}
	return null;
}

function* permutation<T>(arr: T[]): Generator<T[]> {
	if (arr.length === 0) yield [];
	else {
		for (let i = 0; i < arr.length; i++) {
			const rest = arr.slice(0, i).concat(arr.slice(i + 1));
			for (const perm of permutation(rest)) {
				yield [arr[i], ...perm];
			}
		}
	}
}

app.post("/", async (c) => {
	try {
		const body = await c.req.json();
		const items = body.items;

		if (!Array.isArray(items) || items.length === 0) {
			return c.json(
				{ error: 'Please provide a non-empty "items" array.' },
				400,
			);
		}

		await client.connect();

		// Step 1: Find matching departments
		const departmentsData = await inventoryDB
			.collection("items")
			.find({
				items: { $in: items },
			})
			.project({ _id: 0, department: 1 })
			.toArray();

		let deptList = departmentsData
			.map((d) => d.department)
			.filter((d) => d !== "Checkouts");
		deptList = [...new Set(deptList)]; // remove duplicates
		deptList.push("Checkouts"); // always end at Checkouts

		console.log("Matched departments:", deptList);

		// Step 2: Build graph
		const graph = await buildGraph();
		const start = "Entrance";
		const end = "Exit";
		const mustVisit = deptList.slice(0, -1);
		const checkouts = deptList[deptList.length - 1];

		// Step 3: Find optimal path
		const perms = [...permutation(mustVisit)];
		let bestPath: string[] | null = null;
		let minLen = Infinity;

		for (const order of perms) {
			let path: string[] = [];
			let cur = start;
			let valid = true;

			for (const dept of order) {
				const subPath = bfs(graph, cur, dept);
				if (!subPath) {
					valid = false;
					break;
				}
				path = path.concat(subPath.slice(cur === start ? 0 : 1));
				cur = dept;
			}

			const toCheckout = bfs(graph, cur, checkouts);
			if (!toCheckout) {
				valid = false;
				continue;
			}
			path = path.concat(
				toCheckout.slice(cur === start && order.length === 0 ? 0 : 1),
			);
			cur = checkouts;

			const toExit = bfs(graph, cur, end);
			if (!toExit) {
				valid = false;
				continue;
			}
			path = path.concat(toExit.slice(1));

			if (valid && path.length < minLen) {
				bestPath = path;
				minLen = path.length;
			}
		}

		if (!bestPath) {
			return c.json(
				{ error: "No valid path found through all departments." },
				404,
			);
		}

		return c.json({
			departments: deptList,
			path: bestPath,
		});
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error("Error:", err.message);
			return c.json(
				{ error: "Internal server error.", details: err.message },
				500,
			);
		}
		console.error("Unknown error:", err);
		return c.json(
			{ error: "Internal server error.", details: String(err) },
			500,
		);
	}
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`);
});
