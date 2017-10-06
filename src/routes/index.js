import {Router} from 'express';
import {index} from '../controller';
import {login, logout, postUser, getUserById} from '../controller/user';
import {postContract, getContract, getContractsByCreditor, getContractsByDebtor} from "../controller/contract";
import {authenticate, getMe} from '../middleware/auth';
import {ownership, isRevoked, creditorIsMe} from '../middleware/validations';

export default (config) => {
    const routes = Router();

    routes.get('/', (req, res) => index(req, res));

    routes.post('/login', (req, res) => login(req, res, config));

    routes.get('/me',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res) => getMe(req, res, config)
    );

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

    routes.post('/user/:id/contract',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res, next) => ownership(req, res, config, next),
        (req, res, next) => creditorIsMe(req, res, next),
        (req, res) => postContract(req, res)
    );

    routes.get('/user/:id/contract/:idContract',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res, next) => ownership(req, res, config, next),
        (req, res) => getContract(req, res)
    );

    routes.get('/user/:id/contract',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res, next) => ownership(req, res, config, next),
        (req, res) => getContractsByCreditor(req, res)
    );

    routes.get('/user/:id/contract-as-debtor',
        authenticate(config),
        (req, res, next) => isRevoked(req, res, next),
        (req, res, next) => ownership(req, res, config, next),
        (req, res) => getContractsByDebtor(req, res)
    );

    return routes;
};
