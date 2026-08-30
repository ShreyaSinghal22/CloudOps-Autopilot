#!/bin/bash
# docker-cleanup.sh

echo "$(date '+%Y-%m-%d %H:%M:%S') [CLEANUP] Starting Docker cleanup." | tee -a $LOG_FILE

docker container prune -f

if [ $? -ne 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [CLEANUP] Failed to clean stopped containers." | tee -a $LOG_FILE
    exit 1
fi

docker image prune -f

if [ $? -ne 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [CLEANUP] Failed to clean dangling images." | tee -a $LOG_FILE
    exit 1
fi

echo "Docker cleanup completed successfully."
exit 0