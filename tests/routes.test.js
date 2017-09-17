import test from 'tape';
import request from 'supertest';
import express from 'express';
import {index} from '../src/controller';

const app = express();

test('-------- Controller: GET /', (assert) => {
    const url = '/';
    const message = 'Response doesn\'t match with the expected simple message';
    const expected = {message: 'Server up!!'};

    app.get(url, function (req, res) {
        index(req, res);
    });

    request(app)
        .get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            if (err) assert.fail(err.message);

            assert.deepEqual(res.body, expected, message);
        });

    assert.end();
});
