#!/bin/bash
cd /home/ubuntu/allservice-deploy/services
export EXPO_PUBLIC_API_BASE_URL=http://40.192.103.12:8080
export REACT_APP_API_URL=http://40.192.103.12:8080
npx expo start --web --host lan --port 8081 -c
