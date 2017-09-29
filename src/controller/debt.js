import {Types} from 'mongoose';
import Debt from '../model/debt';
import User from '../model/user';
import {errorHandler, mongooseErrorsCode} from '../utils/errors';
import {amICreditorOrDebtor} from "../middleware/validations";
import responses from "../utils/responses";
import mongoosePaginateOptions from "../utils/mongoosePaginateOptions";

const postDebt = (req, res) => {

    let userCreditor = null;
    let userDebtor = null;
    let finalResponse = null;

    User.find({email: req.body.creditor}).then((responseCreditor) => {
        if (0 === responseCreditor.length) {
            const err = {message: responses[422] + '. Creditor doesn\'t exist'};
            return res.status(422).json(errorHandler(err));
        }

        userCreditor = responseCreditor[0];

        User.find({email: req.body.debtor}).then((responseDebtor) => {
            if (0 === responseDebtor.length) {
                const err = {message: responses[422] + '. Debtor doesn\'t exist'};
                return res.status(422).json(errorHandler(err));
            }

            userDebtor = responseDebtor[0];

            const created = Date.now();
            const creditorId = userCreditor._id;
            const debtorId = userDebtor._id;
            const {concept, payment} = req.body;
            const data = Object.assign({}, {concept, payment, creditorId, debtorId, created});

            let debt = Debt();
            debt = Object.assign(debt, data);

            debt.save().then((responseDebt) => {
                    const {_id, created, concept, payment, status} = responseDebt;
                    finalResponse = {_id, created, concept, payment, status};

                    userCreditor.debtsCreditor.push(responseDebt);
                    userCreditor.save((res) => {
                    }, (err) => {
                        console.log(err);
                    });

                    userDebtor.debtsDebtor.push(responseDebt);
                    userDebtor.save((res) => {
                    }, (err) => {
                        console.log(err);
                    });

                    res.status(201).json(finalResponse);

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

const getDebt = (req, res) => {
    Debt.findById(req.params.idDebt).then((response) => {

        if (!amICreditorOrDebtor(response, req.params.id)) {
            return res.status(403).json({"message": responses[403]});
        }

        const {_id, created, creditor, debtor, concept, payment, status} = response;
        res.status(200).json({_id, created, creditor, debtor, concept, payment, status});
    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });
};

const getDebtsCreditor = (req, res) => {
    const ObjectId = Types.ObjectId;
    const creditorId = ObjectId(req.params.id);

    const query = {creditorId};
    const options = mongoosePaginateOptions(req);
    options.select = '_id created concept payment status';

    Debt.paginate(query, options).then((response) => {

        res.status(200).json(response);

    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });
};

export {postDebt, getDebt, getDebtsCreditor};
