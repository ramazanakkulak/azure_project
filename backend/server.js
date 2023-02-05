const mongoose = require('mongoose');
const dotenv = require('dotenv');
const systemSleep = require('system-sleep');
const { SecretClient } = require('@azure/keyvault-secrets');
const { ClientSecretCredential } = require('@azure/identity');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './configProd.env' });
} else {
  dotenv.config({ path: './configDev.env' });
}
const app = require('./app');
console.log('\n\tTHE PROJECT IS RUNNING');
console.log('\n\tAZURE PROJECT');
console.log(
  '\n*************************************************\n* IF YOU WANT TO CHANGE THE WORKING ENVIRONMENT *\
    \n* ` ~ npm run start:prod`\t\t\t*\n* \tOR\t\t\t\t\t*\n* ` ~ npm run start:dev`\t\t\t*\
    \n*************************************************\n'
);
console.log('WORKING ENVIRONMENT:', process.env.NODE_ENV, '\n');
console.log('\nThe system will start after 5 seconds.Waiting\n');
systemSleep(5000);

const credential = new ClientSecretCredential(
  process.env.TENANTID,
  process.env.CLINENTID,
  process.env.APPSECRETKEY
);
const client = new SecretClient(process.env.AZUREVAULTURL, credential);
client.getSecret('mongodbConnection').then(res => {
  mongoose
    .connect(res.value)
    .then(() => console.log('DB connection successful!'));
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
