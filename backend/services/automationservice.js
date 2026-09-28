import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// ==========================================
// 1. STATE & COOLDOWN MANAGEMENT
// ==========================================
const lastRemediationTimes = new Map();
const COOLDOWN_PERIOD_MS = 5 * 60 * 1000; // 5 minutes

// ==========================================
// 2. AUDIT LOG (Memory)
// ==========================================
let automationEvents = [];

/**
 * Records an event into the log array.
 * This array is sent to the React dashboard to populate the timeline.
 */
function logEvent(type, targetService, reason, result) {
    const event = {
        id: Date.now().toString(),
        type: type,             // e.g., 'restart', 'cleanup'
        service: targetService, // e.g., 'cloudops-redis', 'system-disk'
        reason: reason,         // e.g., 'Health check failed', 'Disk > 85%'
        timestamp: new Date().toISOString(),
        result: result          // 'successful' or 'failed'
    };
    
    // Add new events to the top of the timeline
    automationEvents.unshift(event);
    
    // Cap the log at 50 events to prevent backend memory bloat
    if (automationEvents.length > 50) {
        automationEvents.pop();
    }
}

/**
 * Exposes the log array for your statusRoutes.js to read.
 */
export function getAutomationEvents() {
    return automationEvents;
}


// ==========================================
// 3. THE AUTOMATION SERVICE (Actuators)
// ==========================================

/**
 * Safely restarts a container with cooldown and logging.
 */
export async function restartContainer(serviceName, reason) {
    const now = Date.now();
    const lastRun = lastRemediationTimes.get(serviceName) || 0;

    // 1. Check Cooldown
    if (now - lastRun < COOLDOWN_PERIOD_MS) {
        const remainingSeconds = Math.round((COOLDOWN_PERIOD_MS - (now - lastRun)) / 1000);
        console.warn(`[Cooldown Active] Skipping restart for ${serviceName}. Try again in ${remainingSeconds}s.`);
        return { status: 'skipped', reason: 'cooldown_active' };
    }

    // 2. Update the timestamp BEFORE executing
    lastRemediationTimes.set(serviceName, now);

    try {
        console.log(`[Automation] Triggering restart for ${serviceName}...`);
        
        // 3. Execute script (Adjust path if needed: '../scripts/restart.sh' vs './scripts/restart.sh')
        await execPromise(`bash ../scripts/restart.sh ${serviceName}`);
        
        // 4. Log successful event to dashboard
        logEvent('restart', serviceName, reason, 'successful');
        return { status: 'successful' };
        
    } catch (error) {
        console.error(`[Automation] Failed to restart ${serviceName}:`, error);
        
        // 4. Log failed event to dashboard
        logEvent('restart', serviceName, reason, 'failed');
        return { status: 'failed', error: error.message };
    }
}

/**
 * Safely runs disk cleanup with cooldown and logging.
 */
export async function triggerDiskCleanup(reason) {
    const serviceName = 'system-disk';
    const now = Date.now();
    const lastRun = lastRemediationTimes.get(serviceName) || 0;

    // 1. Check Cooldown (Prevents thrashing the disk with continuous cleanup commands)
    if (now - lastRun < COOLDOWN_PERIOD_MS) {
        console.warn(`[Cooldown Active] Skipping disk cleanup.`);
        return { status: 'skipped', reason: 'cooldown_active' };
    }

    // 2. Update the timestamp BEFORE executing
    lastRemediationTimes.set(serviceName, now);

    try {
        console.log(`[Automation] Triggering disk cleanup...`);
        
        // 3. Execute script 
        await execPromise(`bash ../scripts/cleanup.sh`);
        
        // 4. Log successful event
        logEvent('cleanup', serviceName, reason, 'successful');
        return { status: 'successful' };
        
    } catch (error) {
        console.error('[Automation] Failed to run disk cleanup:', error);
        
        // 4. Log failed event
        logEvent('cleanup', serviceName, reason, 'failed');
        return { status: 'failed', error: error.message };
    }
}