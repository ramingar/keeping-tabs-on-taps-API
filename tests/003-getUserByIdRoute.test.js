import test from 'tape';
import request from 'supertest';
import app from '../src/index';

test('-------- Controller: GET /user/:id', (assert) => {
    const url = '/user';
    const messageExpectedStatusCode = 'Status must be 200 when you are getting an existing user';
    const messageExpectedName = 'The name must match with the expected name';
    const messageExpectedEmail = 'The email must match with the expected email';
    const statusCodeExpected = 200;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(url)
        .send(user)
        .then(
            (res) => {
                request(app)
                    .get(url + '/' + res.body._id)
                    .expect(statusCodeExpected)
                    .then(
                        () => {
                            assert.pass(messageExpectedStatusCode);
                            assert.equal(res.body.name, user.name, messageExpectedName);
                            assert.equal(res.body.email, user.email, messageExpectedEmail);
                            assert.end();
                        }, (err) => {
                            assert.fail(err.message);
                            assert.end();
                        }
                    );
            }, (err) => {
                assert.fail(err.message);
                assert.end();
            }
        );
});

app.serverListening.close();
