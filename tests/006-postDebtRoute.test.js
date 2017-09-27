import test from 'tape';
import request from 'supertest';
import {app, server} from '../src/index';

test('-------- Controller: POST /debt', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusDebtExpected = 'waiting';
    const statusCodeExpected = 201;
    const messageExpectedStatusCode = 'Status must be 201';
    const messageExpectedDebtor = 'Debtor must match';
    const messageExpectedCreditor = 'Creditor must match';
    const messageStatusDebtExpected = 'Debt\'s status must match';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    const userDebtor = {
        name: 'DebtorTestUserWithANameVeryLong' + Date.now(),
        email: 'debtorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(() => {
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then((res) => {
                    idUserCreditor = res.body._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then((res) => {
                            request(app)
                                .post('/user/' + idUserCreditor + '/debt')
                                .set('Authorization', 'Bearer ' + res.body.token)
                                .send({
                                    concept: 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: 'Another 2kg hamburger with chips and beer'
                                })
                                .expect(statusCodeExpected)
                                .then((res) => {
                                    assert.pass(messageExpectedStatusCode);
                                    assert.equal(res.body.creditor, userCreditor.email, messageExpectedCreditor);
                                    assert.equal(res.body.debtor, userDebtor.email, messageExpectedDebtor);
                                    assert.equal(res.body.status, statusDebtExpected, messageStatusDebtExpected);
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
});

test('-------- Controller: POST /debt (400 - userDebtor doesn\'t exist)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 400;
    const messageExpectedStatusCode = 'Status must be 404 when debtor doesn\'t exist';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(urlPostUser)
        .send(userCreditor)
        .then((res) => {
            idUserCreditor = res.body._id;
            request(app)
                .post(urlLogin)
                .send({email: userCreditor.email, pass: userCreditor.pass})
                .then((res) => {
                    request(app)
                        .post('/user/' + idUserCreditor + '/debt')
                        .set('Authorization', 'Bearer ' + res.body.token)
                        .send({
                            concept: '-----------',
                            creditor: userCreditor.email,
                            debtor: 'aD3bt0rWhatD03snt3x1sts',
                            payment: '-----------'
                        })
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

test('-------- Controller: POST /debt (403 - it is forbidden to create a debt for another user than me)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 403;
    const messageExpectedStatusCode = 'Status must be 403 when creditor is not the user creating the debt';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    const userDebtor = {
        name: 'DebtorTestUserWithANameVeryLong' + Date.now(),
        email: 'debtorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(() => {
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then((res) => {
                    idUserCreditor = res.body._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then((res) => {
                            request(app)
                                .post('/user/' + idUserCreditor + '/debt')
                                .set('Authorization', 'Bearer ' + res.body.token)
                                .send({
                                    concept: '-----------',
                                    creditor: 'blablablabla',
                                    debtor: userDebtor.email,
                                    payment: '-----------'
                                })
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
});

server.close();
