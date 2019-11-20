from flask import Blueprint, request, jsonify
from . import utils

users_app = Blueprint('users_app', __name__)


@users_app.route('/search/percentages', methods=['GET'])
def search_percentages():
    response = utils.search_percentages(request.args['user_id'])

    return jsonify(response)


@users_app.route('/search/metadata', methods=['GET'])
def search_metadata():
    response = utils.search_metadata(request.args['user_id'])

    try:
        return jsonify(response['metadata']), 200
    except:
        return "empty"


@users_app.route('/register/user', methods=['POST'])
def register_user():
    data = request.json

    response = utils.register_user(data)

    return jsonify(response)

@users_app.route('/change/metadata', methods=['POST'])
def change_metadata():
    data = request.json

    response = utils.register_metadata(
        data.get('data'), data.get('user_id'))

    return jsonify(response)

@users_app.route('/change/percentages', methods=['POST'])
def change_percentages():
    data = request.json

    response = utils.change_percentages(
        data.get('percentages'), data.get('user_id'))

    return jsonify(response)


@users_app.route('/change_role', methods=['POST'])
def change_role():
    data = request.json

    # Desde el frontend
    data = data.get('data').get('body')

    response = utils.change_role(data.get("role"), data.get("user_id"))

    return jsonify(response)
