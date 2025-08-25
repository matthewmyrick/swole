# Swole Kubernetes Deployment

Simple Kubernetes deployment for the Swole fitness app backend on your home server.

## Architecture

- **PostgreSQL**: Database with persistent storage
- **Swole API**: Go REST API service exposed via NodePort
- **Sync Jobs**: CronJob for data maintenance
- **Secrets**: Database credentials (basic secret for home server)

## Prerequisites

- Kubernetes cluster running on your home server
- `kubectl` configured to connect to your cluster
- Docker installed for building images

## Quick Deploy

1. **Deploy everything:**
   ```bash
   ./k8s/deploy.sh
   ```

2. **Just build the image:**
   ```bash
   ./k8s/deploy.sh build
   ```

3. **Destroy deployment:**
   ```bash
   ./k8s/deploy.sh destroy
   ```

## What Gets Deployed

### Namespace: `swole`
All resources are deployed in the `swole` namespace.

### Services
- **PostgreSQL**: Internal service for database access
- **Swole API**: NodePort service exposed on port 30080

### Storage
- **PostgreSQL**: 10Gi persistent volume for database data

### Jobs
- **Seed Job**: Runs once to populate initial workout data
- **Sync CronJob**: Daily maintenance (2 AM)

## Accessing the API

After deployment, the API will be accessible at:
- **Health Check**: `http://<your-node-ip>:30080/health`
- **API Endpoints**: `http://<your-node-ip>:30080/api/`

The deploy script will show you the exact URL after deployment.

## Configuration

### Database
- Database: `swole_db`
- User: `postgres` 
- Password: `postgres` (basic setup for home server)

### API Endpoints
- `GET /health` - Health check
- `GET /api/week-schedule` - Get weekly workout schedule
- `GET /api/routines` - Get all workout routines
- `GET /api/routines/{id}` - Get specific routine
- `POST /api/workouts/{id}/progress` - Update workout progress
- `GET /api/progress` - Get user progress

## Files Structure

```
k8s/
├── base/
│   ├── namespace.yaml              # Swole namespace
│   ├── postgres-secret.yaml        # DB credentials
│   ├── postgres-init-configmap.yaml # DB schema
│   ├── app-config.yaml            # App configuration
│   ├── postgres-pvc.yaml          # Persistent volume claim
│   ├── postgres-service.yaml      # PostgreSQL service
│   ├── postgres-statefulset.yaml  # PostgreSQL deployment
│   ├── api-deployment.yaml        # API deployment
│   ├── api-service.yaml           # API NodePort service
│   ├── sync-cronjob.yaml          # Daily maintenance job
│   ├── seed-job.yaml              # Initial data seeding
│   └── kustomization.yaml         # Kustomize config
├── deploy.sh                      # Deployment script
├── create-sealed-secret.sh        # Sealed secret helper (optional)
└── README.md                      # This file
```

## Troubleshooting

### Check pod status
```bash
kubectl get pods -n swole
```

### Check logs
```bash
kubectl logs -f deployment/swole-api -n swole
kubectl logs -f statefulset/postgres -n swole
```

### Check services
```bash
kubectl get services -n swole
```

### Manual seed job
```bash
kubectl delete job swole-seed-job -n swole
kubectl apply -f k8s/base/seed-job.yaml
```

### Access PostgreSQL directly
```bash
kubectl exec -it postgres-0 -n swole -- psql -U postgres -d swole_db
```