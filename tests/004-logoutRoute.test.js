import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: GET /logout', (assert) => {
    const urlLogout = '/logout';
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const messageExpectedStatusCode = 'Status must be 204';
    const statusCodeExpected = 204;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(urlPostUser)
        .send(user)
        .then(() => {
            request(app)
                .post(urlLogin)
                .send({email: user.email, pass: user.pass})
                .then(res => {
                    request(app)
                        .get(urlLogout)
                        .set('Authorization', 'Bearer ' + res.body._data.token)
                        .expect(statusCodeExpected)
                        .then(() => {
                            assert.pass(messageExpectedStatusCode);
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

test('-------- Controller: GET /logout (no \'Authorization\' header)', (assert) => {
    const urlLogout = '/logout';
    const messageExpectedStatusCode = 'With no \'Authorization\' header, status must be 401';
    const statusCodeExpected = 401;

    request(app)
        .get(urlLogout)
        .expect(statusCodeExpected)
        .then(() => {
            assert.pass(messageExpectedStatusCode);
            assert.end();
        }, (err) => {
            assert.fail(err.message);
            assert.end();
        });
});

test('-------- Controller: GET /logout (using a revoked token)', (assert) => {
    const urlLogout = '/logout';
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const messageExpectedStatusCode = 'Status must be 401 when you want use a revoked token';
    const statusCodeExpected = 401;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let token = null;

    request(app)
        .post(urlPostUser)
        .send(user)
        .then(() => {
            request(app)
                .post(urlLogin)
                .send({email: user.email, pass: user.pass})
                .then(res => {
                    token = res.body._data.token;
                    request(app)
                        .get(urlLogout)
                        .set('Authorization', 'Bearer ' + token)
                        .then(res => {
                            request(app)
                                .get(urlLogout)
                                .set('Authorization', 'Bearer ' + token)
                                .expect(statusCodeExpected)
                                .then(() => {
                                    assert.pass(messageExpectedStatusCode);
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
        }, (err) => {
            assert.fail(err.message);
            assert.end();
        });
});