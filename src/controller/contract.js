import {Types} from 'mongoose';
import Contract from '../model/contract';
import User from '../model/user';
import {errorHandler, mongooseErrorsCode} from '../utils/errors';
import {amICreditorOrDebtor} from "../middleware/validations";
import {isValidNewStatus, isValidRequester} from "../utils/validations";
import {buildResponse, codeMessages, setLinks} from "../utils/responses";
import mongoosePaginateOptions from "../utils/mongoosePaginateOptions";

const postContract = (req, res) => {

    let userCreditor = null;
    let userDebtor = null;
    let finalResponse = null;

    User.find({email: req.body.creditor}).then((responseCreditor) => {
        if (0 === responseCreditor.length) {
            const err = {message: codeMessages[422] + '. Creditor doesn\'t exist'};
            return res.status(422).json(errorHandler(err));
        }

        userCreditor = responseCreditor[0];

        User.find({email: req.body.debtor}).then((responseDebtor) => {
            if (0 === responseDebtor.length) {
                const err = {message: codeMessages[422] + '. Debtor doesn\'t exist'};
                return res.status(422).json(errorHandler(err));
            }

            userDebtor = responseDebtor[0];

            const created = Date.now();
            const creditorId = userCreditor._id;
            const debtorId = userDebtor._id;
            const {concept, payment} = req.body;
            const data = Object.assign({}, {concept, payment, creditorId, debtorId, created});

            let contract = Contract();
            contract = Object.assign(contract, data);

            contract.save().then((responseContract) => {
                    const {_id, created, concept, payment, status} = responseContract;
                    finalResponse = {_id, created, concept, payment, status};

                    userCreditor.contractsCreditor.push(responseContract);
                    userCreditor.save((res) => {
                    }, (err) => {
                        console.log(err);
                    });

                    userDebtor.contractsDebtor.push(responseContract);
                    userDebtor.save((res) => {
                    }, (err) => {
                        console.log(err);
                    });

                    res.status(201).json(setLinks(req, buildResponse(finalResponse)));

                }, (err) => {
                    res.status(err.status || 500).json(errorHandler(err));
                }
            );

        }, (err) => {
            res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
        });
    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });

};

const changeContractStatus = (req, res) => {
    Contract.findById(req.params.idContract).then(contract => {

        const newStatus = req.body.status;
        const currentStatus = contract.status;
        const userRequester = req.params.id;
        const userTypeRequester = contract.creditorId.toString() === userRequester ?
            'creditor' :
            contract.debtorId.toString() === userRequester ? 'debtor' : 'unknown';

        if (!isValidNewStatus(newStatus, currentStatus)) {
            return res.status(400).json({
                message: codeMessages[400] +
                `. You can't change status to ${newStatus} if current status is ${currentStatus}.`
            });
        }

        if (!isValidRequester(userTypeRequester, newStatus)) {
            return res.status(400).json({
                message: codeMessages[400] +
                `. Only a creditor can change status to 'cleared' and only a debtor to 'accepted'.`
            });
        }

        contract.status = newStatus;

        contract.save().then(contract => {
            res.status(200).json(setLinks(req, buildResponse(contract)));
        }, err => {
            res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
        });

    }, err => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });
};

const getContract = (req, res) => {
    const queryOptions = {
        select: '_id creditorId debtorId created concept payment status',
        populateCreditor: 'creditorId',
        populateDebtor: 'debtorId',
        populateSelect: 'email name'
    };

    Contract.findById(req.params.idContract)
        .select(queryOptions.select)
        .populate(queryOptions.populateCreditor, queryOptions.populateSelect)
        .populate(queryOptions.populateDebtor, queryOptions.populateSelect)
        .then((response) => {

            if (!amICreditorOrDebtor(response, req.params.id)) {
                return res.status(403).json({"message": codeMessages[403]});
            }

            // Don't send creditor's and debtor's id
            const {_id, creditorId, debtorId, created, concept, payment, status} = response;
            const creditor = Object.assign({}, {email: creditorId.email, name: creditorId.name});
            const debtor = Object.assign({}, {email: debtorId.email, name: debtorId.name});
            const contract = {_id, creditor, debtor, created, concept, payment, status};

            res.status(200).json(setLinks(req, buildResponse(contract)));

        }, (err) => {
            res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
        });
};

const getContractsByCreditor = (req, res) => {
    const ObjectId = Types.ObjectId;
    const creditorId = ObjectId(req.params.id);

    const query = {creditorId};
    const options = mongoosePaginateOptions(req);
    options.select = '_id created concept payment status';

    Contract.paginate(query, options).then((response) => {

        res.status(200).json(setLinks(req, buildResponse(response)));

    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });
};

const getContractsByDebtor = (req, res) => {
    const ObjectId = Types.ObjectId;
    const debtorId = ObjectId(req.params.id);

    const query = {debtorId};
    const options = mongoosePaginateOptions(req);
    options.select = '_id created concept payment status';

    Contract.paginate(query, options).then((response) => {

        res.status(200).json(setLinks(req, buildResponse(response)));

    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });
};

export {postContract, changeContractStatus, getContract, getContractsByCreditor, getContractsByDebtor};
