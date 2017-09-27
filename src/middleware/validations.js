import jwt from 'jsonwebtoken';

import db from '../db';
import RevokedToken from '../model/revokedToken';
import User from '../model/user';
import {errorHandler} from '../utils/errors';

const ownership = (req, res, config, next) => {
    const payload = jwt.verify(
        req.header('Authorization').slice(7),
        process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret
    );

    if (payload.id !== req.params.id) {
        return res.status(403).json({"message": "Forbidden: access to the requested resource is forbidden"});
    }

    next();
};

const isRevoked = (req, res, config, next) => {

    db.connect(config);

    RevokedToken.find({tokenId: req.header('Authorization').slice(7)}).then((revokedToken) => {
        if (revokedToken.length > 0) {
            db.disconnect();
            return res.status(401).json({
                "message": "The token has been revoked.",
                "error": {
                    "name": "UnauthorizedError",
                    "code": "revoked_token",
                    "status": 401
                }
            });
        } else {
            db.disconnect();
            next();
        }
    }, () => {
        db.disconnect();
        next();
    });
};

const creditorIsMe = (req, res, config, next) => {

    db.connect(config);

    User.find({email: req.body.creditor}).then((response) => {
        db.disconnect();

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
        db.disconnect();
        return res.status(403).json(errorHandler(err));
    });


};

export {ownership, isRevoked, creditorIsMe};