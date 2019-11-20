from flask import Blueprint, request, jsonify
from . import utils

scraper_app = Blueprint('scraper_app', __name__)

@scraper_app.route('/search/delete', methods=['POST'])
def update_ids():
    data = request.json
    resp = utils.update_person_ids(data)
    return resp

@scraper_app.route('/search/upload', methods=['POST'])
def search_scraper():
    data = request.json
    data = data.get('data')

    res = utils.search(data)

    return res, 201


@scraper_app.route('/social/upload', methods=['POST'])
def social_upload():
    data = request.json

    utils.find_social(data)

    return 'ok', 201


@scraper_app.route('/social/delete', methods=['DELETE'])
def social_delete():
    data = request.json

    utils.delete_social(data)

    return 'ok', 201


@scraper_app.route('/create/upload', methods=['POST'])
def create_upload():
    data = request.json
    data = data.get("data")

    res = utils.create(data)

    return res, 201


@scraper_app.route('/update', methods=['GET'])
def update():
    res = utils.update_all()

    return res, 201
