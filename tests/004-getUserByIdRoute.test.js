import test from 'tape';
import request from 'supertest';
import app from '../src/index';

test('-------- Controller: GET /user/:id', (assert) => {
    const urlUser = '/user';
    const urlLogin = '/login';
    const messageExpectedStatusCode = 'Status must be 200 when you are retrieving an existing user';
    const messageExpectedName = 'The name must match with the expected name';
    const messageExpectedEmail = 'The email must match with the expected email';
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
        .then(
            (res) => {
                idUser = res.body._id;
                request(app)
                    .post(urlLogin)
                    .send({email: user.email, pass: user.pass})
                    .then(
                        (res) => {
                            request(app)
                                .get(urlUser + '/' + idUser)
                                .set('Authorization', 'Bearer ' + res.body.token)
                                .expect(statusCodeExpected)
                                .then(
                                    (res) => {
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
            }, (err) => {
                assert.fail(err.message);
                assert.end();
            }
        );
});

app.serverListening.close();
