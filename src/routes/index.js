import {Router} from 'express';
import {index} from '../controller';
import {login, postUser, getUserById} from '../controller/user';
import {authenticate, ownership} from '../middleware/auth';

export default (config) => {
    const routes = Router();

    routes.get('/', (req, res) => index(req, res));
    routes.post('/login', (req, res) => login(req, res, config));
    routes.post('/user', (req, res) => postUser(req, res, config));
    routes.get('/user/:id',
        authenticate(config),
        (req, res, next) => ownership(req, res, config, next),
        (req, res) => getUserById(req, res, config)
    );

    return routes;
};
