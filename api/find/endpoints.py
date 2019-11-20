from flask import Blueprint, request, jsonify
from . import utils

find_app = Blueprint('find_app', __name__)


@find_app.route('/get_employee/search', methods=['POST'])
def get_employee():
    data = request.json

    response = utils.get_employee(data['rfc'],data['user_id'], data['type'])
    user_metadata = utils.get_percentage(data['user_id'])

    sentiments_array = response.get('twitter').get('sentiments_array')
    urls = response.get('twitter').get('url')

    sentiments_array_final = []
    urls_final = []
    status = 0

    if len(sentiments_array) > 0:

        for i in range(len(sentiments_array)):

            if urls[i].get('user_id') != None:
                if data.get('user_id') in urls[i].get('user_id'):
        
                    status += urls[i].get('status')
                    sentiments_array_final.append(sentiments_array[i])
                    urls_final.append(urls[i])
            
    if len(urls_final) > 0:
        status = status / len(urls_final)

    twitter = {
        'sentiments_array': sentiments_array_final,
        'url': urls_final,
        'status': status
    }

    response['twitter'] = twitter

    total = 0

    for reg in user_metadata:

        aux = user_metadata.get(reg) * response.get(reg).get('status') / 100
        total += aux

        response[reg]['status'] = aux

        print(reg, aux)
    
    response['score'] = round(100 - total,2)
    return jsonify(response)
    

@find_app.route('/get_all_employees', methods=['POST'])
def get_all_employees():
    data = request.json

    response = utils.get_all_employees(
        data['user_id'], data['from_date'], data['to_date'])
    employees = response[0]
    organizations = response[1]
    user_metadata = utils.get_percentage(data['user_id'])

    max_percentage = 100
    min_percentage = 80
    print('id percentage', data['filter_percentages'])

    if data['filter_percentages'] == 0:
        max_percentage = 100
        min_percentage = 0
    elif data['filter_percentages'] == 1:
        max_percentage = 20
        min_percentage = 0
    elif data['filter_percentages'] == 2:
        max_percentage = 40
        min_percentage = 20
    elif data['filter_percentages'] == 3:
        max_percentage = 60
        min_percentage = 40
    elif data['filter_percentages'] == 4:
        max_percentage = 80
        min_percentage = 60
    elif data['filter_percentages'] == 5:
        max_percentage = 100
        min_percentage = 80

    employees_filtered = []

    if user_metadata != 'empty':
        # Fix persons data
        for i in range(len(employees)):

            total = 0

            employee = response[0][i]

            sentiments_array = employee.get('twitter').get('sentiments_array')
            urls = employee.get('twitter').get('url')

            sentiments_array_final = []
            urls_final = []
            status = 0

            if len(sentiments_array) > 0:

                for j in range(len(sentiments_array)):

                    if urls[j].get('user_id') != None:
                        if data.get('user_id') in urls[j].get('user_id'):
                
                            status += urls[j].get('status')
                            sentiments_array_final.append(sentiments_array[j])
                            urls_final.append(urls[j])
                    
            if len(urls_final) > 0:
                status = status / len(urls_final)

            twitter = {
                'sentiments_array': sentiments_array_final,
                'url': urls_final,
                'status': status
            }

            employee['twitter'] = twitter   

            for reg in user_metadata:
                aux = user_metadata.get(reg) * employee.get(reg).get('status') / 100
                total += aux

                response[0][i][reg]['status'] = aux
            
            response[0][i]['score'] = round(100 - total,2)

            if response[0][i]['score'] >= min_percentage and response[0][i]['score'] <= max_percentage:
                employees_filtered.append(response[0][i])

        # Fix organizations data
        for i in range(len(organizations)):

            total = 0

            organization = response[1][i]

            for reg in user_metadata:

                aux = user_metadata.get(reg) * organization.get(reg).get('status') / 100
                total += aux

                response[1][i][reg]['status'] = aux
            
            response[1][i]['score'] = round(100 - total,2)

        response[0] = employees_filtered

        return jsonify(response)
    else:
        return 'empty'


@find_app.route('/get_count_employee/search', methods=['POST'])
def get_count_employee():
    data = request.json

    response = utils.get_count_emp(data['user_id'])

    return jsonify({'count': response}), 200


@find_app.route('/get_info/search', methods=['POST'])
def get_info():
    data = request.json

    if data.get('organization') is not None:
        res = utils.retrieve_organization(data.get('organization'))
    elif data.get('person') is not None:
        res = utils.retrieve_person(data.get('person'))

    return jsonify(res), 201
