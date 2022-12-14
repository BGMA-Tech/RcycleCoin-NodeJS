const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Utils = require('../utils/response');
const hashUtil = require('../utils/hash/hashUtil');

const User = require('../models/user');
const Coin = require('../models/coin');
const Info = require('../models/info');

const basePath = `http://localhost:${process.env.PORT ?? 3000}`;

exports.userRegister = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return Utils.errorResponse(res, 409, 'Mail exists');
      }
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) return Utils.errorResponse(res, 500, err);

        const personelId = hashUtil.createHash(req.body.email + hash);

        const coin = new Coin({
          _id: new mongoose.Types.ObjectId(),
          personelId: personelId,
          totalCoin: 0,
        });

        const info = new Info({
          _id: new mongoose.Types.ObjectId(),
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          createdAt: Date.now(),
          role: 'user',
          image: `${basePath}/${req.file.path}`,
        });

        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          personelId: personelId,
          email: req.body.email,
          password: hash,
          info: info._id,
          coin: coin._id,
        });
        try {
          await coin.save();
          await info.save();
          await user.save();
          return Utils.successResponse(
            res,
            201,
            {
              _id: user._id,
              email: user.email,
              info: {
                firstname: info.firstname,
                lastname: info.lastname,
                createdAt: info.createdAt,
                role: info.role,
                image: info.image,
              },
              coin: {
                totalCoin: coin.totalCoin,
                personelId: coin.personelId,
              },
            },
            'User created successfully'
          );
        } catch (error) {
          return Utils.errorResponse(res, 500, error);
        }
      });
    });
};

exports.userLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return Utils.errorResponse(res, 401, 'Auth failed');
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return Utils.errorResponse(res, 401, 'Auth failed');
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user[0]._id,
              personelId: user[0].personelId,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            }
          );
          return Utils.successResponse(res, 200, token, 'Auth successful');
        }
        return Utils.errorResponse(res, 401, 'Auth failed');
      });
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.getUserById = (req, res, next) => {
  const id = req.params.id;
  User.findOne({ _id: id })
    .select('_id personelId email info coin')
    .populate('info')
    .populate('coin')
    .exec()
    .then((user) => {
      if (user) {
        return Utils.successResponse(res, 200, user, 'User found');
      }
      return Utils.errorResponse(res, 404, 'User not found');
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};
