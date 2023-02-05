const { SecretClient } = require('@azure/keyvault-secrets');
const { ClientSecretCredential } = require('@azure/identity');

/**
 * @desc Contains global messages.
 */
async function getKeyVault(secret) {
  const credential = new ClientSecretCredential(
    process.env.TENANTID,
    process.env.CLINENTID,
    process.env.APPSECRETKEY
  );
  const client = new SecretClient(process.env.AZUREVAULTURL, credential);
  const latestSecret = await client.getSecret(secret);
  return latestSecret.value;
}

module.exports = {
  getKeyVault
};
