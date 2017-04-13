import mongoose from 'mongoose';
import * as _ from 'lodash';

import '../models/photo';
import Argus from '../lib/argus_service';

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
    let converted = {};
    _.forOwn(req.body, function(v, k) {
        converted[_.snakeCase(k)] = v;
    });

    if (isValidPhoto(converted)) {
        let p = new Photo(converted);

        try {
            //p = yield Photo.findOneAndUpdate({url: p.url}, p, {upsert: true});
            yield p.save();
            let processedData = yield Argus.request('/v1/tag', {
                images: [p.url],
                mode: [
                    "face",
                    "scene",
                    "pulp"
                ]});

            // Update DB with the learning result
            p.metadata = [processedData.data];
            p.save();
            res.json(processedData.data);
        } catch (err) {
            const errors = Object.keys(err.errors).map(field => err.errors[field].message);
            res.json({errors});
        }
    } else {
        console.log('invalid photo data: ' + JSON.stringify(req.body));
        res.status(400).send('Bad Request');
    }
});

export const uploadDataBatch = async(function* (req, res) {
    let photos = req.body;
    if (isValidPhotoArray(photos)) {
        try {
            yield Photo.insertMany(photos);
            res.json("Success...");
        } catch (err) {
            const errors = Object.keys(err.errors).map(field => err.errors[field].message);
            res.json({errors});
        }
    } else {
        console.log('invalid photo array: ' + JSON.stringify(req.body));
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

export const argus = async(function* (req, res) {
    let result = yield Argus.request('/v1/tag', {
        images: [
            "http://s8.rr.itc.cn/g/wapChange/20163_27_13/a5o81u7785882487405.jpg",
            "http://img4.cache.netease.com/lady/2015/7/29/20150729153237d41c5.jpg",
            "http://oj79vjkk1.bkt.clouddn.com/fengjing_shiwai_2.jpg"
        ],
        mode: [
            "face",
            "scene",
            "pulp"
        ]}
    );
    res.json({data: result.data});
});

function isValidPhotoArray(ps) {
    if (!_.isArray(ps)) {
        return false;
    }

    _.each(function(p) {
        if (isValidPhoto(p)) {
            return false;
        }
    });
    return true;
}

function isValidPhoto(p) {
    if (!_.isPlainObject(p)) {
        return false;
    }

    // the photo object should has 'key', 'bucket', 'create_time', 'last_modified'
    if (!(_.has(p, 'url') && _.has(p, 'user_id') && _.has(p, 'create_time') && _.has(p, 'last_modified'))) {
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
