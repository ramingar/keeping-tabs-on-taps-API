import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const authenticate = (config) => expressJwt({secret: config.jwtTokenSecret});

const generateAccessToken = (req, res, config, next) => {

    req.token = req.token || {};
    req.token = jwt.sign({id: req.user.id}, config.jwtTokenSecret, {expiresIn: config.jwtTokenTime});

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
    generateAccessToken,
    respond
};
