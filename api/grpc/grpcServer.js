const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const package = loader.loadSync(__dirname + '/verifyId.proto', {});
const object = grpc.loadPackageDefinition(package);
const soap = require('soap');

const verifyIDPackage = object.verifyIDPackage;

const server = new grpc.Server();
const url = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';

server.addService(verifyIDPackage.VerifyID.service, {
  verifyId: verifyId,
});

function verifyId(call, callback) {
  const args = {
    TCKimlikNo: Number(call.request.idNumber),
    Ad: call.request.name,
    Soyad: call.request.lastName,
    DogumYili: call.request.birthdayYear,
  };

  soap.createClient(url, function (err, client) {
    client.TCKimlikNoDogrula(args, function (err, result) {
      callback(null, { isVerified: result.TCKimlikNoDogrulaResult });
    });
  });
}

server.bindAsync(
  '0.0.0.0:' + process.env.GRPC_PORT,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    console.log('Server running on port: ' + port);
    server.start();
  }
);
