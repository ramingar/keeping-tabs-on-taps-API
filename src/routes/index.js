import {Router} from 'express';
import {index} from '../controller';

const routes = Router();

routes.get('/', (req, res) => index(req, res));

export default routes;
