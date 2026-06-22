const assert = require('node:assert/strict');
const test = require('node:test');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
});

const { generateToken, verifyToken } = require('../lib/jwt');

test('JWT uses the configured secret', () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-secret';

  const token = generateToken({
    userId: 'user-1',
    email: 'teste@nands.com',
    role: 'USER',
  });
  const payload = verifyToken(token);

  process.env.JWT_SECRET = previousSecret;

  assert.equal(payload.userId, 'user-1');
  assert.equal(payload.role, 'USER');
});

test('JWT secret is mandatory in production', () => {
  const previousSecret = process.env.JWT_SECRET;
  const previousNodeEnv = process.env.NODE_ENV;
  delete process.env.JWT_SECRET;
  process.env.NODE_ENV = 'production';

  assert.throws(
    () =>
      generateToken({
        userId: 'user-1',
        email: 'teste@nands.com',
        role: 'USER',
      }),
    /JWT_SECRET/
  );

  process.env.JWT_SECRET = previousSecret;
  process.env.NODE_ENV = previousNodeEnv;
});
