#!/bin/bash
kubectl apply -f postgres.yml


kubectl apply -f backend.yml
kubectl apply -f audio.yml
kubectl apply -f frontend.yml
kubectl get all
