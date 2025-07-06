# Use official Neo4j image
FROM neo4j:5

# Set environment variables (can be overridden in Render settings)
ENV NEO4J_AUTH=neo4j/yourpassword
ENV NEO4J_dbms_default__listen__address=0.0.0.0
ENV NEO4J_dbms_connector_bolt_listen__address=:7687
ENV NEO4J_dbms_connector_http_listen__address=:7474
ENV NEO4J_ACCEPT_LICENSE_AGREEMENT=yes

# Expose necessary ports
EXPOSE 7474 7687
