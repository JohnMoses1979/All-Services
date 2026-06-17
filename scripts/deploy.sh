#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/home/ubuntu/All-Services"
LOCK_FILE="/tmp/all-services-deploy.lock"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another deployment is already running. Exiting."
  exit 1
fi

cd "$PROJECT_DIR"

echo "==== Pull latest code ===="
git config --global --add safe.directory "$PROJECT_DIR" || true
git fetch origin main
git reset --hard origin/main

echo "==== Write env files from GitHub secrets ===="
cat > services-backend/.env <<ENVEOF
${BACKEND_ENV}
ENVEOF

cat > services/.env <<ENVEOF
${FRONTEND_ENV}
ENVEOF

echo "==== Build backend jar ===="
cd "$PROJECT_DIR/services-backend"
chmod +x mvnw 2>/dev/null || true

if [ -f mvnw ]; then
  ./mvnw clean package -DskipTests
else
  mvn clean package -DskipTests
fi

cd "$PROJECT_DIR"

echo "==== Validate docker compose ===="
sudo docker compose config -q

echo "==== Clear Docker lock safely ===="
sudo systemctl restart docker
sleep 30

echo "==== Remove old duplicate containers only ===="
sudo docker update --restart=no services-mysql 2>/dev/null || true
sudo docker rm -f services-mysql 2>/dev/null || true

echo "==== Deploy fresh containers ===="
sudo docker compose down --remove-orphans --timeout 30 || true
sudo docker compose up -d --build

echo "==== Wait for backend ===="
sleep 60

echo "==== Container status ===="
sudo docker compose ps

echo "==== Backend logs ===="
sudo docker compose logs --tail=80 backend

echo "==== Test backend login endpoint ===="
curl -i -X POST http://localhost:8080/api/owner/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9963795242","password":"12345"}' || true

echo "==== Deployment completed successfully ===="
