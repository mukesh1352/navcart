import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BACKEND_URL = "http://localhost:8000";


type Node = {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
};

type Edge = {
  source: string;
  target: string;
  weight: number;
};

interface D3Edge extends d3.SimulationLinkDatum<Node> {
  source: Node;
  target: Node;
  weight: number;
}

const Map1: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [totalDistance, setTotalDistance] = useState<number | null>(null);
  const [path, setPath] = useState<string[]>([]);

  const fetchGraph = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/graph`);
      const data = await res.json();
      setNodes(data.nodes);
      setEdges(data.edges);
      setPath([]);
      setTotalDistance(null);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  const fetchShortestPath = async () => {
    if (!source || !target) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/shortest-path?source=${source}&target=${target}`
      );
      const data = await res.json();
      setPath(data.path || []);
      setTotalDistance(data.total_weight ?? null);
    } catch (error) {
      console.error("Error fetching shortest path:", error);
    }
  };

  useEffect(() => {
    fetchGraph();
    const intervalId = setInterval(fetchGraph, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchShortestPath();
  }, [source, target]);

  useEffect(() => {
    drawGraph(nodes, edges, path);
  }, [nodes, edges, path]);

  const drawGraph = (nodes: Node[], edges: Edge[], path: string[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = +svg.attr("width")!;
    const height = +svg.attr("height")!;

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const d3Edges: D3Edge[] = edges.map((e) => ({
      source: nodeMap.get(e.source)!,
      target: nodeMap.get(e.target)!,
      weight: e.weight,
    }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink<Node, D3Edge>(d3Edges).id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999");

    const isEdgeInPath = (sourceId: string, targetId: string) => {
      const sIdx = path.indexOf(sourceId);
      const tIdx = path.indexOf(targetId);
      return Math.abs(sIdx - tIdx) === 1;
    };

    const link = svg
      .append("g")
      .selectAll("line")
      .data(d3Edges)
      .enter()
      .append("line")
      .attr("stroke", (d) =>
        path.includes(d.source.id) &&
        path.includes(d.target.id) &&
        isEdgeInPath(d.source.id, d.target.id)
          ? "#ef4444"
          : "#bbb"
      )
      .attr("stroke-width", (d) =>
        path.includes(d.source.id) &&
        path.includes(d.target.id) &&
        isEdgeInPath(d.source.id, d.target.id)
          ? 3
          : 2
      )
      .attr("marker-end", "url(#arrowhead)");

    const edgeLabels = svg
      .append("g")
      .selectAll("text")
      .data(d3Edges)
      .enter()
      .append("text")
      .text((d) => d.weight)
      .attr("font-size", 11)
      .attr("fill", "#555")
      .attr("text-anchor", "middle");

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 12)
      .attr("fill", (d) => (path.includes(d.id) ? "#facc15" : "#60a5fa"))
      .attr("stroke", "#111")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).transition().duration(200).attr("r", 16);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("r", 12);
      })
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("font-size", 12)
      .attr("dx", 18)
      .attr("dy", ".35em")
      .attr("fill", "#222");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x!)
        .attr("y1", (d) => d.source.y!)
        .attr("x2", (d) => d.target.x!)
        .attr("y2", (d) => d.target.y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
      label.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
      edgeLabels
        .attr("x", (d) => (d.source.x! + d.target.x!) / 2)
        .attr("y", (d) => (d.source.y! + d.target.y!) / 2 - 5);
    });
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: "1.5rem", maxWidth: 1000, margin: "auto" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.8rem", color: "#111" }}>🧭 NavCart Path Finder</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontWeight: 500 }}>From:</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem 0.6rem", borderRadius: 6 }}
          >
            <option value="">Select</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>To:</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem 0.6rem", borderRadius: 6 }}
          >
            <option value="">Select</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalDistance !== null && (
        <div
          style={{
            marginBottom: "1rem",
            fontSize: "1rem",
            background: "#e0f2fe",
            padding: "0.6rem 1rem",
            borderRadius: 8,
            borderLeft: "4px solid #3b82f6",
            color: "#0369a1",
          }}
        >
          ✅ Shortest path distance: <strong>{totalDistance}</strong>
        </div>
      )}

      <svg
        ref={svgRef}
        width={900}
        height={600}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          background: "#f9fafb",
        }}
      />
    </div>
  );
};

export default Map1;
