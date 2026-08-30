#!/bin/bash
# restart-service.sh

echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Initiating backend restart." | tee -a $LOG_FILE

docker compose restart backend

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Backend restart completed successfully." | tee -a $LOG_FILE
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Backend restart failed." | tee -a $LOG_FILE
    exit 1
fi

sleep 10

./scripts/health-check.sh

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RECOVERY] Application recovered successfully." | tee -a $LOG_FILE
    exit 0
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RECOVERY] Application recovery failed." | tee -a $LOG_FILE
    exit 1
fi