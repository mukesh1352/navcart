from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://navcart.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

URI = "neo4j+s://e26e2102.databases.neo4j.io"
AUTH = ("neo4j", "igmb8yB0xLB6Gkk0tGY4AH_6D9mjfCbt7kJs-2sfxAk")
driver = GraphDatabase.driver(URI, auth=AUTH)

# ✅ Return full graph: nodes + edges
@app.get("/graph")
async def get_graph():
    try:
        with driver.session() as session:
            query = """
            MATCH (a)-[r]->(b)
            RETURN a.name AS source, b.name AS target, r.weight AS weight
            """
            result = session.run(query)

            nodes_set = set()
            edges = []

            for record in result:
                source = record.get("source")
                target = record.get("target")
                weight = record.get("weight", 1)  # default to 1 if weight is None

                if source and target:
                    edges.append({
                        "source": source,
                        "target": target,
                        "weight": weight
                    })
                    nodes_set.update([source, target])

            nodes = [{"id": node} for node in nodes_set]
            return {"nodes": nodes, "edges": edges}

    except Exception as e:  # noqa: F841
        logging.exception("Error fetching graph data")
        raise HTTPException(status_code=500, detail="Failed to fetch graph data")

# ✅ Shortest path route
@app.get("/shortest-path")
async def get_shortest_path(source: str = Query(...), target: str = Query(...)):
    try:
        if source == target:
            return {
                "path": [source],
                "total_weight": 0
            }

        with driver.session() as session:
            path_result = session.run(
                """
                MATCH p=shortestPath((start {name: $source})-[*]-(end {name: $target}))
                RETURN p
                """,
                {"source": source, "target": target}
            )
            record = path_result.single()

            if not record:
                raise HTTPException(status_code=404, detail="No path found")

            path = record["p"]
            nodes = [node.get("name") for node in path.nodes]
            total_weight = sum(rel.get("weight", 1) for rel in path.relationships)

            return {
                "path": nodes,
                "total_weight": total_weight
            }

    except Exception:
        logging.exception("Error computing shortest path")
        raise HTTPException(status_code=500, detail="Failed to compute shortest path")

# ✅ Proper shutdown
@app.on_event("shutdown")
def shutdown():
    driver.close()
