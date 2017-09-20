import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 60 * 60 * 24 * 30; // 30 days
const SECRET = "My-S3cr3t-P@ssw0rd-F0r-JsonW3bT0kens";

const authenticate = expressJwt({secret: SECRET});

const generateAccessToken = (req, res, next) => {

    req.token = req.token || {};
    req.token = jwt.sign({id: req.user.id}, SECRET, {expiresIn: TOKENTIME});

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
