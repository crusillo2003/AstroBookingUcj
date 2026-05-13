import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

const port = Number(process.env.PORT ?? 3000);
let serverProcess;

function waitForServerReady(process) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Server did not start within 10 seconds'));
    }, 10000);

    process.stdout.on('data', (chunk) => {
      const message = chunk.toString();
      if (message.includes('AstroBookingUcj API is running')) {
        clearTimeout(timeout);
        resolve();
      }
    });

    process.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    process.on('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server process exited early with code ${code}`));
    });
  });
}

test.beforeAll(async () => {
  serverProcess = spawn('npx', ['tsx', 'src/index.ts'], {
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  
  await waitForServerReady(serverProcess);
});

test.afterAll(async () => {
  console.log("run run run... Killing: "+ serverProcess.kill());
  if (!serverProcess) return;
  serverProcess.kill();
});

test('health endpoint returns ok', async ({ request }) => {
  const response = await request.get(`http://localhost:${port}/health`);
  console.log('Respuesta: ', response);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(typeof body.uptime).toBe('number');
  expect(typeof body.timestamp).toBe('string');
});
