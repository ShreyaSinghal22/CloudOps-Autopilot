#!/bin/bash
# deploy.sh

echo "$(date '+%Y-%m-%d %H:%M:%S') [DEPLOY] Initiating deployment." | tee -a $LOG_FILE
docker compose up -d --build

if [ $? -ne 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DEPLOY] Deployment failed." | tee -a $LOG_FILE
    exit 1
fi

echo "$(date '+%Y-%m-%d %H:%M:%S') [DEPLOY] Deployment completed." | tee -a $LOG_FILE
echo "$(date '+%Y-%m-%d %H:%M:%S') [DEPLOY] Waiting for application to start..." | tee -a $LOG_FILE

sleep 10

./scripts/health-check.sh

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DEPLOY] Deployment verified successfully." | tee -a $LOG_FILE
    exit 0
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DEPLOY] Deployment completed, but health check failed." | tee -a $LOG_FILE
    exit 1
fi