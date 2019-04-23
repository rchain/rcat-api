const request = require('supertest');
const app = require('../../app');
const { createJwtToken } = require('../helper');
const mockingoose = require('mockingoose').default;
const Genre = require('../../models/genre');
let auth = {};

const data = [
    {
        "_id": "5cbeed07ad9a60700788fb29",
        "name": "Avant Garde",
        "created_at": "2019-04-23T10:46:31.702Z",
        "updated_at": "2019-04-23T10:46:31.702Z",
        "__v": 0
    },
    {
        "_id": "5cbeed07ad9a60700788fb2a",
        "name": "Blues",
        "created_at": "2019-04-23T10:46:31.702Z",
        "updated_at": "2019-04-23T10:46:31.702Z",
        "__v": 0
    },
    {
        "_id": "5cbeed07ad9a60700788fb32",
        "name": "Holiday",
        "created_at": "2019-04-23T10:46:31.703Z",
        "updated_at": "2019-04-23T10:46:31.703Z",
        "__v": 0
    }
];

describe('Test GET /genres', () => {

    test('...', () => {});

    // beforeAll(async () => {
    //     auth.token = createJwtToken();
    // });
    //
    // test('It should response the GET method', async (done) => {
    //
    //     mockingoose(Genre).toReturn(data, 'find');
    //
    //     const response = await request(app)
    //         .get('/genres')
    //         .set("authorization", auth.token);
    //     expect(response.statusCode).toEqual(200);
    //     done();
    // });
});
