import passport from 'passport';

import db from '../db';
import User from '../model/user';
import RevokedToken from '../model/revokedToken';
import {generateAccessToken, respond} from '../middleware/auth';
import {errorHandler, passportLocalMongooseErrorsCode, mongooseErrorsCode} from '../utils/errors';
import {buildResponse, setLinks} from "../utils/responses";

const postUser = (req, res) => {

    User.register(User({email: req.body.email}), req.body.pass, function (err, user) {
        if (err) {
            return res.status(err.status || passportLocalMongooseErrorsCode[err.name] || 500).json(errorHandler(err));
        }

        user.name = req.body.name;
        user.save().then((response) => {
                const {_id, name, email} = response;
                const payload = setLinks(req, buildResponse(Object.assign({}, {_id, name, email})));
                res.status(201).json(payload);
            }, (err) => {
                res.status(err.status || 500).json(errorHandler(err));
            }
        );
    });

};

const login = (req, res, config) => {

    passport.authenticate('local', {session: false, scope: []})(req, res, () => {
        generateAccessToken(req, res, config, () => {
            respond(req, res);
        });
    });
};

const logout = (req, res, config) => {

    const revokedToken = RevokedToken();

    revokedToken.tokenId = req.header('Authorization').slice(7);
    revokedToken.userId = req.user.id;
    revokedToken.date = Date.now();
    revokedToken.expireAt = Date.now() + ((process.env.APP_JWT_TOKEN_TIME || config.jwtTokenTime) * 1000);

    revokedToken.save().then(() => {
        req.logout();
        res.status(204).json();
    }, (err) => {
        res.status(err.status || 500).json(errorHandler(err));
    });

};

const getUserById = (req, res) => {

    User.findById(req.params.id).then((response) => {
        res.status(200).json(setLinks(req, buildResponse(response)));
    }, (err) => {
        res.status(err.status || mongooseErrorsCode[err.name] || 500).json(errorHandler(err));
    });

};

export {login, logout, postUser, getUserById};
