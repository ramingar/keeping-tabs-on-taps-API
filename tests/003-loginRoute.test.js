import test from 'tape';
import request from 'supertest';
import {app, server} from '../src/index';

test('-------- Controller: POST /login', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const messageExpectedStatusCode = 'Status must be 200 when you are signing in with an existing user credentials';
    const messageExpectedUser = 'The field \'user\' must match with the user email';
    const messageExpectedToken = 'The field \'token\' must have some value';
    const statusCodeExpected = 200;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(urlPostUser)
        .send(user)
        .then(
            () => {
                request(app)
                    .post(urlLogin)
                    .send({email: user.email, pass: user.pass})
                    .expect(statusCodeExpected)
                    .then(
                        (res) => {
                            assert.pass(messageExpectedStatusCode);
                            assert.equal(res.body.user, user.email, messageExpectedUser);
                            assert.notEqual(res.body.token, '', messageExpectedToken);
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

server.close();
