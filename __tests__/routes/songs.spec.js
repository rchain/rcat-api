const request = require('supertest');
const app = require('../../app');
const { createJwtToken } = require('../helper');
let auth = {};

describe('Test GET /status', () => {

    beforeAll(async () => {
        auth.token = createJwtToken();
    });

    test('It should return 401 if not authorized', (done) => {
        request(app).get('/songs').then((response) => {
            expect(response.statusCode).toBe(401);
            done();
        });
    });

    test('It should response the GET method', async () => {
        const response = await request(app)
            .get('/songs')
            // add an authorization header with the token
            .set("authorization", auth.token);
        expect(response.statusCode).toBe(200);
    });
});