from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase
import networkx as nx
import uvicorn
from contextlib import asynccontextmanager

driver = None

URI = "neo4j+s://e26e2102.databases.neo4j.io"
AUTH = ("neo4j", "igmb8yB0xLB6Gkk0tGY4AH_6D9mjfCbt7kJs-2sfxAk")  # Replace with real credentials

@asynccontextmanager
async def lifespan(app: FastAPI):
    global driver
    driver = GraphDatabase.driver(URI, auth=AUTH)
    driver.verify_connectivity()
    yield
    driver.close()

app = FastAPI(lifespan=lifespan)

# Allow CORS (for frontend testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://navcart.vercel.app/"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fetch entire graph (CONNECTED & CONTAINS)
def fetch_graph_from_db():
    G = nx.DiGraph()
    with driver.session(database="neo4j") as session:
        result = session.run("""
            MATCH (a:Aisle)-[r:CONNECTED]->(b:Aisle)
            RETURN a.id AS source, a.name AS source_name,
                   b.id AS target, b.name AS target_name,
                   r.distance AS weight
        """)
        for record in result:
            source = record["source"]
            target = record["target"]
            source_name = record["source_name"]
            target_name = record["target_name"]
            weight = record["weight"]

            if source is None or target is None:
                print(f"Skipping invalid record: {record}")
                continue

            G.add_node(source, name=source_name)
            G.add_node(target, name=target_name)
            G.add_edge(source, target, weight=weight)
    return G

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/graph")
def get_graph():
    G = fetch_graph_from_db()
    nodes = [{"id": n, "label": G.nodes[n].get("name", n)} for n in G.nodes()]
    edges = [
        {"source": u, "target": v, "weight": d["weight"]}
        for u, v, d in G.edges(data=True)
    ]
    return {"nodes": nodes, "edges": edges}

@app.get("/shortest-path")
def shortest_path(source: str = Query(...), target: str = Query(...)):
    G = fetch_graph_from_db()

    if source not in G.nodes:
        return {"error": f"Source node '{source}' does not exist in the graph."}
    if target not in G.nodes:
        return {"error": f"Target node '{target}' does not exist in the graph."}
    if source == target:
        return {
            "path": [source],
            "labels": [G.nodes[source].get("name", source)],
            "edges": [],
            "cost": 0,
            "message": "Source and target are the same."
        }

    try:
        path = nx.dijkstra_path(G, source, target)
        cost = nx.dijkstra_path_length(G, source, target)

        edge_path = []
        for i in range(len(path) - 1):
            u, v = path[i], path[i + 1]
            weight = G[u][v]["weight"]
            edge_path.append({"source": u, "target": v, "weight": weight})

        labels = [G.nodes[n].get("name", n) for n in path]

        return {
            "path": path,
            "labels": labels,
            "edges": edge_path,
            "cost": cost
        }

    except nx.NetworkXNoPath:
        return {"error": f"No path found from '{source}' to '{target}'"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
