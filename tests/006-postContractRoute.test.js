import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: POST /contract', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 201;
    const messageExpectedStatusCode = 'Status must be 201';
    const messageExpectedConcept = 'Concept must match';
    const messageExpectedPayment = 'Payment must match';
    const messageStatusContractExpected = 'Contract\'s status must match';

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

    const contract = {
        payment: 'Another 2kg hamburger with chips and beer',
        concept: 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
        status: 'waiting'
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
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + res.body.token)
                                .send({
                                    concept: contract.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract.payment
                                })
                                .expect(statusCodeExpected)
                                .then((res) => {
                                    assert.pass(messageExpectedStatusCode);
                                    assert.equal(res.body.payment, contract.payment, messageExpectedPayment);
                                    assert.equal(res.body.concept, contract.concept, messageExpectedConcept);
                                    assert.equal(res.body.status, contract.status, messageStatusContractExpected);
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

test('-------- Controller: POST /contract (422 - userDebtor doesn\'t exist)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 422;
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
                        .post('/user/' + idUserCreditor + '/contract')
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

test('-------- Controller: POST /contract (403 - it is forbidden to create a contract for another user than me)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 403;
    const messageExpectedStatusCode = 'Status must be 403 when creditor is not the user creating the contract';

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
                                .post('/user/' + idUserCreditor + '/contract')
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