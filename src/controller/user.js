import passport from 'passport';

import db from '../db';
import User from '../model/user';
import RevokedToken from '../model/revokedToken';
import {generateAccessToken, respond} from '../middleware/auth';
import {errorHandler, passportLocalMongooseErrorsCode, mongooseErrorsCode} from '../utils/errors';

const postUser = (req, res, config) => {

    db.connect(config);

    User.register(User({email: req.body.email}), req.body.pass, function (err, user) {
        if (err) {
            db.disconnect();
            return res.status(err.status || passportLocalMongooseErrorsCode[err.name] || 500).json(errorHandler(err));
        }

        user.name = req.body.name;
        user.save().then((response) => {
                db.disconnect();
                const {_id, name, email} = response;
                const payload = Object.assign({}, {_id, name, email});
                res.status(201).json(payload);
            }, (err) => {
                db.disconnect();
                res.status(err.status || 500).json(errorHandler(err));
            }
        );
    });

};

const login = (req, res, config) => {

    db.connect(config);

    passport.authenticate('local', {session: false, scope: []})(req, res, () => {
        generateAccessToken(req, res, config, () => {
            db.disconnect();
            respond(req, res);
        });
    });
};

const logout = (req, res, config) => {

    db.connect(config);

    const revokedToken = RevokedToken();

    revokedToken.tokenId = req.header('Authorization').slice(7);
    revokedToken.userId = req.user.id;
    revokedToken.date = Date.now();
    revokedToken.expireAt = Date.now() + (config.jwtTokenTime * 1000);

    revokedToken.save().then(() => {
        db.disconnect();
        req.logout();
        res.status(204).json();
    }, (err) => {
        db.disconnect();
        res.status(err.status || 500).json(errorHandler(err));
    });

};

const getUserById = (req, res, config) => {

    db.connect(config);

    User.findById(req.params.id).then((response) => {
        db.disconnect();
        res.status(200).json(response);
    }, (err) => {
        db.disconnect();
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });

};

export {login, logout, postUser, getUserById};
