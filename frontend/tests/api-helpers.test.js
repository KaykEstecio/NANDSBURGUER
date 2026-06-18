const assert = require('node:assert/strict');
const test = require('node:test');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' }
});

const { createdResponse, successResponse } = require('../lib/api-helpers');

test('successResponse includes success, data and message', async () => {
  const response = successResponse({ id: 'ok' });
  const body = await response.json();

  assert.deepEqual(body, {
    success: true,
    data: { id: 'ok' },
    message: 'OK'
  });
});

test('createdResponse uses created status and message', async () => {
  const response = createdResponse({ id: 'new' });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.message, 'Criado com sucesso');
});
