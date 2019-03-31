const request = require('supertest');
const app = require('../../app');

describe('Test GET /status', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/status').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});