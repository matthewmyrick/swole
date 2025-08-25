#!/bin/bash

# Script to create sealed secrets for the Swole application
# Prerequisites: kubectl and kubeseal must be installed

set -e

echo "🔐 Creating sealed secrets for Swole application..."

# Check if kubeseal is installed
if ! command -v kubeseal &> /dev/null; then
    echo "❌ kubeseal is not installed. Please install it first:"
    echo "   brew install kubeseal (on macOS)"
    echo "   or download from: https://github.com/bitnami-labs/sealed-secrets/releases"
    exit 1
fi

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl is not configured or cluster is not reachable"
    exit 1
fi

echo "📝 Enter database credentials:"
read -p "PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "PostgreSQL password: " DB_PASSWORD
echo

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Password cannot be empty"
    exit 1
fi

echo "🔑 Creating postgres sealed secret..."

# Create temporary secret
kubectl create secret generic postgres-secret \
  --namespace=swole \
  --from-literal=username="$DB_USER" \
  --from-literal=password="$DB_PASSWORD" \
  --dry-run=client -o yaml > /tmp/postgres-secret-temp.yaml

# Create sealed secret
kubeseal -f /tmp/postgres-secret-temp.yaml -w k8s/base/postgres-sealed-secret.yaml

# Clean up temp file
rm /tmp/postgres-secret-temp.yaml

echo "✅ Sealed secret created at k8s/base/postgres-sealed-secret.yaml"
echo "📁 You can now safely commit this file to your repository"
echo ""
echo "To apply the sealed secret:"
echo "   kubectl apply -f k8s/base/postgres-sealed-secret.yaml"