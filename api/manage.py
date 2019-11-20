import os
from application import create_app
import config
import bcrypt
import json
from flask_cors import CORS, cross_origin

from models.mongo import Document

mongo_handler = Document()

app = create_app(config, debug=config.DEBUG)
port = int(os.getenv('PORT', 5000))
CORS(app)

""" Run Configuration """
if __name__ == '__main__':
    app.secret_key = 'mysecret'
    app.run(debug=True, host="0.0.0.0", port=port, threaded=True)
