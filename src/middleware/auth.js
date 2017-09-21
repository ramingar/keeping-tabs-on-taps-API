import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const authenticate = (config) => expressJwt({secret: config.jwtTokenSecret});

const ownership = (req, res, config, next) => {
    const payload = jwt.verify(req.header('Authorization').slice(7), config.jwtTokenSecret);

    if (payload.id !== req.params.id) {
        return res.status(401).json({"message": "Unauthorized: access to the requested resource is not authorized"});
    }

    next();
};

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
    ownership,
    generateAccessToken,
    respond
};
