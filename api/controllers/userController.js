const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Utils = require("../utils/response");
const hashUtil = require("../utils/hash/hashUtil");
const GetVerifyId = require("../grpc/grpcClient");
const User = require("../models/user");
const Coin = require("../models/coin");
const Info = require("../models/info");
const {
  PERSONEL_ID,
  PERSONEL_ROLE,
  NAME_IDENTIFIER,
  ROLE,
  EMAIL,
} = require("../utils/constants/.NETConstants");

const basePath = `http://localhost:${process.env.PORT ?? 3000}`;

exports.userRegister = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return Utils.errorResponse(res, 409, "Mail exists");
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
          role: PERSONEL_ROLE,
          image: "default_path", //`${basePath}/${req.file.path}`,
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
            _id: user._id,
            email: user.email,
            personelId: user.personelId,
            info: {
              _id: info._id,
              firstname: info.firstname,
              lastname: info.lastname,
              createdAt: info.createdAt,
              role: info.role,
              image: info.image,
            },
            coin: {
              _id: coin._id,
              totalCoin: coin.totalCoin,
              personelId: coin.personelId,
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
    .populate("info")
    .populate("coin")
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return Utils.errorResponse(res, 401, "Auth failed");
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return Utils.errorResponse(res, 401, "Auth failed");
        }
        if (result) {
          const tokenParameters = {};
          tokenParameters[NAME_IDENTIFIER] = user[0]._id.toString();
          tokenParameters[PERSONEL_ID] = user[0].personelId;
          tokenParameters[EMAIL] = user[0].email;
          tokenParameters[ROLE] = user[0].info.role;

          const token = jwt.sign(tokenParameters, process.env.JWT_KEY, {
            expiresIn: "1h",
          });
          return Utils.successResponse(res, 200, {
            message: "Auth successful",
            token,
            user: {
              _id: user[0]._id,
              email: user[0].email,
              personelId: user[0].personelId,
              info: {
                _id: user[0].info._id,
                firstname: user[0].info.firstname,
                lastname: user[0].info.lastname,
                createdAt: user[0].info.createdAt,
                role: user[0].info.role,
                image: user[0].info.image,
              },
              coin: {
                _id: user[0].coin._id,
                totalCoin: user[0].coin.totalCoin,
                personelId: user[0].coin.personelId,
              },
            },
          });
        }
        return Utils.errorResponse(res, 401, "Auth failed");
      });
    })
    .catch((err) => {
      Utils.errorResponse(res, 500, err);
    });
};

exports.getUserById = (req, res, next) => {
  const id = req.params.id;
  User.findOne({ _id: id })
    .select("_id personelId email info coin")
    .populate("info", "_id firstname lastname createdAt role image")
    .populate("coin", "_id totalCoin personelId")
    .exec()
    .then((user) => {
      if (user) {
        return Utils.successResponse(res, 200, user);
      }
      return Utils.errorResponse(res, 404, "User not found");
    })
    .catch((err) => {
      return Utils.errorResponse(res, 500, err);
    });
};

exports.verifyIDNumber = (req, res, next) => {
  const idNumber = req.body.idNumber;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const birthdayYear = req.body.birthdayYear;

  return GetVerifyId(
    idNumber,
    name,
    lastName,
    birthdayYear,
    (err, response) => {
      if (err) {
        return Utils.errorResponse(res, 500, err);
      }
      return Utils.successResponse(res, 200, response);
    }
  );
};
