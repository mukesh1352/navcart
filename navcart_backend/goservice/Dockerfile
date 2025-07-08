# ---- Build Stage ----
FROM golang:1.24.4-alpine AS builder

WORKDIR /app

# Install git (needed for go modules), and timezone files (optional)
RUN apk add --no-cache git tzdata

# Cache go mod deps first
COPY go.mod go.sum ./
RUN go mod download

# Copy rest of the app
COPY . .

# Build the binary
RUN go build -o server .

# ---- Run Stage ----
FROM alpine:latest

# Create a non-root user
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Copy built binary from builder
COPY --from=builder /app/server .

# Copy timezone data (optional, if your app relies on correct timezones)
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Set environment variable for Mongo URI (override via docker run or compose)
ENV MONGO_URI="mongodb://localhost:27017"

# Use non-root user for security
USER appuser

# Expose port
EXPOSE 8080

# Run the server
CMD ["./server"]
