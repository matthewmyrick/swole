#!/bin/bash

# Swole Kubernetes Deployment Script for Home Server
# Usage: ./deploy.sh [build|deploy|destroy]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACTION=${1:-deploy}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Validate action
if [[ "$ACTION" != "build" && "$ACTION" != "deploy" && "$ACTION" != "destroy" ]]; then
    error "Invalid action: $ACTION. Use 'build', 'deploy', or 'destroy'"
    exit 1
fi

log "🚀 Swole Kubernetes Deployment (Home Server)"
log "Action: $ACTION"

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    if ! command -v kubectl &> /dev/null; then
        error "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        error "docker is not installed"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    
    log "✅ Prerequisites check passed"
}

# Build Docker image
build_image() {
    log "🏗️  Building Docker image..."
    
    cd "$SCRIPT_DIR/.."
    
    docker build -t swole-api:latest -f Dockerfile.api .
    log "✅ Built image: swole-api:latest"
}

# Deploy to Kubernetes
deploy() {
    log "📦 Deploying to Kubernetes..."
    
    # Apply all resources
    kubectl apply -k "$SCRIPT_DIR/base"
    
    log "⏳ Waiting for deployment to be ready..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=postgres -n swole --timeout=300s
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=api -n swole --timeout=300s
    
    log "✅ Deployment completed successfully!"
    
    # Show service information
    log "📋 Service Information:"
    kubectl get services -n swole
    
    # Run seed job
    log "🌱 Running database seed job..."
    kubectl delete job swole-seed-job -n swole --ignore-not-found=true
    kubectl apply -f "$SCRIPT_DIR/base/seed-job.yaml"
    kubectl wait --for=condition=complete job/swole-seed-job -n swole --timeout=300s
    
    log "✅ Database seeded successfully!"
    
    # Get NodePort info
    NODE_PORT=$(kubectl get svc swole-api-service -n swole -o jsonpath='{.spec.ports[0].nodePort}')
    NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')
    
    log "🌐 API is accessible at: http://$NODE_IP:$NODE_PORT"
    log "🔍 Health check: http://$NODE_IP:$NODE_PORT/health"
    log "📡 API endpoints: http://$NODE_IP:$NODE_PORT/api/"
}

# Destroy deployment
destroy() {
    log "🗑️  Destroying deployment..."
    
    warn "This will delete all resources in the 'swole' namespace!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "Deployment destruction cancelled"
        exit 0
    fi
    
    kubectl delete namespace swole --ignore-not-found=true
    log "✅ Deployment destroyed"
}

# Main execution
main() {
    check_prerequisites
    
    case $ACTION in
        build)
            build_image
            ;;
        deploy)
            build_image
            deploy
            ;;
        destroy)
            destroy
            ;;
    esac
}

main