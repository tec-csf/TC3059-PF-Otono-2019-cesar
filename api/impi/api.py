from flask.views import MethodView
from flask import jsonify, request, abort, redirect, url_for
from impi.get_impi import *
import logging
import json

class ImpiAPI(MethodView):
    logger = logging.getLogger(__name__)

    def __init__(self):
        if (request.method != 'GET') and not request.json:
            abort(400)

    def get(self):
        return jsonify({'Impi': 'Search Impi'}), 200

    def post(self):
        data = request.json
        self.logger.info("########## Impi Called")
        self.logger.info(data)

        res = buscar_en_impi(data)

        return res, 201
