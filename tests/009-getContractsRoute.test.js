import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: GET /contract', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 200;
    const messageExpectedStatusCode = 'Status must be 200';
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

    const contract1 = {
        payment: '111 --- Another 2kg hamburger with chips and beer',
        concept: '222 --- We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
        status: 'waiting'
    };

    const contract2 = {
        payment: '222 --- Another 2kg hamburger with chips and beer',
        concept: '222 --- We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
        status: 'waiting'
    };

    let token = null;

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
                            token = res.body.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + token)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(() => {
                                    request(app)
                                        .post('/user/' + idUserCreditor + '/contract')
                                        .set('Authorization', 'Bearer ' + token)
                                        .send({
                                            concept: contract2.concept,
                                            creditor: userCreditor.email,
                                            debtor: userDebtor.email,
                                            payment: contract2.payment
                                        })
                                        .then(() => {
                                            request(app)
                                                .get('/user/' + idUserCreditor + '/contract')
                                                .set('Authorization', 'Bearer ' + token)
                                                .expect(statusCodeExpected)
                                                .then((res) => {
                                                    const responsedContract = res.body.docs[1];
                                                    assert.pass(messageExpectedStatusCode);
                                                    assert.equal(responsedContract.payment,
                                                        contract2.payment,
                                                        messageExpectedPayment
                                                    );
                                                    assert.equal(responsedContract.concept,
                                                        contract2.concept,
                                                        messageExpectedConcept
                                                    );
                                                    assert.equal(responsedContract.status,
                                                        contract2.status,
                                                        messageStatusContractExpected
                                                    );
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
                }, (err) => {
                    assert.fail(err.message);
                    assert.end();
                });
        });
});


test('-------- Controller: GET /contract (Unauthorized access)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 401;
    const messageExpectedStatusCode = 'Status must be 401 if token is not provided';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let token = null;

    request(app)
        .post(urlPostUser)
        .send(userCreditor)
        .then((res) => {
            idUserCreditor = res.body._id;
            request(app)
                .post(urlLogin)
                .send({email: userCreditor.email, pass: userCreditor.pass})
                .then((res) => {
                    token = res.body.token;
                    request(app)
                        .get('/user/' + idUserCreditor + '/contract')
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

test('-------- Controller: GET /contract (forbidden access)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const otherUserId = 11111111111111;
    const statusCodeExpected = 403;
    const messageExpectedStatusCode = 'Status must be 403 if you want retrieve contracts from other user';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let token = null;

    request(app)
        .post(urlPostUser)
        .send(userCreditor)
        .then((res) => {
            idUserCreditor = res.body._id;
            request(app)
                .post(urlLogin)
                .send({email: userCreditor.email, pass: userCreditor.pass})
                .then((res) => {
                    token = res.body.token;
                    request(app)
                        .get('/user/' + otherUserId + '/contract')
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
});