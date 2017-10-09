import {Router} from 'express';
import {index} from '../controller';
import {login, logout, postUser, getUserById} from '../controller/user';
import {
    postContract, getContract, getContractsByCreditor, getContractsByDebtor,
    changeContractStatus
} from "../controller/contract";
import {authenticate, getMe} from '../middleware/auth';
import {ownership, isRevoked, creditorIsMe} from '../middleware/validations';

export default (config) => {
    const routes = Router();

    routes.get('/', index);

    routes.post('/login', (req, res) => login(req, res, config));

    routes.get('/me',
        authenticate(config),
        isRevoked,
        (req, res) => getMe(req, res, config)
    );

    routes.get('/logout',
        authenticate(config),
        isRevoked,
        (req, res) => logout(req, res, config)
    );

    routes.post('/user', postUser);

    routes.get('/user/:id',
        authenticate(config),
        isRevoked,
        (req, res, next) => ownership(req, res, config, next),
        getUserById
    );

    routes.post('/user/:id/contract',
        authenticate(config),
        isRevoked,
        (req, res, next) => ownership(req, res, config, next),
        creditorIsMe,
        postContract
    );

    routes.get('/user/:id/contract/:idContract',
        authenticate(config),
        isRevoked,
        (req, res, next) => ownership(req, res, config, next),
        getContract
    );

    routes.get('/user/:id/contract',
        authenticate(config),
        isRevoked,
        (req, res, next) => ownership(req, res, config, next),
        getContractsByCreditor
    );

    routes.get('/user/:id/contract-as-debtor',
        authenticate(config),
        isRevoked,
        (req, res, next) => ownership(req, res, config, next),
        getContractsByDebtor
    );

    routes.patch('/user/:id/contract/:idContract',
        authenticate(config),
        isRevoked,
        (req, res, next) => ownership(req, res, config, next),
        changeContractStatus
    );

    return routes;
};
