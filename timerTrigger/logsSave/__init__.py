import datetime
import logging
import pandas as pd
import time
import azure.functions as func
import pymongo
from azure.storage.blob import BlobServiceClient

import logsSave.key_config as conf

storage_account_key = conf.config("storageaccountkey")
storage_account_name = conf.config("storageaccountname")
connection_string = conf.config("connectionstring")
container_name = conf.config("containername")

def logTicket():
    myclient = pymongo.MongoClient(conf.config("mongodbConnection"))
    mydb = myclient["ticket"]
    mycol = mydb["cinema"]
    array = []
    x = mycol.find()
    for i in x:
        array.append(i)
    mycol.drop()
    mycol = mydb["logTicket"]
    mycol.insert_one({"time":str(time.strftime("%d.%m.%Y")),
                        "total":str(len(array))})

def main(mytimer: func.TimerRequest) -> None:
    logTicket()
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()
    if mytimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)
