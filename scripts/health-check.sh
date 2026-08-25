#!/bin/bash
# health-check.sh

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health | grep -q "^200$"

if [ $? -eq 0 ]; then
    echo "Health check passed."
    exit 0
else
    echo "Health check failed."
    exit 1
fi

