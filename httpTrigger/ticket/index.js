const { SecretClient } = require('@azure/keyvault-secrets');
const { ClientSecretCredential } = require('@azure/identity');
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

module.exports = async function (context, req) {
  const cinema = req.query.name || (req.body && req.body.name);

  context.log('JavaScript HTTP trigger function processed a request.');
  const credential = new ClientSecretCredential(
    process.env.TENANTID,
    process.env.CLINENTID,
    process.env.APPSECRETKEY
  );

  const client = new SecretClient(process.env.AZUREVAULTURL, credential);
  client.getSecret('mongodbConnection').then((res) => {
    MongoClient.connect(res.value, function (err, db) {
      if (err) throw err;
      var dbo = db.db('ticket');
      var myobj = { cinema: cinema };
      dbo.collection('cinema').insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log('1 document inserted');
        db.close();
      });
    });
  });

  const responseMessage = cinema
    ? 'Hello, ' +
      cinema +
      '. This HTTP triggered function executed successfully.'
    : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};
