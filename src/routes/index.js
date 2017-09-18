import {Router} from 'express';
import {index} from '../controller';
import {postUser, getUserById} from '../controller/user';

export default (config) => {
    const routes = Router();

    routes.get('/', (req, res) => index(req, res));
    routes.post('/user', (req, res) => postUser(req, res, config));
    routes.get('/user/:id', (req, res) => getUserById(req, res, config));

    return routes;
};
