import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import db from '../db';
import RevokedToken from '../model/revokedToken';

const authenticate = (config) => expressJwt({secret: process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret});

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

const generateAccessToken = (req, res, config, next) => {

    req.token = req.token || {};
    req.token = jwt.sign(
        {id: req.user.id},
        process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret,
        {expiresIn: process.env.APP_JWT_TOKEN_TIME || config.jwtTokenTime}
    );

    next();
};

const respond = (req, res) => {
    res.status(200).json({
        user: req.user.email,
        token: req.token
    });
};

export {
    authenticate,
    isRevoked,
    ownership,
    generateAccessToken,
    respond
};
