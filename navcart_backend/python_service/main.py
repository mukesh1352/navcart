from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase
import networkx as nx
import logging
import time

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Neo4j connection setup with retry
def init_driver(uri, user, password, retries=10, delay=3):
    for attempt in range(retries):
        try:
            driver = GraphDatabase.driver(uri, auth=(user, password))
            # Test connection
            with driver.session() as session:
                session.run("RETURN 1")
            logger.info("✅ Connected to Neo4j")
            return driver
        except Exception as e:
            logger.warning(f"❌ Attempt {attempt + 1}: Failed to connect to Neo4j - {e}")
            time.sleep(delay)
    raise Exception("Failed to connect to Neo4j after retries.")

# Connect to Neo4j inside Docker
driver = init_driver("bolt://localhost:7687", "neo4j", "test")

# Fetching the graph from the Neo4j database
def fetch_graph_from_db():
    G = nx.DiGraph()
    try:
        with driver.session(database="neo4j") as session:
            result = session.run("""
                MATCH (a:Aisle)-[r:CONNECTED]->(b:Aisle)
                RETURN a.id AS source, b.id AS target, r.distance AS weight
            """)
            for record in result:
                G.add_edge(record["source"], record["target"], weight=record["weight"])
        return G
    except Exception as e:
        logger.error(f"Error fetching graph from Neo4j: {e}")
        return nx.DiGraph()  # Return empty graph if error

@app.get("/graph")
def get_graph():
    G = fetch_graph_from_db()
    nodes = [{"id": n} for n in G.nodes()]
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
            "edges": [],
            "cost": 0,
            "message": "Source and target are the same."
        }

    try:
        path = nx.dijkstra_path(G, source, target)
        cost = nx.dijkstra_path_length(G, source, target)
        edge_path = [
            {"source": u, "target": v, "weight": G[u][v]["weight"]}
            for u, v in zip(path, path[1:])
        ]
        return {
            "path": path,
            "edges": edge_path,
            "cost": cost
        }
    except nx.NetworkXNoPath:
        return {"error": f"No path found from '{source}' to '{target}'"}
