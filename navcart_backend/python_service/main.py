from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase

app = FastAPI()

# ✅ Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins='https://navcart.vercel.app',  # or restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Neo4j connection setup
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
                source = record["source"]
                target = record["target"]
                weight = record["weight"]
                edges.append({"source": source, "target": target, "weight": weight})
                nodes_set.add(source)
                nodes_set.add(target)

            nodes = [{"id": node} for node in nodes_set]
            return {"nodes": nodes, "edges": edges}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Shortest path route
@app.get("/shortest-path")
async def get_shortest_path(source: str = Query(...), target: str = Query(...)):
    try:
        with driver.session() as session:
            # NOTE: Use GDS if you're using Neo4j 5+. Otherwise adapt this.
            path_result = session.run(
                """
                MATCH p=shortestPath((start:Location {name: $source})-[*]-(end:Location {name: $target}))
                RETURN p
                """,
                {"source": source, "target": target}
            )
            record = path_result.single()

            if not record:
                raise HTTPException(status_code=404, detail="No path found")

            path = record["p"]
            nodes = [node["name"] for node in path.nodes]
            total_weight = sum(rel["weight"] for rel in path.relationships)

            return {"path": nodes, "total_weight": total_weight}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.on_event("shutdown")
def shutdown():
    driver.close()
