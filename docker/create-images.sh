#!/bin/bash
docker image rm frontend-app
docker image rm backend-service
docker image rm audio-service

docker build -t frontend-app ../frontend_app
docker build -t backend-service ../backend
docker build -t audio-service ../audio_service
