import base64
from flask import Blueprint, request, jsonify
from . import utils

moral_app = Blueprint('moral_app', __name__)

@moral_app.route('/read_acts/search', methods=['POST'])
def read_acts():
    data = request.form

    string_image = request.files['pdf'].read()
    image_64_encode = base64.b64encode(string_image)
    output = utils.read_text(image_64_encode)

    return jsonify(output), 200

@moral_app.route('/read_rfc/search', methods=['POST'])
def read_rfc():
    data = request.form

    string_image = request.files['pdf'].read()
    image_64_encode = base64.b64encode(string_image)
    output = utils.read_rfc(image_64_encode)

    return jsonify(output), 200