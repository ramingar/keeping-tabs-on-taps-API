import {Router} from 'express';
import {index} from '../controller';
import {postUser} from '../controller/user';

export default (config) => {
    const routes = Router();

    routes.get('/', (req, res) => index(req, res));
    routes.post('/user', (req, res) => postUser(req, res, config));

    return routes;
};
