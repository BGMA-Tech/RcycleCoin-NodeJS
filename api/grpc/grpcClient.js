const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const package = loader.loadSync(__dirname + '/verifyId.proto', {});
const object = grpc.loadPackageDefinition(package);
const verifyIDPackage = object.verifyIDPackage;

const GetVerifyId = (idNumber, name, lastName, birthdayYear, callBack) => {
  const client = new verifyIDPackage.VerifyID(
    '0.0.0.0:' + process.env.GRPC_PORT,
    grpc.credentials.createInsecure()
  );

  client.verifyId(
    {
      idNumber: Number(idNumber),
      name: name,
      lastName: lastName,
      birthdayYear: birthdayYear,
    },
    (err, response) => {
      return callBack(err, response.isVerified);
    }
  );
};

module.exports = GetVerifyId;
