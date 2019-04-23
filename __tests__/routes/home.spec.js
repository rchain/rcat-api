const request = require('supertest');
const app = require('../../app');

const data = [];
describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            // console.log('response >>>>>', response);
            expect(response.statusCode).toEqual(200);
            done();
        });
    });
});