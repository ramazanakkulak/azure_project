from os import environ as env

from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient

from os.path import dirname, abspath
from dotenv import load_dotenv
import os
basedir = os.path.abspath(os.path.dirname(__file__))

cwd = dirname(abspath(__file__))
dotenv_path = os.path.join(cwd, '.env')
print(dotenv_path)
load_dotenv(dotenv_path)

def config(con: str) -> str:
    TENANT_ID = env.get("TENANT_ID", "")
    CLIENT_ID = env.get("CLIENT_ID", "")
    CLIENT_SECRET = env.get("CLIENT_SECRET", "")

    KEY_VAULT_URI = env.get("KEY_VAULT_URL", "")

    credential = ClientSecretCredential(
        tenant_id=TENANT_ID,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET
    )

    sc = SecretClient(vault_url=KEY_VAULT_URI, credential=credential)
    print(sc.get_secret(con))
    return sc.get_secret(con).value
