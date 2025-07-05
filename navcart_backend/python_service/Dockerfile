FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget gnupg2 curl lsb-release supervisor openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# --------------------------
# Install Neo4j Community Edition
# --------------------------
ENV NEO4J_VERSION=5.20.0

RUN mkdir -p /neo4j \
    && curl -L https://dist.neo4j.org/neo4j-community-${NEO4J_VERSION}-unix.tar.gz | tar zx -C /neo4j --strip-components=1

# Set Neo4j environment variables
ENV NEO4J_HOME=/neo4j
ENV PATH="${NEO4J_HOME}/bin:$PATH"

# Default credentials (you should change in production!)
ENV NEO4J_AUTH=neo4j/test

# --------------------------
# Set up FastAPI App
# --------------------------
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# --------------------------
# Supervisor Configuration
# --------------------------
RUN mkdir -p /var/log/supervisor

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 8000 7474 7687

ENV PYTHONUNBUFFERED=1

CMD ["/usr/bin/supervisord"]
