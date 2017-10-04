import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: GET /user/:id/contract/:idContract', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 200;
    const messageExpectedStatusCode = 'Status must be 200';
    const messageExpectedPayment = 'Payment must match';
    const messageExpectedConcept = 'Concept must match';
    const messageExpectedCreditorEmail = 'Creditor\'s email must match';
    const messageExpectedDebtorEmail = 'Debtor\'s email must match';
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
        concept: 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
        payment: 'Another 2kg hamburger with chips and beer',
        status: 'waiting'
    };

    let token = '';

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
                                    concept: contract.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract.payment
                                })
                                .then((res) => {
                                    request(app)
                                        .get('/user/' + idUserCreditor + '/contract/' + res.body._id)
                                        .set('Authorization', 'Bearer ' + token)
                                        .expect(statusCodeExpected)
                                        .then((res) => {
                                            assert.pass(messageExpectedStatusCode);
                                            assert.equal(res.body.concept, contract.concept, messageExpectedConcept);
                                            assert.equal(res.body.payment, contract.payment, messageExpectedPayment);
                                            assert.equal(res.body.status, contract.status, messageStatusContractExpected);
                                            assert.equal(res.body.creditor.email, userCreditor.email, messageExpectedCreditorEmail);
                                            assert.equal(res.body.debtor.email, userDebtor.email, messageExpectedDebtorEmail);
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
});

test('-------- Controller: GET /user/:id/contract/:idContract (forbidden access)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const messageExpectedStatusCode = 'Status 403: Forbidden access to the requested resource if you aren\'t the creditor or the debtor';
    const statusCodeExpected = 403;

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

    let idUserAnotherCreditor = null;
    const userAnotherCreditor = {
        name: 'AnotherCreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'anotherCreditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idContract = null;

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
                        .post(urlPostUser)
                        .send(userAnotherCreditor)
                        .then((res) => {
                            idUserAnotherCreditor = res.body._id;
                            request(app)
                                .post(urlLogin)
                                .send({email: userCreditor.email, pass: userCreditor.pass})
                                .then((res) => {
                                    request(app)
                                        .post('/user/' + idUserCreditor + '/contract')
                                        .set('Authorization', 'Bearer ' + res.body.token)
                                        .send({
                                            concept: 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                                            creditor: userCreditor.email,
                                            debtor: userDebtor.email,
                                            payment: 'Another 2kg hamburger with chips and beer'
                                        })
                                        .then((res) => {
                                            idContract = res.body._id;
                                            request(app)
                                                .post(urlLogin)
                                                .send({
                                                    email: userAnotherCreditor.email,
                                                    pass: userAnotherCreditor.pass
                                                })
                                                .then((res) => {
                                                    request(app)
                                                        .get('/user/' + idUserAnotherCreditor + '/contract/' + idContract)
                                                        .set('Authorization', 'Bearer ' + res.body.token)
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

test('-------- Controller: GET /user/:id/contract/:idContract (unauthorized access)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const messageExpectedStatusCode = 'Status 401: Unauthorized access to the requested resource if you don\'t provide a valid token';
    const statusCodeExpected = 401;

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
                                    concept: 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: 'Another 2kg hamburger with chips and beer'
                                })
                                .then((res) => {
                                    request(app)
                                        .get('/user/' + idUserCreditor + '/contract/' + res.body._id)
                                        .set('Authorization', 'Bearer ')
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
});
