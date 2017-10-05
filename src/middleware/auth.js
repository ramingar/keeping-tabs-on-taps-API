import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import {buildResponse, setLinks} from "../utils/responses";

const authenticate = (config) => expressJwt({secret: process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret});

const generateAccessToken = (req, res, config, next) => {

    req.token = req.token || {};
    req.token = jwt.sign(
        {id: req.user.id},
        process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret,
        {expiresIn: process.env.APP_JWT_TOKEN_TIME || config.jwtTokenTime}
    );

    next();
};

const getMyId = (token, config) => {
    return jwt.verify(token, process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret);
};

const getMe = (req, res, config) => {
    const payload = getMyId(req.header('Authorization').slice(7), config);

    res.status(200).json(setLinks(req, buildResponse({
        user: payload.id
    })));
};

const respond = (req, res) => {
    res.status(200).json(setLinks(req, buildResponse({
        user: req.user.email,
        token: req.token
    })));
};

export {
    authenticate,
    generateAccessToken,
    getMyId,
    getMe,
    respond
};
