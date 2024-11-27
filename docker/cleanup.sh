#!/bin/bash
docker compose -f docker-compose.yml stop
docker rm -f $(docker ps -a -q) dummy
if [ "$1" -eq 1 ]; then
    docker volume rm docker_db-data
fi
docker network prune -f