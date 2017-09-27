import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: POST /user (400 - Bad request - No password)', (assert) => {
    const url = '/user';
    const message = 'Status must be 400 if pass is empty';
    const statusCodeExpected = 400;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: ''
    };

    request(app)
        .post(url)
        .send(user)
        .expect(statusCodeExpected)
        .then(
            () => {
                assert.pass(message);
                assert.end();
            }, (err) => {
                assert.fail(err.message);
                assert.end();
            }
        );
});

test('-------- Controller: POST /user (409 - Conflict - The email is already registered)', (assert) => {
    const url = '/user';
    const message = 'Status must be 409 if the email is already registered';
    const statusCodeExpected = 409;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(url)
        .send(user)
        .then(
            () => {
                request(app)
                    .post(url)
                    .send(user)
                    .expect(statusCodeExpected)
                    .then(
                        () => {
                            assert.pass(message);
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

test('-------- Controller: POST /user', (assert) => {
    const url = '/user';
    const message = 'Status must be 201 (created) and response must be void';
    const statusCodeExpected = 201;

    const user = {
        name: 'TestUserWithANameVeryLong' + Date.now(),
        email: 'mytestuser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(url)
        .send(user)
        .expect(statusCodeExpected)
        .then(
            (res) => {
                const {name, email} = res.body;
                assert.deepEqual(
                    Object.assign({}, {name, email}),
                    Object.assign({}, {name: user.name, email: user.email}),
                    message
                );
                assert.end();
            }, (err) => {
                assert.fail(err.message);
                assert.end();
            }
        );
});