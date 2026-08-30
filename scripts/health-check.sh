#!/bin/bash
# health-check.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../logs/cloudops.log"

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health | grep -q "^200$"

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTH] Health check passed." | tee -a $LOG_FILE 
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTH] Health check failed." | tee -a $LOG_FILE
    "$SCRIPT_DIR/restart.sh"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTH] Service restarted." | tee -a $LOG_FILE
fi

