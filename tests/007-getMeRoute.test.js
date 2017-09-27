import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: GET /me', (assert) => {
    const urlUser = '/user';
    const urlLogin = '/login';
    const urlMe = '/me';
    const messageExpectedStatusCode = 'StatusCode must be 200 when you are retrieving info of /me';
    const messageExpectedId = 'The id must match with the expected id';
    const statusCodeExpected = 200;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUser = null;

    request(app)
        .post(urlUser)
        .send(user)
        .then((res) => {
            idUser = res.body._id;
            request(app)
                .post(urlLogin)
                .send({email: user.email, pass: user.pass})
                .then((res) => {
                    request(app)
                        .get(urlMe)
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .expect(statusCodeExpected)
                        .then((res) => {
                            assert.pass(messageExpectedStatusCode);
                            assert.equal(res.body.user, idUser, messageExpectedId);
                            assert.end();
                        }, (err) => {
                            assert.fail(err.message);
                            assert.end();
                        });
                }, (err) => {
                    assert.fail(err.message);
                    assert.end();
                });
        }, (err) => {
            assert.fail(err.message);
            assert.end();
        });
});

test('-------- Controller: GET /me (unauthorized access)', (assert) => {
    const urlMe = '/me';
    const messageExpectedStatusCode = 'Status 401: Unauthorized access to the requested resource if you don\'t provide a valid token';
    const statusCodeExpected = 401;

    request(app)
        .get(urlMe)
        .set('Authorization', 'Bearer ')
        .expect(statusCodeExpected)
        .then(() => {
            assert.pass(messageExpectedStatusCode);
            assert.end();
        }, (err) => {
            assert.fail(err.message);
            assert.end();
        });
});