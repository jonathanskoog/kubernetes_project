#!/bin/bash
docker compose -f docker-compose.yml stop
docker rm -f $(docker ps -a -q) dummy
docker volume rm docker_db-data
docker network prune -f