import mongoose from 'mongoose';
import '../models/photo';
//import {respond} from '../utils';
import * as _ from 'lodash';

const { wrap: async } = require('co');
const Photo = mongoose.model('Photo');

export const getLearningResult = async(function(req, res) {
    // TODO fetch learning result from local DB,
    // which was fetched from Argus, and saved into local DB.
    let result = {
        url: 'http://www.example.org/img1.png',
        last_modified: Date.now(),
        metadata: [{a: 'a', b: 'b'}]
    };
    res.json(result);
});

export const uploadData = async(function* (req, res) {
    if (isValidPhoto(req.body)) {
        let p = new Photo(req.body);

        try {
            yield p.save();
            // TODO call Argus for learning results...
            res.json("Success...");
        } catch (err) {
            const errors = Object.keys(err.errors).map(field => err.errors[field].message);
            res.json({errors});
        }
    } else {
        console.log('invalid photo data: ' + JSON.stringify(req.body));
        res.status(400).send('Bad Request');
    }
});

export const heartbeat = async(function* (req, res) {
    if (isValidHeartbeat(req.body)) {
        let lastModified = req.body['last_modified'];
        let newProcessedPhotos = yield Photo.find({last_processed: lastModified});
        res.json({updated: _.size(newProcessedPhotos) > 0 ? 1 : 0});
    } else {
        console.log('invalid heartbeat: ' + JSON.stringify(req.body));
        res.status(400).send('Bad Request');
    }
});

function isValidPhoto(p) {
    if (!_.isPlainObject(p)) {
        return false;
    }

    // the photo object should has 'key', 'bucket', 'create_time', 'last_modified'
    if (!(_.has(p, 'key') && _.has(p, 'bucket') && _.has('create_time') && _.has('last_modified'))) {
        return false;
    }
    return true;
}

function isValidHeartbeat(hb) {
    if (!_.isPlainObject(hb)) {
        return false;
    }

    return _.has(hb, 'last_modified');
}
