import {Router} from 'express';
import {index} from '../controller';
import {login, logout, postUser, getUserById} from '../controller/user';
import {postDebt} from "../controller/debt";
import {authenticate} from '../middleware/auth';
import {ownership, isRevoked, creditorIsMe} from '../middleware/validations';

export default (config) => {
    const routes = Router();

    routes.get('/', (req, res) => index(req, res));

    routes.post('/login', (req, res) => login(req, res, config));

    routes.get('/logout',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res) => logout(req, res, config)
    );

    routes.post('/user', (req, res) => postUser(req, res));

    routes.get('/user/:id',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res, next) => ownership(req, res, config, next),
        (req, res) => getUserById(req, res)
    );

    routes.post('/user/:id/debt',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res, next) => ownership(req, res, config, next),
        (req, res, next) => creditorIsMe(req, res, next),
        (req, res) => postDebt(req, res)
    );

    return routes;
};
