import mongoose from 'mongoose';
import '../models/user';
//import {respond} from '../utils';

const { wrap: async } = require('co');
const User = mongoose.model('User');

export const create = async(function* (req, res) {
    const user = new User(req.body);
    user.provider = 'local';
    try {
        yield user.save();
        res.json("Success...");
    } catch (err) {
        const errors = Object.keys(err.errors)
            .map(field => err.errors[field].message);

        res.json({
            title: 'Create user',
            errors
        });
    }
});

export const get = async(function(req, res) {
    res.json('can you see any user?');
});
