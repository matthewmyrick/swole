#!/bin/bash

# Swole Backend Startup Script

echo "🚀 Starting Swole Backend Server..."

# Set environment variables
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/swole_db?sslmode=disable"
export PORT=8080

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📁 Working directory: $(pwd)"

# Check if Go modules are downloaded
if [ ! -d "vendor" ] && [ ! -f "go.sum" ]; then
    echo "📦 Downloading Go modules..."
    go mod download
fi

# Wait for PostgreSQL to be ready
echo "🔍 Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "⏳ PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready"

# Start the server
echo "🏁 Starting Go server on port $PORT..."
go run main.go