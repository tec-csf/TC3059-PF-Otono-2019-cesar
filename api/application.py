import logging
from flask import Flask
from flask_cors import CORS
import config


def create_app(config, debug=False, testing=False, **config_overrides):
    """
    Create all the API configurations, this handle the database connection, the routes
    initialization, the SSL certificate and all the error handlers

    Arguments
        name: config,             type: module,         summary: This file is in charge of the database connections and credentials
        name: debug,              type: boolean,        summary: It set the environment as development phase or not
        name: testing,            type: boolean,        summary: It set the environment as testing
        name: config_overrides,   type: boolean,        summary: This will say if the initial config is other rather the initial one

    Call
        create_app('module', True, False, False)

    Responses
        None
    """

    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Set config environment
    app.debug = debug
    app.testing = testing

    # Minimum cache settings
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

    # Define parser for the response of requests
    app.config['DEFAULT_PARSERS'] = ['flask_api.parsers.JSONParser']

    # Add all configurations that had been sent
    app.config.from_pyfile('config.py')

    # Apply overrides for tests
    app.config.update(config_overrides)

    # Apply configurations overrides
    if config_overrides:
        app.config.update(config_overrides)

    from common.db import mongo
    mongo.init_app(app)

    from users.endpoints import users_app
    from scraper.endpoints import scraper_app
    from physical_people.endpoints import physical_app
    from moral_people.endpoints import moral_app
    from find.endpoints import find_app

    app.register_blueprint(users_app, url_prefix='/api/v1')
    app.register_blueprint(scraper_app, url_prefix='/api/v1')
    app.register_blueprint(physical_app, url_prefix='/api/v1')
    app.register_blueprint(moral_app, url_prefix='/api/v1')
    app.register_blueprint(find_app, url_prefix='/api/v1')

    return app
