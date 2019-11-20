""" Model of MongoDB interactions

Manage the connectivity with the Mongo database
and executes all the operations against the same.
"""
import logging
import datetime
import pytz
from bson.objectid import ObjectId
from flask import jsonify
import math

from common.db import mongo
import config

class Document:
    """ This class handles the MongoDB connectivity

    Attributes:
        logger(logging.Logger): The logger for the model
    """
    logger = logging.getLogger(__name__)

    def __init__(self):
        """ Initialize the collection for the future usage"""
        if mongo.db:
            self.person = mongo.db['person']
            self.organization = mongo.db['organization']
            self.users = mongo.db['users']
            self.tfjfa = mongo.db['tfjfa']

    def get_twitters_person(self, rfc):
        try:
            data = list(self.person.find({
                "rfc": rfc,
            }, {
                "twitter.url.title": 1,
                "twitter.url.user_id": 1,
                "twitter.url.data": 1,
                "twitter.url.status": 1,
                "twitter.sentiments_array": 1,
                "_id": 0
            }))
            return data
        except Exception as e:
            return(e)

    def get_count_employees(self, user_id):
        data = self.person.find({"user_id": user_id}).count()
        return data

    def get_count_organizations(self, user_id):
        data = self.organization.find({"user_id": user_id}).count()
        return data

    def DBget_all_employees(self, user_id):
        data = list(self.person.find({"user_id": user_id}, {'_id': 0}))
        return data

    def DBget_all_employees_date(self, user_id, from_date, to_date):
        data = list(self.person.find({"$and": [
            {"user_id": user_id},
            {"date": {"$gte": from_date, "$lte": to_date}}
        ]}, {'_id': 0}))
        return data

    def DBget_all_organizations(self, user_id):
        data = list(self.organization.find({"user_id": user_id}, {'_id': 0}))
        return data

    def DBget_employee(self, rfc, user_id, typeP):

        if typeP == 'fisica':
            data = list(self.person.find({
                "rfc": rfc,
                "user_id": user_id
            }, {'_id': 0}))
        else:
            data = list(self.organization.find({
                "rfc": rfc,
                "user_id": user_id
            }, {'_id': 0}))

        return data[0]

    def SaveUserData(self, user_id, data):
        try:
            self.users.update({
                "user_id": user_id
            }, {'$set': {
                "metadata": {
                    "user_id": user_id,
                    "user_name": data["user_name"],
                    "user_lastname": data["user_lastname"],
                    "email": data["email"],
                    "comp_name": data["comp_name"],
                    "r_z": data["r_z"],
                    "pers_type": data["pers_type"],
                    "RFC": data["RFC"],
                    "country": data["country"],
                    "city": data["city"],
                    "region": data["region"],
                    "street": data["street"],
                    "ex_num": data["ex_num"],
                    "int_num": data["int_num"],
                    "post_code": data["post_code"]
                }
            }},
                upsert=True
            )
        except Exception as err:

            print(err)

    def GetUserData(self, user_id):
        data = list(self.users.find({
            "user_id": user_id
        }, {
            "_id": 0,
            "metadata": 1,
            "percentages": 1

        }))

        try:
            return data[0]

        except Exception as err:
            return err

    def SavePercentages(self, user_id, percentages):
        try:
            self.users.update({
                "user_id": user_id
            }, {'$set': {
                "percentages": {
                    "court": percentages["court"],
                    "dof": percentages["dof"],
                    "news": percentages["news"],
                    "ofac": percentages["ofac"],
                    "onu": percentages["onu"],
                    "pep": percentages["pep"],
                    "sat": percentages["sat"],
                    "twitter": percentages["twitter"]
                }
            }},
                upsert=True
            )
        except Exception as e:

            print(e)

    def GetPercentages(self, user_id):

        data = list(self.users.find({
            "user_id": user_id
        }, {
            "_id": 0,
            "percentages": 1
        }))

        return data[0]

    def create_person(self, data):

        if (data['file_type'] != ''):
            self.person.insert({
                "name": data['name'],
                "lastName1": data['lastName1'],
                "lastName2": data['lastName2'],
                "rfc": data['rfc'],
                "curp": data['curp'],
                "address": data['address'],
                "email": data['email'],
                "country": data['country'],
                "ocupation": data['ocupation'],
                "birthdate": data['birthdate'],
                "date": datetime.datetime.now(),
                "score": 0,
                "percentage": 0,
                "user_id": [data['user_id']],
                'files': [{
                    'file': data['file_type'],
                    'url': data['file_url']}],
                'sat': {
                    'status': 0
                },
                'court': {
                    'status': 0
                },
                'ofac': {
                    'status': 0
                },
                'onu': {
                    'status': 0
                },
                'pep': {
                    'status': 0
                },
                'dof': {
                    'status': 0
                },
                'news': {
                    'status': 0
                },
                'twitter': {
                    'status': 0
                }
            })
        else:
            self.person.insert({
                "name": data['name'],
                "lastName1": data['lastName1'],
                "lastName2": data['lastName2'],
                "rfc": data['rfc'],
                "curp": data['curp'],
                "address": data['address'],
                "email": data['email'],
                "country": data['country'],
                "ocupation": data['ocupation'],
                "birthdate": data['birthdate'],
                "date": datetime.datetime.now(),
                "score": 0,
                "percentage": 0,
                "user_id": [data['user_id']],
                'files': [],
                'sat': {
                    'status': 0
                },
                'court': {
                    'status': 0
                },
                'ofac': {
                    'status': 0
                },
                'onu': {
                    'status': 0
                },
                'pep': {
                    'status': 0
                },
                'dof': {
                    'status': 0
                },
                'news': {
                    'status': 0
                },
                'twitter': {
                    'status': 0
                }
            })

    def create_organization(self, data):
        self.organization.insert({
            "name": data['name'],
            "user_id": [data['user_id']],
            "rfc": data['rfc'],
            "country": data['country'],
            "address": data['address'],
            "addressStreet": data['addressStreet'],
            "addressColony": data['addressColony'],
            "addressMunicipality": data['addressMunicipality'],
            "addressDelegation": data['addressDelegation'],
            "addressCity": data['addressCity'],
            "addressState": data['addressState'],
            "addressEntity": data['addressEntity'],
            "addressCountry": data['addressCountry'],
            "addressCP": data['addressCP'],
            "addressPhone": data['addressPhone'],
            "addressEmail": data['addressEmail'],
            "exteriorNum": data['exteriorNum'],
            "interiorNum": data['interiorNum'],
            "commercialTurn": data['commercialTurn'],
            "constitutionDate": data['constitutionDate'],
            "legalEmail": data['legalEmail'],
            "date": datetime.datetime.now(),
            "score": 0,
            'files': [],
            'sat': {
                'status': 0
            },
            'court': {
                'status': 0
            },
            'ofac': {
                'status': 0
            },
            'onu': {
                'status': 0
            },
            'pep': {
                'status': 0
            },
            'dof': {
                'status': 0
            },
            'news': {
                'status': 0
            },
            'twitter': {
                'status': 0
            }
        })

        if(len(data['representatives']) > 0):
            for i in range(0, len(data['representatives'])):
                self.organization.update(
                    {'rfc': data['rfc']},
                    {'$addToSet': {
                        'representatives': {
                            'name': data['representatives'][i][0],
                            'lastName1': data['representatives'][i][1],
                            'lastName2': data['representatives'][i][2],
                            'position': data['representatives'][i][3],
                            'email': data['representatives'][i][4],
                            'rfc': data['representatives'][i][5]}
                    }})

        if(len(data['corporateStructure']) > 0):
            for i in range(0, len(data['corporateStructure'])):
                self.organization.update(
                    {'rfc': data['rfc']},
                    {'$addToSet': {
                        'corporateStructure': {
                            'name': data['corporateStructure'][i][0],
                            'lastName1': data['corporateStructure'][i][1],
                            'lastName2': data['corporateStructure'][i][2],
                            'position': data['corporateStructure'][i][3],
                            'email': data['corporateStructure'][i][4],
                            'birthdate': data['corporateStructure'][i][5],
                            'rfc': data['corporateStructure'][i][6]}
                    }})

        if(len(data['shareStructure']) > 0):
            for i in range(0, len(data['shareStructure'])):
                self.organization.update(
                    {'rfc': data['rfc']},
                    {'$addToSet': {
                        'shareStructure': {
                            'name': data['shareStructure'][i][0],
                            'lastName1': data['shareStructure'][i][1],
                            'lastName2': data['shareStructure'][i][2],
                            'position': data['shareStructure'][i][3],
                            'email': data['shareStructure'][i][4],
                            'birthdate': data['shareStructure'][i][5],
                            'rfc': data['shareStructure'][i][6]}
                    }})

    def update_organization(self, data):
        self.organization.update(
            {'rfc': data['rfc']},
            {'$set': {
                "name": data['name'],
                "rfc": data['rfc'],
                "country": data['country'],
                "address": data['address'],
                "addressStreet": data['addressStreet'],
                "addressColony": data['addressColony'],
                "addressMunicipality": data['addressMunicipality'],
                "addressDelegation": data['addressDelegation'],
                "addressCity": data['addressCity'],
                "addressState": data['addressState'],
                "addressEntity": data['addressEntity'],
                "addressCountry": data['addressCountry'],
                "addressCP": data['addressCP'],
                "addressPhone": data['addressPhone'],
                "addressEmail": data['addressEmail'],
                "exteriorNum": data['exteriorNum'],
                "interiorNum": data['interiorNum'],
                "commercialTurn": data['commercialTurn'],
                "constitutionDate": data['constitutionDate'],
                "legalEmail": data['legalEmail'],
                "date": datetime.datetime.now(),
            }})

    def add_file_organization(self, data):
        self.organization.update(
            {'rfc': data['rfc']},
            {'$addToSet': {
                'files': {
                    'file': data['file_type'],
                    'url': data['file_url']}
            }})

    def add_file_person(self, data):
        self.person.update(
            {'rfc': data['rfc']},
            {'$addToSet': {
                'files': {
                    'file': data['file_type'],
                    'url': data['file_url']}
            }})

    def update_person(self, data):
        if not self.check_if_person_has_user(data['rfc'], data['user_id']):
            self.person.update(
                {'rfc': data['rfc']},
                {'$push': {
                    "user_id": data['user_id']
                }})

        self.person.update(
            {'rfc': data['rfc']},
            {'$set': {
                "name": data['name'],
                "lastName1": data['lastName1'],
                "lastName2": data['lastName2'],
                "rfc": data['rfc'],
                "curp": data['curp'],
                "address": data['address'],
                "email": data['email'],
                "country": data['country'],
                "ocupation": data['ocupation'],
                "birthdate": data['birthdate'],
                "date": datetime.datetime.now(),
                "score": 0,
                "percentage": 0
            }})


    def update_person_sat(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'sat': {
                    'status': status,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_sat(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'sat': {
                    'status': status,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_person_onu(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'onu': {
                    'status': status,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_onu(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'onu': {
                    'status': status,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_person_court(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'court': {
                    'status': status,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_court(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'court': {
                    'status': status,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_person_dof(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'dof': {
                    'status': status,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_dof(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'dof': {
                    'status': status,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_person_news(self, rfc, status, url, sentiments_newspapers):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'news': {
                    'status': status,
                    'sentiments_array': sentiments_newspapers,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_news(self, rfc, status, url, sentiments_newspapers):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'news': {
                    'status': status,
                    'sentiments_array': sentiments_newspapers,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_person_social(self, rfc, status, url, sentiments_array, delete):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'twitter': {
                    'status': status,
                    'sentiments_array': sentiments_array,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_social(self, rfc, status, url, sentiments_array, delete):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'twitter': {
                    'status': status,
                    'sentiments_array': sentiments_array,
                    'url': url}}})

        if delete:
            per = -12
        else:
            per = 12

        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': per}})

    def update_person_ids(self, rfc, ids):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'user_id': ids
            }}
        )

    def get_person_ids(self, rfc):
        data = list(self.person.find(
            {'rfc': rfc},
            {'user_id': 1, "_id": 0}
        ))

        return data[0]


    def update_person_ofac(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'ofac': {
                    'status': status,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_ofac(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'ofac': {
                    'status': status,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_sat69b(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'sat69b': {
                    'status': status,
                    'url': url}}})

    def update_person_sat69b(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'sat69b': {
                    'status': status,
                    'url': url}}})

    def update_person_pep(self, rfc, status, url):
        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'pep': {
                    'status': status,
                    'url': url}}})
        self.person.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_organization_pep(self, rfc, status, url):
        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'pep': {
                    'status': status,
                    'url': url}}})
        self.organization.update(
            {'rfc': rfc},
            {'$inc': {
                'percentage': 12}})

    def update_person_licenses(self, rfc, resultado, url):
        if(len(resultado) > 0):
            for i in range(0, len(resultado)):
                print(resultado[i][0])
                self.person.update(
                    {'rfc': rfc},
                    {'$addToSet': {
                        'licenses': {
                            'number': resultado[i][0],
                            'title': resultado[i][1],
                            'school': resultado[i][2],
                            'state': resultado[i][3],
                            'year': resultado[i][4],
                            'url': url}
                    }})

    def find_person(self, rfc):
        data = list(self.person.find({
            'rfc': rfc
        }, {'_id': 0, 'date': 0}))

        return data[0]

    def find_organization(self, rfc):
        data = list(self.organization.find({
            'rfc': rfc
        }, {'_id': 0, 'date': 0}))

        return data[0]

    def check_if_organization_exists(self, rfc):
        if self.organization.find({'rfc': rfc}).count() > 0:
            return True
        else:
            return False

    def check_if_person_exists(self, rfc):
        if self.person.find({'rfc': rfc}).count() > 0:
            return True
        else:
            return False

    def check_if_organization_has_user(self, rfc, user_id):
        if self.organization.find({'$and': [{'rfc': rfc}, {'user_id': user_id}]}).count() > 0:
            return True
        else:
            return False

    def check_if_person_has_user(self, rfc, user_id):
        if self.person.find({'$and': [{'rfc': rfc}, {'user_id': user_id}]}).count() > 0:
            return True
        else:
            return False

    def list_person(self):
        data = list(self.person.find({}, {'_id': 0}))
        paginador = self.dividir_paginador(data)

        return jsonify(paginador)

    def list_organization(self):
        data = list(self.organization.find({}, {'_id': 0}))
        paginador = self.dividir_paginador(data)

        return jsonify(paginador)

    def dividir_paginador(self, data):
        paginadorAF = []
        paginadorGL = []
        paginadorMQ = []
        paginadorRV = []
        paginadorWZ = []
        paginadorRespuesta = []

        for d in data:
            if d['name'].startswith(('A', 'B', 'C', 'D', 'E', 'F')):
                paginadorAF.append(d)
            elif d['name'].startswith(('G', 'H', 'I', 'J', 'K', 'L')):
                paginadorGL.append(d)
            elif d['name'].startswith(('M', 'N', 'O', 'P', 'Q')):
                paginadorMQ.append(d)
            elif d['name'].startswith(('R', 'S', 'T', 'U', 'V')):
                paginadorRV.append(d)
            elif d['name'].startswith(('W', 'X', 'Y', 'Z')):
                paginadorWZ.append(d)

        paginadorAF = sorted(paginadorAF, key=lambda k: k['name'])
        paginadorGL = sorted(paginadorGL, key=lambda k: k['name'])
        paginadorMQ = sorted(paginadorMQ, key=lambda k: k['name'])
        paginadorRV = sorted(paginadorRV, key=lambda k: k['name'])
        paginadorWZ = sorted(paginadorWZ, key=lambda k: k['name'])
        data = sorted(data, key=lambda k: k['name'])

        paginadorRespuesta.append(paginadorAF)
        paginadorRespuesta.append(paginadorGL)
        paginadorRespuesta.append(paginadorMQ)
        paginadorRespuesta.append(paginadorRV)
        paginadorRespuesta.append(paginadorWZ)
        paginadorRespuesta.append(data)

        return paginadorRespuesta

    def update_score_person(self, rfc):
        score = 100

        self.person.update(
            {'rfc': rfc},
            {'$set': {
                'score': math.ceil(score*100)/100,
                'percentage': 100
            }})

    def update_score_organization(self, rfc):
        score = 100

        self.organization.update(
            {'rfc': rfc},
            {'$set': {
                'score': math.ceil(score*100)/100,
                'percentage': 100
            }})

    def insert_expediente(self, document):
        self.tfjfa.insert(document)
