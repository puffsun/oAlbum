const mongoose = require('mongoose');
//const notify = require('../notifier');

let Schema = mongoose.Schema;

const getMeta = tags => tags.join(',');
const setMeta = tags => tags.split(',');

let PhotoSchema = new Schema({
    url: {type: String, default: '', trim: true},
    user_id: {type: Schema.ObjectId, ref: 'User'},
    created_at: {type: Date, default: Date.now},
    metadata: {type: [], get: getMeta, set: setMeta}
});

/**
 * Validations
 */

PhotoSchema.path('url').required(true, 'Photo URL cannot be blank');
PhotoSchema.path('user_id').required(true, 'Photo user cannot be blank');

/**
 * Pre-remove hook
 */
PhotoSchema.pre('remove', function (next) {
  next();
});

/**
 * Methods
 */

PhotoSchema.methods = {

  /**
   * Save photo and upload image
   *
   * @param {Object} images
   * @api private
   */

  uploadAndSave: function (image) {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();

    /*
    if (images && !images.length) return this.save();
    const imager = new Imager(imagerConfig, 'S3');
    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err);
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files };
      }
      self.save(cb);
    }, 'photo');
    */
  },
};

/**
 * Statics
 */

PhotoSchema.statics = {

  /**
   * Find photo by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
      .populate('user_id', 'name email username')
      .exec();
  },

  /**
   * List photos
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user_id', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('PhotoModel', PhotoSchema);
