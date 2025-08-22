# Swole Kubernetes Deployment

This directory contains all the Kubernetes manifests needed to deploy the Swole workout app on your home server.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Go API Pod    │    │ PostgreSQL Pod  │
│  (swoleMobile)  │───▶│  (swole-api)    │───▶│   (postgres)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       ▲
                                ▼                       │
                       ┌─────────────────┐              │
                       │ Python Data Job │──────────────┘
                       │ (routine mgmt)  │
                       └─────────────────┘
```

## Data Management Strategy

### ✅ Database Schema Initialization
- **Who**: Kubernetes PostgreSQL init scripts
- **What**: Creates all tables, constraints, indexes
- **When**: On PostgreSQL container startup
- **Where**: `/docker-entrypoint-initdb.d/init.sql`

### ✅ Routine Data Management  
- **Who**: Python data job (`update_routines.py`)
- **What**: Manages routine and workout definitions
- **When**: On-demand via Job or scheduled via CronJob
- **Where**: YAML files in ConfigMaps
- **Preserves**: ALL user progress data (never touches `user_progress` table)

### ✅ User Progress Data
- **Who**: Go API handlers
- **What**: Saves/retrieves user workout progress
- **When**: Real-time as users update their workouts
- **Where**: `user_progress` table in PostgreSQL
- **Persistence**: Permanent (survives routine updates)

## Deployment Steps

### 1. Build Docker Images

```bash
# Build Go API image
cd /path/to/swoleBackend
docker build -f Dockerfile.api -t swole-api:latest .

# Build Python job image  
docker build -f Dockerfile.python -t swole-python-job:latest .
```

### 2. Create Kubernetes Resources

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy PostgreSQL with init scripts
kubectl apply -f k8s/postgres-deployment.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n swole --timeout=60s

# Deploy Go API
kubectl apply -f k8s/api-deployment.yaml

# Wait for API to be ready
kubectl wait --for=condition=ready pod -l app=swole-api -n swole --timeout=60s

# Run initial data job to populate routines
kubectl apply -f k8s/python-job.yaml
```

### 3. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n swole

# Check API health
kubectl port-forward svc/swole-api-service 8080:8080 -n swole
curl http://localhost:8080/health
curl http://localhost:8080/health/db

# Check database tables were created
kubectl exec -it deployment/postgres -n swole -- psql -U postgres -d swole_db -c "\\dt"

# Check routines were loaded
curl http://localhost:8080/api/routines
```

## Key Benefits

### 🔄 **Separation of Concerns**
- **Database**: Handles schema, persistence, and constraints
- **API**: Handles user requests and progress tracking  
- **Python Job**: Handles routine configuration management
- **Mobile App**: Handles user interface and experience

### 📊 **Data Integrity**
- User progress is **NEVER** lost during routine updates
- Python job only touches `routines` and `workouts` tables
- Database constraints ensure referential integrity
- Unique constraints prevent duplicate progress entries

### 🚀 **Scalability**
- API pods can be scaled horizontally (currently set to 2 replicas)
- PostgreSQL uses persistent volumes for data durability
- Python jobs run independently and can be scheduled

### 🔧 **Maintenance**
- Update routines by modifying ConfigMap and running Job
- Monitor health with built-in health checks
- Logs available via `kubectl logs`
- Database backups via standard PostgreSQL tools

## Configuration Updates

### To Update Routine Definitions:

1. **Update the ConfigMap**:
   ```bash
   kubectl edit configmap routines-yaml-config -n swole
   ```

2. **Run the data job**:
   ```bash
   kubectl delete job swole-data-update -n swole
   kubectl apply -f k8s/python-job.yaml
   ```

3. **Verify changes**:
   ```bash
   curl http://localhost:8080/api/routines
   ```

### To Update Database Schema:
1. Modify `postgres-init.sql`
2. Update the ConfigMap in `postgres-deployment.yaml`
3. Delete and recreate PostgreSQL pod (⚠️ **DATA LOSS** - backup first!)

## Security Notes

- Change default PostgreSQL passwords in production
- Use proper secrets management
- Restrict ingress to known networks
- Enable TLS/SSL for production
- Regular security updates for base images

## Monitoring

- Health checks are configured for both API and database
- Prometheus metrics can be added to the Go API
- Log aggregation via standard K8s logging
- Resource limits prevent resource exhaustion