from flask.views import MethodView
from flask import jsonify, request, abort, redirect, url_for
import logging
import json
import mandrill

def send_mail_mandrill(data):
    MANDRILL_API_KEY = 'wcD0rM1c9JW4GwidxMc1rA'
    mandrill_client = mandrill.Mandrill(MANDRILL_API_KEY)
    template_content = [{'content': 'example content', 'name': 'example name'}]

    message = { 'from_email': 'dcamhi@nearshoremx.com',
      'from_name': 'Riesgo Cognitivo',
      'global_merge_vars': [{'content': data['name'], 'name': 'entity_name'},{'content': data['score'], 'name': 'score'}],
      'merge_language' : 'handlebars',
      'merge': True,
      'to': [{
        'email': data['to_email'],
        'name': data['to_name'],
        'type': 'to'
       }],
      'subject': "Cambio en confiabilidad de entidad"
    }
    result = mandrill_client.messages.send_template(template_name='Notificación Riesgo',template_content=template_content,message = message)
    return result
