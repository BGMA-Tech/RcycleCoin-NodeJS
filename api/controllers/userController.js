const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto');

const Utils = require('../utils/response');
const hashUtil = require('../utils/hash/hashUtil');

const basePath = `http://localhost:${process.env.PORT ?? 3000}/products`;

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
          coin: 0,
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
          return Utils.successResponse(res, 201, {
            message: 'User created',
            user: {
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
                coin: coin.coin,
              },
            },
          });
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
          return Utils.successResponse(res, 200, {
            message: 'Auth successful',
            token,
          });
        }
        return Utils.errorResponse(res, 401, 'Auth failed');
      });
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};
