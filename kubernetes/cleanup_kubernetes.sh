#!/bin/bash

# Delete all resources defined in the YAML files in the kubernetes directory
# for file in kubernetes/*.yaml; do
#   kubectl delete --cascade='foreground' -f "$file"
# done

# Delete the secrets and config maps
kubectl delete --cascade='foreground' -f postgres-secret.yaml
kubectl delete --cascade='foreground' -f postgres-config.yaml

# Optionally, delete any remaining resources that might not be covered by the above files
kubectl delete deployment postgres-deplyoment --cascade='foreground'
kubectl delete deployment backend-deplyoment --cascade='foreground'
kubectl delete deployment frontend-deplyoment --cascade='foreground'
kubectl delete deployment audio-deplyoment --cascade='foreground'

kubectl delete service postgres-service --cascade='foreground'
kubectl delete service backend-service --cascade='foreground'
kubectl delete service frontend-service --cascade='foreground'
kubectl delete service audio-service --cascade='foreground'

echo "All Kubernetes resources have been cleaned up!"