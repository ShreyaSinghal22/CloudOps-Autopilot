#!/bin/bash
# disk-monitor.sh

THRESHOLD=80

DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

echo "$(date '+%Y-%m-%d %H:%M:%S') [DISK-USAGE] Current disk usage: $DISK_USAGE%" | tee -a $LOG_FILE

if [ "$DISK_USAGE" -ge "$THRESHOLD" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DISK-USAGE] Disk usage is above threshold." | tee -a $LOG_FILE
    exit 1
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DISK-USAGE] Disk usage is within safe limits." | tee -a $LOG_FILE
    exit 0
fi