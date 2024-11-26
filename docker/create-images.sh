#!/bin/bash

if [ "$#" -lt 1 ]; then
    docker image rm frontend-app
    docker image rm backend-service
    docker image rm audio-service

    docker build -t frontend-app ../frontend_app
    docker build -t backend-service ../backend
    docker build -t audio-service ../audio_service

    echo "Created images"
else
    case $1 in
        frontend) 
            docker image rm frontend-app
            docker build -t frontend-app ../frontend_app
            echo "Created frontend"
        ;;
        backend)
            docker image rm backend-service
            docker build -t backend-service ../backend
            echo "Created backend"
        ;;
        audio)
            docker image rm audio-service
            docker build -t audio-service ../audio_service
            echo "Created audio"
        ;;
        *)
            echo "Invalid arguments"
        ;;
    esac
fi


