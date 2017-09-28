import RevokedToken from '../model/revokedToken';
import User from '../model/user';
import {errorHandler} from '../utils/errors';
import {getMyId} from "./auth";

const ownership = (req, res, config, next) => {
    const payload = getMyId(req.header('Authorization').slice(7), config);

    if (payload.id !== req.params.id) {
        return res.status(403).json({"message": "Forbidden: access to the requested resource is forbidden"});
    }

    next();
};

const isRevoked = (req, res, next) => {

    RevokedToken.find({tokenId: req.header('Authorization').slice(7)}).then((revokedToken) => {
        if (revokedToken.length > 0) {
            return res.status(401).json({
                "message": "The token has been revoked.",
                "error": {
                    "name": "UnauthorizedError",
                    "code": "revoked_token",
                    "status": 401
                }
            });
        } else {
            next();
        }
    }, () => {
        next();
    });
};

const creditorIsMe = (req, res, next) => {

    User.find({email: req.body.creditor}).then((response) => {

        if (0 === response.length) {
            const err = {message: 'Forbidden: creditor can\'t be another user than logged user'};
            return res.status(403).json(errorHandler(err));
        }

        if (response[0]._id.toString() !== req.params.id) {
            const err = {message: 'Forbidden: creditor can\'t be another user than logged user'};
            return res.status(403).json(errorHandler(err));
        }

        next();
    }, (err) => {
        return res.status(403).json(errorHandler(err));
    });


};

const amICreditorOrDebtor = (debt, me) => {
    const {creditorId, debtorId} = debt;

    if (creditorId.toString() === me) return 1;
    if (debtorId.toString() === me) return 2;
    return 0;
};

export {ownership, isRevoked, creditorIsMe, amICreditorOrDebtor};