#!/bin/bash

# Apply all secrets and config maps first
kubectl apply -f ./postgres-secret.yaml
kubectl apply -f ./postgres-config.yaml

# Apply all other YAML files in the kubernetes directory
for file in *.yaml; do
  kubectl apply -f "$file"
done

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
kubectl rollout status deployment/postgres-deplyoment

# Wait for the backend to be ready
echo "Waiting for backend to be ready..."
kubectl rollout status deployment/backend-deplyoment

# Wait for the frontend to be ready
echo "Waiting for frontend to be ready..."
kubectl rollout status deployment/frontend-deplyoment

echo "All services are up and running!"