#!/bin/bash

# Swole Deployment Status Checker
# Quick script to check if everything is running properly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

log "🔍 Checking Swole Deployment Status..."
echo "=================================="

# Check if kubectl is working
if ! kubectl cluster-info &> /dev/null; then
    error "❌ Cannot connect to Kubernetes cluster"
    exit 1
fi

log "✅ Kubernetes cluster is accessible"

# Check namespace
if kubectl get namespace swole &> /dev/null; then
    log "✅ Swole namespace exists"
else
    error "❌ Swole namespace not found - run ./k8s/deploy.sh first"
    exit 1
fi

# Check pods status
info "📦 Pod Status:"
kubectl get pods -n swole

# Check if all pods are running
POSTGRES_READY=$(kubectl get pods -n swole -l app.kubernetes.io/component=postgres -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "False")
API_READY=$(kubectl get pods -n swole -l app.kubernetes.io/component=api -o jsonpath='{.items[0].status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "False")

if [ "$POSTGRES_READY" = "True" ]; then
    log "✅ PostgreSQL is ready"
else
    error "❌ PostgreSQL is not ready"
fi

if [ "$API_READY" = "True" ]; then
    log "✅ API is ready"
else
    error "❌ API is not ready"
fi

# Check services
info "🌐 Service Status:"
kubectl get services -n swole

# Get API endpoint info
NODE_PORT=$(kubectl get svc swole-api-service -n swole -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null || echo "unknown")
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}' 2>/dev/null || echo "unknown")

info "🚀 API Endpoint Information:"
echo "   Health check: http://$NODE_IP:$NODE_PORT/health"
echo "   API base URL: http://$NODE_IP:$NODE_PORT/api/"

# Test health endpoint
if [ "$NODE_IP" != "unknown" ] && [ "$NODE_PORT" != "unknown" ]; then
    info "🔍 Testing health endpoint..."
    if curl -f -s "http://$NODE_IP:$NODE_PORT/health" > /dev/null; then
        log "✅ Health check passed"
        
        # Test a few API endpoints
        info "📡 Testing API endpoints..."
        
        if curl -f -s "http://$NODE_IP:$NODE_PORT/api/routines" | head -c 1 > /dev/null; then
            ROUTINE_COUNT=$(curl -s "http://$NODE_IP:$NODE_PORT/api/routines" | jq length 2>/dev/null || echo "unknown")
            log "✅ Routines API working (${ROUTINE_COUNT} routines)"
        else
            warn "⚠️ Routines API not responding"
        fi
        
        if curl -f -s "http://$NODE_IP:$NODE_PORT/api/week-schedule?user_id=user@example.com" > /dev/null; then
            log "✅ Week schedule API working"
        else
            warn "⚠️ Week schedule API not responding"
        fi
        
    else
        error "❌ Health check failed"
    fi
else
    warn "⚠️ Cannot determine API endpoint"
fi

# Check recent logs for errors
info "📋 Recent API Logs (last 10 lines):"
kubectl logs --tail=10 -l app.kubernetes.io/component=api -n swole 2>/dev/null || echo "No API logs available"

info "📋 Recent PostgreSQL Logs (last 5 lines):"  
kubectl logs --tail=5 -l app.kubernetes.io/component=postgres -n swole 2>/dev/null || echo "No PostgreSQL logs available"

# Check persistent volumes
info "💾 Storage Status:"
kubectl get pvc -n swole

echo ""
log "🎯 Deployment Status Summary:"
echo "=================================="

if [ "$POSTGRES_READY" = "True" ] && [ "$API_READY" = "True" ]; then
    log "✅ All services are healthy and ready!"
    log "📱 Your mobile app can connect to: http://$NODE_IP:$NODE_PORT"
else
    error "❌ Some services are not ready - check logs above"
    exit 1
fi