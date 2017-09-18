import test from 'tape';
import request from 'supertest';
import app from '../src/index';

test('-------- Controller: GET /', (assert) => {
    const url = '/';
    const message = 'Status must be 200 and response must match with the expected simple message';
    const expected = {message: 'Server up!!'};

    request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(
            (res) => {
                assert.deepEqual(res.body, expected, message);
                assert.end();
            }, (err) => {
                assert.fail(err.message);
                assert.end();
            }
        );
});

test('-------- Controller: POST /user', (assert) => {
    const url = '/user';
    const message = 'Status must be 201 (created) and response must be void';
    const expected = {};

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(url)
        .send(user)
        .expect(201)
        .then(
            (res) => {
                assert.deepEqual(res.body, expected, message);
                assert.end();
            }, (err) => {
                assert.fail(err.message);
                assert.end();
            }
        );
});

app.serverListening.close();
