#!/bin/bash
cd /home/ubuntu/All_Services_App/servixo/all-services/services
export REACT_APP_API_URL=http://3.110.250.107:8080
npx expo start --web --host lan --port 8081
