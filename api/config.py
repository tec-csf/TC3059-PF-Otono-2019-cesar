"""
This file contains all of the configuration values for the application.
"""

from dotenv import load_dotenv, find_dotenv
import multiprocessing
import os

PORT = 5000
HOST = '0.0.0.0'

load_dotenv(find_dotenv())

DEBUG = os.environ.get('DEBUG', True)
if DEBUG == "True":
    DEBUG = True
else:
    DEBUG = False

DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')

TOKEN = os.environ.get('TOKEN')

REDIS_URI = os.environ.get("REDIS_URI")
REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")
MONGO_URI = os.environ.get("MONGO_URI")
GOOGLE_APPLICATION_CREDENTIALS = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

# Number CPUs
CPU_CORES = multiprocessing.cpu_count()