import fs from 'fs/promises';
import path from 'path';

//this file is to read the deployment.json file created by GitHub Actions and return the deployment status to the frontend 

export async function getDeploymentStatus() {
  const filePath = path.resolve(process.cwd(), 'deployment.json');

  try {
    // Try to read the file created by GitHub Actions
    const data = await fs.readFile(filePath, 'utf-8');
    const deploymentInfo = JSON.parse(data);

    return {
      version: deploymentInfo.version,
      time: deploymentInfo.time,
      status: deploymentInfo.status,
      steps: [
        { label: 'Code commit', completed: true },
        { label: 'Build Docker Image', completed: true },
        { label: 'Test', completed: true },
        { label: 'Deploy to EC2', completed: true },
        { label: 'Health Check', completed: deploymentInfo.status === 'successful' }
      ]
    };
  } catch (error) {
    // If the file doesn't exist yet, return the default structure
    return {
      version: 'unknown',
      time: null,
      status: 'unknown',
      steps: []
    };
  }
}