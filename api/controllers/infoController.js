const mongoose = require('mongoose');
const Info = require('../models/info');
const Utils = require('../utils/response');

const basePath = `http://localhost:${process.env.PORT ?? 3000}/`;

exports.infoGetOne = (req, res, next) => {
  const id = req.params.id;
  Info.findOne({ _id: id })
    .select('_id firstname lastname createdAt role image')
    .exec()
    .then((doc) => {
      if (doc) {
        Utils.successResponse(res, 200, doc);
      } else {
        Utils.errorResponse(res, 404, 'No valid entry found for provided ID');
      }
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.infoCreate = (req, res, next) => {
  const info = new Info({
    _id: new mongoose.Types.ObjectId(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    role: req.body.role,
    image: /*basePath + req.file.path*/ 'default_path',
  });
  info
    .save()
    .then((result) => {
      Utils.successResponse(res, 201, {
        _id: result._id,
        firstname: result.firstname,
        lastname: result.lastname,
        role: result.role,
        image: result.image,
      });
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.infoUpdate = async (req, res, next) => {
  const id = req.params.id;
  const updateOps = {};

  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }

  try {
    await Info.updateOne({ _id: id }, { $set: updateOps }).exec();
    Info.findOne({ _id: id })
      .select('_id firstname lastname role image')
      .exec()
      .then((doc) => {
        if (doc) {
          Utils.successResponse(res, 200, doc);
        } else {
          Utils.errorResponse(res, 404, 'No valid entry found for provided ID');
        }
      });
  } catch (error) {
    Utils.errorResponse(res, 404, error);
  }
};
