import { exec } from 'child_process';
//allows the node run shell scripts and commands
import util from 'util';
//built-in module that provides utility functions, including promisifying callback-based functions

// Promisify exec to use async/await
const execPromise = util.promisify(exec);

// Map the display names for your dashboard to the actual container names in compose.yaml
const TARGET_CONTAINERS = [
  { displayName: 'Backend', containerName: 'cloudops-backend' },
  { displayName: 'Redis', containerName: 'cloudops-redis' }
];

export async function getContainers() {
  try {
    // Ask Docker for all containers and format the output as "Name|Status"
    const { stdout } = await execPromise('docker ps -a --format "{{.Names}}|{{.Status}}"');
    
    // Parse the command output into a lookup object
    const lines = stdout.trim().split('\n');
    const dockerState = {};

    lines.forEach(line => {
      const [name, rawStatus] = line.split('|');
      if (name && rawStatus) {
        // If the raw status from Docker starts with "Up", we consider it running
        dockerState[name] = rawStatus.startsWith('Up') ? 'running' : 'stopped';
      }
    });

    // Build the final array matching the exact structure your React dashboard expects
    const containers = TARGET_CONTAINERS.map(target => ({
      name: target.displayName,
      status: dockerState[target.containerName] || 'stopped' // Default to stopped if container doesn't exist yet
    }));

    return containers;

  } catch (error) {
    console.error('Failed to fetch Docker container status:', error);
    
    // If Docker is unreachable or errors out, return 'unknown' rather than crashing the API
    return TARGET_CONTAINERS.map(target => ({
      name: target.displayName,
      status: 'unknown'
    }));
  }
}