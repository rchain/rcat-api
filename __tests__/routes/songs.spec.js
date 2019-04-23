const request = require('supertest');
const app = require('../../app');
const { createJwtToken } = require('../helper');
const Song = require('../../models/song');
const mockingoose = require('mockingoose').default;
let auth = {};

describe('Test GET /status', () => {

    test('...', () => {});

    // beforeAll(async () => {
    //     auth.token = createJwtToken();
    // });
    //
    // test('It should return 401 if not authorized', (done) => {
    //     request(app).get('/songs').then((response) => {
    //         expect(response.statusCode).toEqual(401);
    //         done();
    //     });
    // });
    //
    // test('It should response the GET method', async () => {
    //     mockingoose(Song).toReturn([], 'find');
    //     const response = await request(app)
    //         .get('/songs')
    //         // add an authorization header with the token
    //         .set("authorization", auth.token);
    //     expect(response.statusCode).toEqual(200);
    // });
});