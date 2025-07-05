FROM python:3.11-slim

# Install Java (required by Neo4j) and utilities
RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    curl \
    unzip \
    && apt-get clean

# Set environment variables for Neo4j
ENV NEO4J_HOME=/neo4j
ENV NEO4J_AUTH=neo4j/test

# Download and install Neo4j
RUN curl -L https://dist.neo4j.org/neo4j-community-5.20.0-unix.tar.gz -o neo4j.tar.gz && \
    mkdir -p $NEO4J_HOME && \
    tar -xzf neo4j.tar.gz -C $NEO4J_HOME --strip-components=1 && \
    rm neo4j.tar.gz && \
    chmod +x $NEO4J_HOME/bin/neo4j

# Install Python dependencies
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . .

# Expose FastAPI and Neo4j ports
EXPOSE 8000 7474 7687

# Use supervisord to run both services
RUN pip install supervisor
COPY supervisord.conf /etc/supervisord.conf

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
