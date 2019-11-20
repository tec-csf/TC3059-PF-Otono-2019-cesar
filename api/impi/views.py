from flask import Blueprint
from impi.api import ImpiAPI

impi_app = Blueprint('impi_app', __name__)

impi_view = ImpiAPI.as_view('impi_api')
impi_app.add_url_rule('/impi/',
                           view_func=impi_view,
                           methods=['GET', ])
impi_app.add_url_rule('/impi/search_impi',
                           view_func=impi_view,
                           methods=['POST', ])
