import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

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

const getMe = (req, res, config) => {
    const payload = jwt.verify(
        req.header('Authorization').slice(7),
        process.env.APP_JWT_TOKEN_SECRET || config.jwtTokenSecret
    );

    res.status(200).json({
        user: payload.id
    });
};

const respond = (req, res) => {
    res.status(200).json({
        user: req.user.email,
        token: req.token
    });
};

export {
    authenticate,
    generateAccessToken,
    getMe,
    respond
};
