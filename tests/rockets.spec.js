import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

const port = Number(process.env.PORT ?? 3001);
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

test.describe.serial('Rocket Management API', () => {
  test.beforeAll(async () => {
    serverProcess = spawn('npx', ['tsx', 'src/index.ts'], {
      shell: true,
      env: { ...process.env, NODE_ENV: 'development', PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    await waitForServerReady(serverProcess);
  });

  test.afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  let rocketId;

  test('creates a rocket and returns 201', async ({ request }) => {
    const response = await request.post(`http://localhost:${port}/api/rockets`, {
      data: {
        name: 'Apollo 11',
        range: 'orbital',
        capacity: 5,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(body.name).toBe('Apollo 11');
    expect(body.range).toBe('orbital');
    expect(body.capacity).toBe(5);
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();

    rocketId = body.id;
  });

  test('retrieves rocket by id', async ({ request }) => {
    const response = await request.get(`http://localhost:${port}/api/rockets/${rocketId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.id).toBe(rocketId);
    expect(body.name).toBe('Apollo 11');
  });

  test('updates rocket successfully', async ({ request }) => {
    const response = await request.put(`http://localhost:${port}/api/rockets/${rocketId}`, {
      data: {
        name: 'Apollo 11 Updated',
        range: 'interplanetary',
        capacity: 6,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Apollo 11 Updated');
    expect(body.range).toBe('interplanetary');
    expect(body.capacity).toBe(6);
  });

  test('returns validation errors for invalid rocket payload', async ({ request }) => {
    const response = await request.post(`http://localhost:${port}/api/rockets`, {
      data: {
        name: 'Bad Rocket',
        range: 'unknown',
        capacity: 25,
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors).toBeTruthy();
    expect(body.errors.range).toBeTruthy();
    expect(body.errors.capacity).toBeTruthy();
  });

  test('lists rockets with range and capacity filtering', async ({ request }) => {
    const response = await request.get(`http://localhost:${port}/api/rockets?range=interplanetary&capacity=6&page=1&pageSize=10`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.items).toBeInstanceOf(Array);
    expect(body.items.length).toBeGreaterThanOrEqual(1);
    expect(body.meta.page).toBe(1);
    expect(body.meta.pageSize).toBe(10);
    expect(body.items[0].range).toBe('interplanetary');
    expect(body.items[0].capacity).toBeGreaterThanOrEqual(6);
  });

  test('deletes rocket and returns 204', async ({ request }) => {
    const deleteResponse = await request.delete(`http://localhost:${port}/api/rockets/${rocketId}`);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await request.get(`http://localhost:${port}/api/rockets/${rocketId}`);
    expect(getResponse.status()).toBe(404);
  });
});
