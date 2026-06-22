const assert = require('node:assert/strict');
const test = require('node:test');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
});

const { createdResponse, handleApiError, successResponse } = require('../lib/api-helpers');

test('successResponse includes success, data and message', async () => {
  const response = successResponse({ id: 'ok' });
  const body = await response.json();

  assert.deepEqual(body, {
    success: true,
    data: { id: 'ok' },
    message: 'OK',
  });
});

test('createdResponse uses created status and message', async () => {
  const response = createdResponse({ id: 'new' });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.message, 'Criado com sucesso');
});

test('unexpected errors return a generic 500 response', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';

  const response = handleApiError(new Error('password=secret database connection failed'));
  const body = await response.json();

  process.env.NODE_ENV = previousNodeEnv;

  assert.equal(response.status, 500);
  assert.equal(body.code, 'INTERNAL_ERROR');
  assert.doesNotMatch(body.error, /password=secret/);
});
