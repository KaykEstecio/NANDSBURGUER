"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
const database_1 = require("../src/config/database");
const supertest_1 = __importDefault(require("supertest"));
const app = (0, app_1.createApp)();
describe('Auth Routes', () => {
    beforeAll(async () => {
        await database_1.prisma.$connect();
    });
    afterAll(async () => {
        await database_1.prisma.$disconnect();
    });
    afterEach(async () => {
        await database_1.prisma.user.deleteMany();
    });
    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.user.email).toBe('test@example.com');
            expect(res.body.token).toBeDefined();
        });
        it('should not register user with duplicate email', async () => {
            await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User 2'
            });
            expect(res.statusCode).toBe(400);
        });
        it('should return 400 if missing required fields', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({
                email: 'test@example.com'
            });
            expect(res.statusCode).toBe(400);
        });
    });
    describe('POST /auth/login', () => {
        beforeEach(async () => {
            await (0, supertest_1.default)(app)
                .post('/auth/register')
                .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });
        });
        it('should login with valid credentials', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.user.email).toBe('test@example.com');
            expect(res.body.token).toBeDefined();
        });
        it('should not login with invalid password', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            expect(res.statusCode).toBe(401);
        });
        it('should not login with non-existent user', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            expect(res.statusCode).toBe(401);
        });
    });
});
//# sourceMappingURL=auth.test.js.map