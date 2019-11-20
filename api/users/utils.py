from config import (
    TOKEN
)
import requests
import logging
import base64
import json
import os
import uuid
import sys
import requests

from models.mongo import Document

mongo_handler = Document()


def search_metadata(user_id):
    response = mongo_handler.GetUserData(user_id)
    return (response)


def register_metadata(metadata, user_id):
    try:
        mongo_handler.SaveUserData(user_id, metadata)
    except Exception as err:
        print(err)
        return {'error': err}

    return 'ok'


def search_percentages(user_id):
    try:
        return (mongo_handler.GetPercentages(user_id).get('percentages'))
    except:
        return("Error")


def change_percentages(percentages, user_id):
    try:
        mongo_handler.SavePercentages(user_id, percentages)
        return ("ok")

    except Exception as err:
        print(err)
        return {'error': err}


def change_role(new_role, user_id):

    print("change_role\n", new_role, user_id)

    headers = {
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
    }

    try:
        response = json.loads(requests.get(
            "https://cesar-nds.auth0.com/api/v2/users/"+user_id+"/roles", headers=headers).text)

    except Exception as err:
        print("user id", user_id)
        print('Error roles', err)
        return err

    id_prev_role = ''

    print("RESPONSE CHANGE\n", response)

    if len(response) != 0:
        id_prev_role = response[0].get("id")

    try:
        roles = json.loads(requests.get(
            "https://cesar-nds.auth0.com/api/v2/roles", headers=headers).text)

    except Exception as err:
        return err

    id_new_role = ''

    for role in roles:

        if role.get("name") == new_role:

            id_new_role = role.get("id")

    if id_prev_role != '':

        print("OLD ROLE", id_prev_role)

        params = {'roles': [id_prev_role]}

        try:
            requests.delete("https://cesar-nds.auth0.com/api/v2/users/" +
                            user_id+"/roles", headers=headers, data=json.dumps(params))

        except Exception as err:
            return err

    if id_new_role != '':

        print("NEW ROLE", id_new_role)

        params = {'roles': [id_new_role]}

        try:
            requests.post("https://cesar-nds.auth0.com/api/v2/users/" +
                          user_id+"/roles", headers=headers, data=json.dumps(params))

        except Exception as err:
            return err

        if new_role == 'pro':
            percentages = {

                "twitter": 20,
                "news": 20,
                "sat": 10,
                "dof": 10,
                "court": 10,
                "ofac": 10,
                "onu": 10,
                "pep": 10

            }
        elif new_role == 'intermedio':
            percentages = {
                "twitter": 20,
                "news": 20,
                "sat": 20,
                "dof": 20,
                "court": 20,
                "ofac": 0,
                "onu": 0,
                "pep": 0
            }
        elif new_role == 'basico':
            percentages = {
                "twitter": 50,
                "news": 50,
                "sat": 0,
                "dof": 0,
                "court": 0,
                "ofac": 0,
                "onu": 0,
                "pep": 0
            }

        mongo_handler.SavePercentages(user_id, percentages)

    return 'ok'

    # req_del = requests.delete('https://cesar-nds.auth0.com/api/v2/users/google-oauth2%7C100400286586226161312/roles')

def register_user(data):
    headers = {
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(
            "https://cesar-nds.auth0.com/api/v2/users", headers=headers, json=data)

        if response.status_code < 200 or response.status_code >= 300:
            return response.json()

        response = response.json()
        data = {
            'user_id': response.get("user_id", "")
        }

        requests.post("https://cesar-nds.auth0.com/api/v2/jobs/verification-email", 
                      headers=headers, json=data)

        return response

    except Exception as err:
        print('Error register', err)
        return err
