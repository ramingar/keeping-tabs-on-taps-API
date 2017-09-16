import {Router} from 'express';

const routes = Router();

routes.get('/', (req, res, next) => {
    res.status(200).json({message: 'Server up!!'});
});

export default routes;
