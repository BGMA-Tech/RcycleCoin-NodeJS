const mongoose = require('mongoose');
const MongooseManager = {
  init: async () => {
    mongoose.Promise = global.Promise;
    await mongoose.connect(
      `mongodb+srv://admin:${process.env.MONGOOSE_PWD}@rcyclecluster.nfyzm8m.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log(`Mongoose State: ${mongoose.connection.readyState}`);
  },
};

module.exports = MongooseManager;
