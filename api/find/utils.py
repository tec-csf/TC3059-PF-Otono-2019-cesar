from models.mongo import Document
import datetime

mongo_handler = Document()

def get_employee(rfc, user_id, typeP):
    try:
        data = mongo_handler.DBget_employee(rfc, user_id, typeP)
        return data

    except Exception as e:
        print(e)


def get_percentage(user_id):
    try:
        user = mongo_handler.GetUserData(user_id)

        if user.get('percentages'):

            return user.get('percentages')
        else:
            return 'empty'

    except Exception as e:
        return e


def get_all_employees(user_id, from_txt, to_txt):
    if from_txt != "" and to_txt != "":
        from_date, to_date = correct_format(from_txt, to_txt)
        print()
        print("FROM", from_date)
        print("TO", to_date)
        print()

        try:
            employees = mongo_handler.DBget_all_employees_date(user_id, from_date, to_date)
            ogranizations = mongo_handler.DBget_all_organizations(user_id)

            data = [employees, ogranizations]

            return data

        except Exception as e:
            print(e)
    else:
        try:
            employees = mongo_handler.DBget_all_employees(user_id)
            ogranizations = mongo_handler.DBget_all_organizations(user_id)

            data = [employees, ogranizations]

            return data

        except Exception as e:
            print(e)


def correct_format(from_txt, to_txt):
    from_date = datetime.datetime.strptime(from_txt + ' 0:00', '%Y-%m-%d %H:%M')
    to_date = datetime.datetime.strptime(to_txt + ' 23:59', '%Y-%m-%d %H:%M')

    return from_date, to_date


def get_count_emp(user_id):
    try:
        employees = mongo_handler.get_count_employees(user_id)
        organizations = mongo_handler.get_count_organizations(user_id)

        data = [employees, organizations]

        print("EMPLOYEES", data)

        return data

    except Exception as e:
        print(e)


def retrieve_organization(organization):
    return mongo_handler.find_organization(organization)


def retrieve_person(person):
    return mongo_handler.find_person(person)
