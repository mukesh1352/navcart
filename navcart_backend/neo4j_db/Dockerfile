# Use official Neo4j image
FROM neo4j:5

# Set environment variables
ENV NEO4J_AUTH=neo4j/yourpassword
ENV NEO4J_ACCEPT_LICENSE_AGREEMENT=yes

# Updated Neo4j 5 config keys
ENV NEO4J_server_default__listen__address=0.0.0.0
ENV NEO4J_server_bolt__listen__address=:7687
ENV NEO4J_server_http__listen__address=:7474

# ✅ Lower heap size for Render
ENV NEO4J_server_memory_heap_initial__size=128m
ENV NEO4J_server_memory_heap_max__size=256m

# ✅ (Optional) Disable strict validation to avoid config errors
ENV NEO4J_server_config_strict__validation__enabled=false

# Expose ports
EXPOSE 7474 7687
