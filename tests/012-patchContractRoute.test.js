import test from 'tape';
import request from 'supertest';
import {app} from '../src/index';

test('-------- Controller: PATCH /user/:id/contract/:idContract (accepted)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 200;
    const messageExpectedStatusCode = 'Status must be 200';
    const statusContractExpected = 'accepted';
    const messageStatusContractExpected = 'Contract\'s status must match';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUserDebtor = null;
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

    let tokenCreditor = null;
    let tokenDebtor = null;
    let idContract = null;

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(res => {
            idUserDebtor = res.body._data._id;
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then(res => {
                    idUserCreditor = res.body._data._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then(res => {
                            tokenCreditor = res.body._data.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(res => {
                                    idContract = res.body._data._id;
                                    request(app)
                                        .post(urlLogin)
                                        .send({email: userDebtor.email, pass: userDebtor.pass})
                                        .then(res => {
                                            tokenDebtor = res.body._data.token;
                                            request(app)
                                                .patch('/user/' + idUserDebtor + '/contract/' + idContract)
                                                .set('Authorization', 'Bearer ' + tokenDebtor)
                                                .send({
                                                    status: 'accepted'
                                                })
                                                .expect(statusCodeExpected)
                                                .then(() => {
                                                    assert.pass(messageExpectedStatusCode);
                                                    request(app)
                                                        .get('/user/' + idUserDebtor + '/contract/' + idContract)
                                                        .set('Authorization', 'Bearer ' + tokenDebtor)
                                                        .then(res => {
                                                            assert.equal(res.body._data.status,
                                                                statusContractExpected,
                                                                messageStatusContractExpected
                                                            );
                                                            assert.end();
                                                        }, err => {
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
});

test('-------- Controller: PATCH /user/:id/contract/:idContract (cleared)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 200;
    const messageExpectedStatusCode = 'Status must be 200';
    const statusContractExpected = 'cleared';
    const messageStatusContractExpected = 'Contract\'s status must match';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUserDebtor = null;
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

    let tokenCreditor = null;
    let tokenDebtor = null;
    let idContract = null;

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(res => {
            idUserDebtor = res.body._data._id;
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then(res => {
                    idUserCreditor = res.body._data._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then(res => {
                            tokenCreditor = res.body._data.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(res => {
                                    idContract = res.body._data._id;
                                    request(app)
                                        .post(urlLogin)
                                        .send({email: userDebtor.email, pass: userDebtor.pass})
                                        .then(res => {
                                            tokenDebtor = res.body._data.token;
                                            request(app)
                                                .patch('/user/' + idUserDebtor + '/contract/' + idContract)
                                                .set('Authorization', 'Bearer ' + tokenDebtor)
                                                .send({
                                                    status: 'accepted'
                                                })
                                                .then(() => {
                                                    request(app)
                                                        .post(urlLogin)
                                                        .send({email: userCreditor.email, pass: userCreditor.pass})
                                                        .then(res => {
                                                            request(app)
                                                                .patch('/user/' + idUserCreditor + '/contract/' + idContract)
                                                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                                                .send({
                                                                    status: 'cleared'
                                                                })
                                                                .expect(statusCodeExpected)
                                                                .then(() => {
                                                                    assert.pass(messageExpectedStatusCode);

                                                                    request(app)
                                                                        .get('/user/' + idUserCreditor + '/contract/' + idContract)
                                                                        .set('Authorization', 'Bearer ' + tokenCreditor)
                                                                        .then(res => {
                                                                            assert.equal(res.body._data.status,
                                                                                statusContractExpected,
                                                                                messageStatusContractExpected
                                                                            );
                                                                            assert.end();
                                                                        }, err => {
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
        });
});

test('-------- Controller: PATCH /user/:id/contract/:idContract (bad request - changing to accepted)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 404;
    const messageExpectedStatusCode = 'Status must be 404. A creditor cannot change status to accepted.';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUserDebtor = null;
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

    let tokenCreditor = null;
    let idContract = null;

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(res => {
            idUserDebtor = res.body._data._id;
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then(res => {
                    idUserCreditor = res.body._data._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then(res => {
                            tokenCreditor = res.body._data.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(res => {
                                    idContract = res.body._data.id;
                                    request(app)
                                        .patch('/user/' + idUserCreditor + '/contract/' + idContract)
                                        .set('Authorization', 'Bearer ' + tokenCreditor)
                                        .send({
                                            status: 'accepted'
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
                }, (err) => {
                    assert.fail(err.message);
                    assert.end();
                });
        });
});

test('-------- Controller: PATCH /user/:id/contract/:idContract (bad request - changing to cleared)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 404;
    const messageExpectedStatusCode = 'Status must be 404. A debtor cannot change status to cleared.';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUserDebtor = null;
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

    let tokenCreditor = null;
    let tokenDebtor = null;
    let idContract = null;

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(res => {
            idUserDebtor = res.body._data._id;
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then(res => {
                    idUserCreditor = res.body._data._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then(res => {
                            tokenCreditor = res.body._data.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(res => {
                                    idContract = res.body._data.id;
                                    request(app)
                                        .post(urlLogin)
                                        .send({email: userDebtor.email, pass: userDebtor.pass})
                                        .then(res => {
                                            tokenDebtor = res.body._data.token;
                                            request(app)
                                                .patch('/user/' + idUserDebtor + '/contract/' + idContract)
                                                .set('Authorization', 'Bearer ' + tokenDebtor)
                                                .send({
                                                    status: 'accepted'
                                                })
                                                .then(() => {
                                                    request(app)
                                                        .patch('/user/' + idUserDebtor + '/contract/' + idContract)
                                                        .set('Authorization', 'Bearer ' + tokenDebtor)
                                                        .send({
                                                            status: 'cleared'
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

test('-------- Controller: PATCH /user/:id/contract/:idContract (forbidden - changing to accepted)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 403;
    const messageExpectedStatusCode = 'Status must be 403 when debtor is not the user updating the contract';

    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUserDebtor = null;
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

    let tokenCreditor = null;
    let tokenDebtor = null;
    let idContract = null;

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(res => {
            idUserDebtor = res.body._data._id;
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then(res => {
                    idUserCreditor = res.body._data._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then(res => {
                            tokenCreditor = res.body._data.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(res => {
                                    idContract = res.body._data._id;
                                    request(app)
                                        .post(urlLogin)
                                        .send({email: userDebtor.email, pass: userDebtor.pass})
                                        .then(res => {
                                            tokenDebtor = res.body._data.token;
                                            request(app)
                                                .patch('/user/' + idUserCreditor + '/contract/' + idContract)
                                                .set('Authorization', 'Bearer ' + tokenDebtor)
                                                .send({
                                                    status: 'accepted'
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

test('-------- Controller: PATCH /user/:id/contract/:idContract (forbidden - changing to cleared)', (assert) => {
    const urlLogin = '/login';
    const urlPostUser = '/user';
    const statusCodeExpected = 403;
    const messageExpectedStatusCode = 'Status must be 403 when creditor is not the user updating the contract';


    let idUserCreditor = null;
    const userCreditor = {
        name: 'CreditorTestUserWithANameVeryLong' + Date.now(),
        email: 'creditorUser' + Date.now() + '@gmail.com',
        pass: '1111'
    };

    let idUserDebtor = null;
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

    let tokenCreditor = null;
    let tokenDebtor = null;
    let idContract = null;

    request(app)
        .post(urlPostUser)
        .send(userDebtor)
        .then(res => {
            idUserDebtor = res.body._data._id;
            request(app)
                .post(urlPostUser)
                .send(userCreditor)
                .then(res => {
                    idUserCreditor = res.body._data._id;
                    request(app)
                        .post(urlLogin)
                        .send({email: userCreditor.email, pass: userCreditor.pass})
                        .then(res => {
                            tokenCreditor = res.body._data.token;
                            request(app)
                                .post('/user/' + idUserCreditor + '/contract')
                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                .send({
                                    concept: contract1.concept,
                                    creditor: userCreditor.email,
                                    debtor: userDebtor.email,
                                    payment: contract1.payment
                                })
                                .then(res => {
                                    idContract = res.body._data._id;
                                    request(app)
                                        .post(urlLogin)
                                        .send({email: userDebtor.email, pass: userDebtor.pass})
                                        .then(res => {
                                            tokenDebtor = res.body._data.token;
                                            request(app)
                                                .patch('/user/' + idUserDebtor + '/contract/' + idContract)
                                                .set('Authorization', 'Bearer ' + tokenDebtor)
                                                .send({
                                                    status: 'accepted'
                                                })
                                                .then(() => {
                                                    request(app)
                                                        .post(urlLogin)
                                                        .send({email: userCreditor.email, pass: userCreditor.pass})
                                                        .then(res => {
                                                            request(app)
                                                                .patch('/user/' + idUserDebtor + '/contract/' + idContract)
                                                                .set('Authorization', 'Bearer ' + tokenCreditor)
                                                                .send({
                                                                    status: 'cleared'
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
});
