const assert = require('node:assert/strict');
const test = require('node:test');
const { NextResponse } = require('next/server');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' }
});

const { clearAuthCookie, setAuthCookie } = require('../lib/auth-cookie');

test('setAuthCookie writes an HttpOnly auth cookie', () => {
  const response = setAuthCookie(NextResponse.json({ ok: true }), 'token_123');
  const header = response.headers.get('set-cookie') || '';

  assert.match(header, /auth_token=token_123/);
  assert.match(header, /HttpOnly/);
  assert.match(header, /SameSite=lax/i);
  assert.match(header, /Path=\//);
});

test('clearAuthCookie expires the auth cookie', () => {
  const response = clearAuthCookie(NextResponse.json({ ok: true }));
  const header = response.headers.get('set-cookie') || '';

  assert.match(header, /auth_token=/);
  assert.match(header, /Max-Age=0/);
});
