import mongoose from 'mongoose';
import '../models/photo';
//import {respond} from '../utils';

const { wrap: async } = require('co');
const Photo = mongoose.model('Photo');

export const create = async(function* (req, res) {
    const photo = new Photo(req.body);
    try {
        yield photo.save();
        res.json("Success...");
    } catch (err) {
        const errors = Object.keys(err.errors)
            .map(field => err.errors[field].message);

        res.json({
            title: 'Create photo',
            errors
        });
    }
});

export const get = async(function(req, res) {
    res.json('can you see any photo here?');
});
