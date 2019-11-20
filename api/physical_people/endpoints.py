import base64
from flask import Blueprint, request, jsonify
from . import utils

physical_app = Blueprint('physical_app', __name__)

@physical_app.route('/compare_faces/search', methods=['POST'])
def compare_faces():
    data = request.json
    data = data.get('data').get('body')
    
    name_img1 = data.get('name_img1')
    name_img2 = data.get('name_img2')

    response = utils.compare_faces(name_img1, name_img2)

    if "error" in response:
        return jsonify({
            "error" : response["error"]
        }), 500
    else:
        return jsonify({
            "isIdentical" : response["isIdentical"],
            "confidence" : response["confidence"]
        }), 200

@physical_app.route('/detect_text/search', methods=['POST'])
def detect_text():
    data = request.form
    string_image = request.files['pdf'].read()
    image_64_encode = base64.b64encode(string_image)
    output = utils.read_text(image_64_encode)

    return jsonify(output), 200

@physical_app.route('/get_url/search', methods=['POST'])
def get_url():
    data = request.form
    
    string_image = request.files['image'].read()
    image_64_encode = base64.b64encode(string_image)
    data_text, img_name, type_img = utils.get_url(image_64_encode, data.get('pdf'))

    return jsonify({
        "data_text": data_text,
        "img_name": img_name,
        "type_img" : type_img
    }), 200

@physical_app.route('/transcript_afore/search', methods=['POST'])
def transcript_afore():
    data = request.form

    string_image = request.files['image'].read()
    image_64_encode = base64.b64encode(string_image)
    string_video = request.files['video'].read()
    video_64_encode = base64.b64encode(string_video)

    identity_verified, name_verified, organization_origin, organization_destiny, name_ine, name_video = utils.transcript_afore(image_64_encode, video_64_encode)

    return jsonify({
        "identity_verified": identity_verified,
        "name_verified" : name_verified,
        "organization_origin" : organization_origin,
        "organization_destiny" : organization_destiny,
        "name_ine" : name_ine,
        "name_video" : name_video
    }), 200    