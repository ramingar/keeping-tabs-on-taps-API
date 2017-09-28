import Debt from '../model/debt';
import User from '../model/user';
import {errorHandler, mongooseErrorsCode} from '../utils/errors';
import {amICreditorOrDebtor} from "../middleware/validations";
import {getMyId} from "../middleware/auth";

const postDebt = (req, res) => {

    let creditorId = null;
    let debtorId = null;

    User.find({email: req.body.creditor}).then((response) => {
        if (0 === response.length) {
            const err = {message: 'Creditor doesn\'t exist'};
            return res.status(400).json(errorHandler(err));
        }

        creditorId = response[0]._id;
        User.find({email: req.body.debtor}).then((response) => {
            if (0 === response.length) {
                const err = {message: 'Debtor doesn\'t exist'};
                return res.status(400).json(errorHandler(err));
            }

            debtorId = response[0]._id;

            const created = Date.now();
            const {concept, payment, creditor, debtor} = req.body;
            const data = Object.assign({}, {concept, payment, creditor, debtor, creditorId, debtorId, created});

            let debt = Debt();
            debt = Object.assign(debt, data);

            debt.save().then((response) => {
                    const {_id, created, creditor, debtor, concept, payment, status} = response;
                    res.status(201).json({_id, created, creditor, debtor, concept, payment, status});
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

const getDebt = (req, res, config) => {
    Debt.findById(req.params.idDebt).then((response) => {

        if (!amICreditorOrDebtor(response, req.params.id)) {
            return res.status(403).json({"message": "Forbidden: access to the requested resource is forbidden"});
        }

        const {_id, created, creditor, debtor, concept, payment, status} = response;
        res.status(200).json({_id, created, creditor, debtor, concept, payment, status});
    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });
};

export {postDebt, getDebt};
