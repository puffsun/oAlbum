import { version } from '../../package.json';
import { Router } from 'express';
import * as userCtrl from '../controllers/users';
import * as photoCtrl from '../controllers/photos';

export default ({ config, db }) => {
    let api = Router();

    // perhaps expose some API metadata at the root
    api.get('/', (req, res) => {
        res.json({ version });
    });

    api.get('/hb', (req, res) => {
        res.json('you have new messages...');
    });

    api.get('/user', userCtrl.get);
    api.post('/user', userCtrl.create);

    api.get('/photo', photoCtrl.get)
    api.post('/photo', photoCtrl.create)

    return api;
}
