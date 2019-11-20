from flask import jsonify
from models.mongo import Document
from bs4 import BeautifulSoup
import bs4
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
import threading
import pandas as pd
import urllib.parse
import time
import unicodedata
import unidecode
import re
import requests
import datetime
from dateutil.relativedelta import relativedelta
import json

mongo_handler = Document()

headers = {
    'User-agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.6.01001)'}
headless_mode = True

chrome_options = webdriver.ChromeOptions()
if headless_mode:
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument(
    "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")

NEWS_API_ADDRESS = "http://35.232.241.40"
# API_ADDRESS = "http://0.0.0.0:8080"
NEWS_SENTIMENTS_ENDPOINT = "/api/v1/sentiments/search_sentiments"
NEWS_FIND_ENDPOINT = "/api/v1/find/search"

TWITTER_API_ADDRESS = "https://twitter-demo-198922.appspot.com"
TWITTER_SENTIMENTS_ENDPOINT = "/api/v1/sentiments/search_sentiments"
TWITTER_TWEETS_ENDPOINT = "/api/v1/best_worst/search_best_worst"
TWITTER_UPDATE_ENDPOINT = "/api/v1/twitter/search_tweet"

def update_person_ids(data):

    id_list = mongo_handler.get_person_ids(data.get('rfc')).get('user_id')

    if data.get('user_id') in id_list:
        id_list.remove(data.get('user_id'))

    try:
        mongo_handler.update_person_ids(data.get('rfc'), id_list)
        return 'ok', 201
    
    except:
        return 'error', 422





def get_social_info(account):
    update_twitter(account)
    sentiments = search_negative_sentiments_tweets(account)
    tweets = search_negative_tweets(account)

    return sentiments, tweets


def update_twitter(account):
    url = TWITTER_API_ADDRESS + TWITTER_UPDATE_ENDPOINT
    response = requests.post(url, json={"word": account})


def search_negative_sentiments_tweets(account):
    url = TWITTER_API_ADDRESS + TWITTER_SENTIMENTS_ENDPOINT
    print(account)
    response = requests.post(url, json={"brand": account})
    try:
        sentiments = json.loads(response.text)

        # Get the negative sentiments
        all_sentiments = sentiments["brand"]["sentiments"]
        all_sentiments[2] += all_sentiments[3]

        return all_sentiments[:3]
    except:
        return []


def search_negative_tweets(account):
    negative_tweets = []
    url = TWITTER_API_ADDRESS + TWITTER_TWEETS_ENDPOINT

    # Get the response from the tweets api
    response = requests.post(url, json={"brand": account})
    list_of_tweets = json.loads(response.text)

    # Get the negative tweets
    negative_tweets = list_of_tweets["brand"]["worst"][:10]
    formated_tweets = []

    all_tweets = list_of_tweets["brand"]["all"][:20]

    for tweet in all_tweets:
        pos = tweet["text"].find('https://t.co')
        if pos != -1:
            url = tweet["text"][pos:]
            text = tweet["text"][:pos]
        else:
            url = ""
            text = tweet["text"]
        formated_tweets.append({
            "title": text,
            "date": tweet["user"],
            "url": url,
            "sentiment": tweet["sentiment"]
        })

    return formated_tweets

def find_social(data):
    sentiments_array = []
    tweets_array = []
    old_twitters = []
    append = False

    old = mongo_handler.get_twitters_person(data.get('rfc'))[0].get('twitter')

    old_twitters = old.get('url')
    old_sentiments = old.get('sentiments_array')

    twitters = []
    titles = []
    twitter_account = data.get('twitter_account')

    if old_twitters != None:
        for t in old_twitters:
            twitters.append(t)
            titles.append(t.get('title'))

    if twitter_account != '':
        t = {
            'title': twitter_account[0],
            'user_id': data.get('user_id'),
            'data': [],
            'status': 0
        }

        if twitter_account[0] not in titles:
            twitters.append(t)
        else:
            append = True

    status = 0
    i = 0
    if len(twitters) > 0:
        for twitter in twitters:

            user_ids = []

            if twitter.get('title') == twitter_account[0]:
                resultado, url = get_social_info(twitter.get('title'))
            else:
                resultado = old_sentiments[i]
                url = twitter.get('data')
                i += 1

            if twitter.get('user_id') is not None:
                user_ids[0]= twitter.get('user_id')

            if twitter.get('title') == twitter_account[0] and append and data.get('user_id')[0] not in user_ids:
                print("USER ID", user_ids)
                user_ids += data.get('user_id')

            sentiments_array.append(resultado)
            tweets_array.append({
                'title': twitter.get('title'),
                'data': url,
                'user_id': user_ids,
                'status': resultado[1]
            })

            status += resultado[1]

        status = status / len(twitter_account)

    if data.get('type') == 'moral':
        mongo_handler.update_organization_social(
            data.get('rfc'), status, tweets_array, sentiments_array, False)
    else:
        mongo_handler.update_person_social(data.get('rfc'), status,
                                           tweets_array, sentiments_array, False)


def delete_social(data):

    old = mongo_handler.get_twitters_person(data.get('rfc'))[0].get('twitter')

    urls = old.get('url')

    for url in urls:
        if url.get('title') == data.get('twitter_account'):

            if data.get('user_id') in url.get('user_id'):

                url['user_id'].remove(data.get('user_id'))

    if data.get('type') == 'fisica':
        mongo_handler.update_person_social(data.get('rfc'), old.get(
            'status'), urls, old.get('sentiments_array'), True)
    else:
        mongo_handler.update_person_social(data.get('rfc'), old.get(
            'status'), urls, old.get('sentiments_array'), True)

def search_onu(name, birthdate):
    list_birthdate = birthdate.split('-')
    day = list_birthdate[0]
    month = list_birthdate[1]
    year = list_birthdate[2]
    output = {}
    
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")
    chrome_options.add_argument('window-size=1200x700')
    basePage = 'https://scsanctions.un.org/search/'
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get(basePage)

    print("ONU PAGE", basePage)

    # name = remove_accents(name.strip())
    name = unidecode.unidecode(name)

    driver.find_element_by_xpath(
        '/html/body/center/form/table/tbody/tr[1]/td[7]/input').click()
    driver.find_element_by_xpath('//*[@id="adv"]/u').click()
    driver.find_element_by_xpath('//*[@id="yeardropdown"]').send_keys(year)
    driver.find_element_by_xpath('//*[@id="monthdropdown"]').send_keys(month)
    driver.find_element_by_xpath('//*[@id="daydropdown"]').send_keys(day)
    driver.find_element_by_xpath('//*[@id="include"]').send_keys(name)
    driver.find_element_by_xpath(
        '/html/body/center/form/table/tbody/tr[26]/td[3]/input').click()

    url = driver.current_url

    time.sleep(1)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    answer = soup.find("tr", {"class": "rowtext"})
    if answer:
        answer_string = answer.get_text()
        start_name = answer_string.find('Nombre: ')
        start_title = answer_string.find('Título: ')
        start_charge = answer_string.find('Cargo: ')
        start_birthdate = answer_string.find('Fecha de nacimiento: ')
        start_birthplace = answer_string.find('Lugar de nacimiento: ')
        start_good_alias = answer_string.find('Alias de buena calidad: ')
        start_low_alias = answer_string.find('Alias de baja calidad: ')
        start_nationality = answer_string.find('Nacionalidad: ')
        start_passport = answer_string.find('Número de pasaporte: ')
        start_id = answer_string.find('Número nacional de identidad: ')
        start_address = answer_string.find('Domicilio: ')
        start_date = answer_string.find('Fecha de inclusión: ')
        start_other_data = answer_string.find('Otros datos: ')

        name = answer_string[start_name + 8: start_title]
        title = answer_string[start_title + 8: start_charge]
        output['title'] = title
        charge = answer_string[start_charge + 7: start_birthdate]
        output['charge'] = charge
        birthdate = answer_string[start_birthdate + 21: start_birthplace]
        birthplace = answer_string[start_birthplace + 21: start_good_alias]
        output['birthplace'] = birthplace
        good_alias = answer_string[start_good_alias + 24: start_low_alias]
        output['good_alias'] = good_alias
        low_alias = answer_string[start_low_alias + 23: start_nationality]
        output['low_alias'] = low_alias
        nationality = answer_string[start_nationality + 14: start_passport]
        output['nationality'] = nationality
        passport = answer_string[start_passport + 21: start_id]
        output['passport'] = passport
        id_ = answer_string[start_id + 30: start_address]
        output['id'] = id_
        address = answer_string[start_address + 11: start_date]
        output['address'] = address
        date = answer_string[start_date + 20: start_other_data]
        output['date'] = date
        other_data = answer_string[start_other_data + 13:]
        output['other_data'] = other_data
        output['url'] = url

        for key in output:
            if output[key] == 'nd':
                output[key] = ''
    return output

def find_onu(data):
    url = []

    if data['type'] == 'fisica':
        name = data['name'] + ' ' + data['lastName1'] + ' ' + data['lastName2']
        res = search_onu(name, data['birthdate'])
    else:
        name = data['name']
        res = []

    if len(res) == 0:
        status = 0
    else:
        status = 100

        url.append({
            'date': res['date'],
            'text': res['other_data'],
            'url': res['url']
        })

    if data.get('type') == 'moral':
        mongo_handler.update_organization_onu(data.get('rfc'), status, url)
    else:
        mongo_handler.update_person_onu(data.get('rfc'), status, url)

    return res


def get_newspaper_info(entity):
    """This function recovers the sentiments from an entity in
        the complete list of newspapers
    Args:
        entity(string): Person or company to be looked in the news

    Returns:
        string: The sum of the negative sentiments (anger and disgust) in
                a 16% scale
    """
    to_date = datetime.datetime.today()
    from_date = to_date - datetime.timedelta(days=7)

    from_date = from_date.strftime('%Y-%m-%d')
    to_date = to_date.strftime('%Y-%m-%d')

    print("FROM", from_date)
    print("TO", to_date)

    sentiments, sentiments_newspapers = search_negative_sentiments_news(
        entity, from_date, to_date)
    news = search_negative_news(entity, from_date, to_date)
    news = arrange_news(news)

    return sentiments, news, sentiments_newspapers


def arrange_news(news):
    all_news = [
        {
            "title": "Universal",
            "data": []
        },
        {
            "title": "Milenio",
            "data": []
        },
        {
            "title": "El Sol",
            "data": []
        },
        {
            "title": "Heraldo",
            "data": []
        },
        {
            "title": "Financiero",
            "data": []
        },
        {
            "title": "Informador",
            "data": []
        },
        {
            "title": "Economista",
            "data": []
        }
    ]

    for new in news:
        if new["newspaper"] == "Universal":
            all_news[0]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        elif new["newspaper"] == "Milenio":
            all_news[1]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        elif new["newspaper"] == "Sol":
            all_news[2]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        elif new["newspaper"] == "Heraldo":
            all_news[3]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        elif new["newspaper"] == "Financiero":
            all_news[4]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        elif new["newspaper"] == "Informador":
            all_news[5]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        elif new["newspaper"] == "Economista":
            all_news[6]["data"].append({
                'title': new['headline'],
                'url': new['link'],
                'date': new['date'],
                'sentiment': new['sentiment']
            })
        else:
            print(new["newspaper"])

    return all_news


def search_negative_sentiments_news(entity, from_date, to_date):
    """This function recovers the sentiments from an entity in
        the complete list of newspapers
    Args:
        entity(string): Person or company to be looked in the news

    Returns:
        string: The sum of the negative sentiments (anger and disgust) in
                a 16% scale
    """
    url = NEWS_API_ADDRESS + NEWS_SENTIMENTS_ENDPOINT

    response = requests.post(url, json={
        "entity": entity,
        "from_date": from_date,
        "to_date": to_date
    })
    try:
        sentiments = json.loads(response.text)
        # Get the negative sentiments
        negative_sentiments = sentiments["emotion"] * 100
        print(negative_sentiments)
        return negative_sentiments, sentiments["newspapers"]
    except:
        return 0, sentiments["newspapers"]


def search_negative_news(entity, from_date, to_date):
    """This function searches in the api for the news, and then filters
       them to retrieve the negative ones
    Args:
        entity(string): Person or company to be looked in the news

    Returns:
        list: A list with all the news that predominate the negative
              sentiments looked for (anger and disgust)
    """
    news = []
    url = NEWS_API_ADDRESS + NEWS_FIND_ENDPOINT

    # Get the response from the news api
    response = requests.post(url, json={
        "entity": entity,
        "from_date": from_date,
        "to_date": to_date
    })
    list_of_news = json.loads(response.text)

    # Get the negative news
    for element in list_of_news:
        if element["sentiments"]["score"] >= 0.2:
            news.append({
                "headline": element["headline"],
                "link": element["link"],
                "newspaper": element["newspaper"],
                "date": element["date"],
                "sentiment": "positive"
            })
        elif element["sentiments"]["score"] <= -0.2:
            news.append({
                "headline": element["headline"],
                "link": element["link"],
                "newspaper": element["newspaper"],
                "date": element["date"],
                "sentiment": "negative"
            })
        else:
            news.append({
                "headline": element["headline"],
                "link": element["link"],
                "newspaper": element["newspaper"],
                "date": element["date"],
                "sentiment": "neutral"
            })

    return news

def find_news(data):
    if data.get('type') == 'moral':
        sentiments_score, negative_news, sentiments_newspapers = get_newspaper_info(
            data.get('name').title())
    else:
        sentiments_score, negative_news, sentiments_newspapers = get_newspaper_info(
            (data.get('name')+' '+data.get('lastName1')+' '+data.get('lastName2')).title())

    if data.get('type') == 'moral':
        mongo_handler.update_organization_news(
            data.get('rfc'), sentiments_score, negative_news, sentiments_newspapers)
    else:
        mongo_handler.update_person_news(data.get('rfc'), sentiments_score,
                                         negative_news, sentiments_newspapers)

def cedula_profesional(request):
    chrome_options = webdriver.ChromeOptions()
    tipoPersonaFiscal = request.get('type')
    if headless_mode:
       chrome_options.add_argument('--disable-extensions')
       chrome_options.add_argument('--headless')
       chrome_options.add_argument('--disable-gpu')
       chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")
    chrome_options.add_argument('window-size=1200x700')
    basePage = 'http://www.buholegal.com/consultasep/'
    response_data = {}
    response_data['resultado'] = 'no'
    response_data['fuente'] = basePage
    # Campos de nombre
    nombre = request.get('name')
    if request.get('lastName1', None):
        paterno = request.get('lastName1')
    else:
        paterno = ''

    if request.get('lastName2', None):
        materno = request.get('lastName2')
    else:
        materno = ''
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get(basePage)

    driver.find_element_by_xpath('//input[@name="nombre"]').send_keys(nombre)
    time.sleep(1)
    driver.find_element_by_xpath('//input[@name="paterno"]').send_keys(paterno)
    time.sleep(1)
    driver.find_element_by_xpath('//input[@name="materno"]').send_keys(materno)
    time.sleep(1)
    driver.find_element_by_xpath(
        "//input[@onclick='showWaitIndicator();']").click()
    WebDriverWait(driver, 40).until(
        EC.presence_of_element_located((By.ID, 'resultadosbusquedacedula')))
    resultPage = 'https://www.cedulaprofesional.sep.gob.mx/'
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    table = soup.find("table", id="resultadosbusquedacedula")
    rows = table.findChildren(['tr'])
    i = 0
    r = 0
    w, h = 5, len(rows)-1
    licenses = [[0 for x in range(w)] for y in range(h)]
    for row in rows:
        if i > 0:
            cells = row.findChildren('td')
            j = 0
            c = 0
            for cell in cells:
                if j == 0:
                    licenses[r][c] = (cell.string)
                    c = c+1
                if j == 4:
                    licenses[r][c] = (cell.string)
                    c = c+1
                if j == 5:
                    licenses[r][c] = (cell.string)
                    c = c+1
                if j == 6:
                    licenses[r][c] = (cell.string)
                    c = c+1
                if j == 7:
                    licenses[r][c] = (cell.string)
                    c = c+1
                j = j+1
            r = r+1
        i = i+1
    json_licenses = json.dumps(licenses, ensure_ascii=False).encode('utf8')

    driver.quit()
    return json_licenses, resultPage


def find_license(data):
    if data.get('type') == 'fisica':
        resultado, url = cedula_profesional(data)
        mongo_handler.update_person_licenses(
            data.get('rfc'), json.loads(resultado.decode('utf-8')), url)


def buscar_en_diario_oficial_de_la_federacion(request):

    rfc = request.get('rfc').upper()
    tipoPersonaFiscal = request.get('type')
    if tipoPersonaFiscal == 'moral':
        nombre = request.get('name')
    else:
        nombre = request.get(
            'name') + ' ' + request.get('lastName1') + ' ' + request.get('lastName2')
        nombre = unidecode.unidecode(nombre)
    nombre = nombre.replace(' ', '%20')
    #print(name)
    #print(rfc)

    # DOF Scraper
    today = datetime.datetime.now()
    ten_years_ago = today - relativedelta(years=10) + relativedelta(days=1)
    tweentie_years_ago = ten_years_ago - relativedelta(years=10)

    today = today.strftime('%Y-%m-%d').split("-")
    ten_years_ago = ten_years_ago.strftime('%Y-%m-%d').split("-")
    tweentie_years_ago = tweentie_years_ago.strftime('%Y-%m-%d').split("-")

    if rfc == "CBE930129JN9":
        rfc = "Corporación+Bebo"
        today = ["2005", "10", "06"]
        ten_years_ago = ["2000", "10", "06"]

    ### Pipe Section
    # term = rfc
    term = nombre
    date = today
    from_date_minus_ten_years = ten_years_ago
    ### Pipe Section

    headers = {
        'User-agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.6.01001)'}

    # Query this url to get results:
    web = "http://diariooficial.gob.mx/busqueda_detalle.php?vienede=avanzada&busqueda_cuerpo=C&BUSCAR_EN=C&textobusqueda="
    terms_to_search = term
    text_type = "&TIPO_TEXTO=Y"

    date_url = "&dfecha="

    dof_initial_day = from_date_minus_ten_years[2]
    extra1 = "%2F"
    dof_initial_month = from_date_minus_ten_years[1]
    extra2 = "%2F"
    dof_initial_year = from_date_minus_ten_years[0]

    until = "&choosePeriodDate=D&hfecha="

    dof_final_day = date[2]
    extra3 = "%2F"
    dof_final_month = date[1]
    extra4 = "%2F"
    dof_final_year = date[0]

    extra5 = "&orga%5B%5D=TODOS%2C0"

    # queryURL = web + terms_to_search + text_type + date_url + dof_initial_day + extra1 + dof_initial_month + extra2 + dof_initial_year + until + dof_final_day + extra3 + dof_final_month + extra4 + dof_final_year + extra5
    queryURL = web + term

    print(queryURL)

    r = requests.get(queryURL, headers=headers)
    r.encoding = 'utf-8'
    if r.status_code == 200:
        text = r.text
        try:
            bsObj = BeautifulSoup(text, "html.parser")
            # table = bsObj.find("table", {"id":"tablaGuardar"})
            # form = table.find("form", {"name":"formbus"})
            tables = bsObj.findAll("td", {"class": "txt_azul"})
        except AttributeError as e:
            response_data = {}
            response_data['resultado'] = 'no'
            response_data['fuente'] = queryURL
            return []
            # return response_data['resultado'], response_data['fuente']
            # return "Error: There was no table with id: tablaGuardar found in DOF"

        # Match a string like:
            # 1 - 10 de 21786
            # 0 - 0 DE 0
        # match_string_w_number_of_results = re.search(
        #     r"[0-9] - [0-9]* [d|D][e|E] [0-9]*",
        #     str(form)
        # )

        # # Create an array with the '1 - 10 de 21786' result divided by spaces
        # split_string_with_results = None if match_string_w_number_of_results is None else match_string_w_number_of_results.group(0).split(" ")
        # total_dof_results = 0 if split_string_with_results is None else int(split_string_with_results[4])
        tables = tables[2:]
        result = []
        for table in tables:
            response_data = {}
            response_data['date'] = table.find('b', '').get_text()
            text = table.find('span', {"class": "txt_azul"})
            a_url = table.find('a', {"class": ""}, href=True)
            response_data['text'] = text.get_text()
            response_data['url'] = a_url['href']
            # print('hola', table.find('b', '').get_text())
            # print('adio', table.find('a', {"class": "txt_azul"}).get_text())
            result.append(response_data)

        return result
    else:
        err_response = {'err': "Connection to diariooficial.gob.mx failed"}
        print(err_response)
        return []

def find_dof(data):
    url = buscar_en_diario_oficial_de_la_federacion(data)
    # print(url)
    if len(url) <= 0:
        status = 0
    else:
        status = 100

    if data.get('type') == 'moral':
        mongo_handler.update_organization_dof(data.get('rfc'), status, url)
    else:
        mongo_handler.update_person_dof(data.get('rfc'), status, url)


def se_encuentra_en_pep_blacklist(request):
    response_data = {}
    response_data['resultado'] = 'no'

    tipoPersonaFiscal = request.get('type')

    if tipoPersonaFiscal == 'moral':
        nombre = request.get('name')
    else:
        nombre = request.get(
            'name') + ' ' + request.get('lastName1') + ' ' + request.get('lastName2')

    basePepURL = "http://www.everypolitician.org"
    pep_country_url = basePepURL + "/" + \
        unidecode.unidecode(request.get(
            'country').lower().replace(' ', '-')) + '/'
    response_data['fuente'] = pep_country_url
    print(pep_country_url)
    r = requests.get(pep_country_url, headers=headers)
    if r.status_code == 200:
        html_doc = r.text
        soup = BeautifulSoup(html_doc, 'html.parser')
        nLink = soup.find('a', class_='avatar-unit').get('href')
        nr = requests.get(basePepURL+nLink, headers=headers)
        if nr.status_code == 200:  # 'Succesful connection'
            nhtml_doc = nr.text
            nsoup = BeautifulSoup(nhtml_doc, 'html.parser')
            peps = nsoup.find_all("div", class_="person-card__primary")
            for pep in peps:
                name = pep.find('h3').string.lower().replace(" ", "")
                description = pep.find('p').string.replace(
                    "                                  ", "")
                description = description.split(' — ')
                if name == nombre.lower().replace(" ", ""):
                    print(name)
                    print(description[0])
                    print(description[1])
                    response_data['resultado'] = 'si'
                    response_data['fuente'] = basePepURL+nLink
                    response_data['party'] = description[0]
                    response_data['state'] = description[1]
                    break
        else:
            print('Failed connection to PEP source')

        return response_data, response_data['fuente']

    else:
        response_data['error'] = "El nombre del país solicitado está mal escrito o no se encuentra en http://www.everypolitician.org/"
        return response_data['resultado'], response_data['fuente']


def find_pep(data):
    resultado, url = se_encuentra_en_pep_blacklist(data)
    res = []

    if resultado['resultado'] == "no":
        status = 0
    else:
        status = 100
        res = [{
            "url": url,
            "text": resultado["state"],
            "date": resultado["party"]
        }]

    if data.get('type') == 'moral':
        mongo_handler.update_organization_pep(data.get('rfc'), status, res)
    else:
        mongo_handler.update_person_pep(data.get('rfc'), status, res)

def se_encuentra_en_ofac_blacklist(request):
    tipoPersonaFiscal = request.get('type')
    if headless_mode:
       chrome_options.add_argument('--disable-extensions')
       chrome_options.add_argument('--headless')
       chrome_options.add_argument('--disable-gpu')
       chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")
    chrome_options.add_argument('window-size=1200x700')
    basePage = 'https://sanctionssearch.ofac.treas.gov/'
    response_data = {}
    response_data['resultado'] = 'no'
    response_data['fuente'] = basePage
    # Campos de nombre
    if tipoPersonaFiscal == 'moral':
        nombreCompleto = request.get('name')
    else:
        nombreCompleto = request.get(
            'name') + ' ' + request.get('lastName1') + ' ' + request.get('lastName2')
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get(basePage)

    driver.find_element_by_xpath(
        '//input[@name="ctl00$MainContent$txtLastName"]').send_keys(nombreCompleto)
    time.sleep(1)
    slider_input = driver.find_element_by_id(
        'ctl00_MainContent_Slider1_Boundcontrol')
    slider_slider = driver.find_element_by_id('Slider1_handleImage')
    change_slider = ActionChains(driver)
    change_slider.click_and_hold(
        slider_slider).move_by_offset(-78, 0).release().perform()
    time.sleep(1)
    driver.find_element_by_xpath(
        '//input[@name="ctl00$MainContent$btnSearch"]').click()
    WebDriverWait(driver, 40).until(EC.text_to_be_present_in_element(
        (By.ID, 'ctl00_MainContent_lblResults'), "Found"))

    # text_file = open("Output_test_scrapper.txt", "w")
    # text_file.write(driver.page_source)
    # print("Wrote file Output_test_scrapper.txt")
    # text_file.close()
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    if headless_mode:
        driver.quit()
    nombreCompleto = nombreCompleto.lower()
    nombreCompleto = ''.join((c for c in unicodedata.normalize(
        'NFD', nombreCompleto) if unicodedata.category(c) != 'Mn'))  # Quitar acentos
    array_nombre_completo = nombreCompleto.split()
    list_elements = soup.find_all('a', id='btnDetails')
    for element in list_elements:
        element_actual_string = element.__str__()
        ofac_name = element.string.replace(',', '').lower()
        ofac_name = ''.join((c for c in unicodedata.normalize(
            'NFD', ofac_name) if unicodedata.category(c) != 'Mn'))  # Quitar acentos
        array_ofac_nombre = ofac_name.split()
        # print('OFAC array:'+ str(array_ofac_nombre))
        # print('Nombre array:'+ str(array_nombre_completo))
        if (set(array_ofac_nombre).issubset(array_nombre_completo)):
            intersection = [
                val for val in array_ofac_nombre if val in array_nombre_completo]
            if len(intersection) >= 2:
                # We have a match
                print('Found a match in OFAC')
                found_url = ''
                for found_urlr in re.findall(r'\"Details\.aspx\?id=\d{1,50}\"', element_actual_string):
                    found_url += found_urlr
                    break
                response_data['resultado'] = 'si'
                response_data['fuente'] = basePage + found_url[1:-1]
                break

    if 'si' in response_data.values():
        print('Entered ofac saving mode:')
        print(tipoPersonaFiscal)
    return response_data['resultado'], response_data['fuente']


def find_ofac(data):
    resultado, url = se_encuentra_en_ofac_blacklist(data)
    res = []

    if resultado == "no":
        status = 0
    else:
        status = 100
        res.append({
            'date': '',
            'text': 'Se encontró en la lista de OFAC',
            'url': url
        })

    if data.get('type') == 'moral':
        mongo_handler.update_organization_ofac(data.get('rfc'), status, res)
    else:
        mongo_handler.update_person_ofac(data.get('rfc'), status, res)

def scrape_page(soup, nombre):
    #print('Received page, will begin scraping it...')
    # response_data['resultado'] = 'no'
    links = soup.find_all("a", class_="dxeHyperlink")
    for link in links:  # Deeper filtering
        if link.get_text().lower() == 'engroses':  # Clean repetitive links
            links.remove(link)
    totalLinks = len(links)
    #print('This page has %s link(s) to scrape' % totalLinks)
    results = []
    for linkIdx, link in enumerate(links):
        response_data = {}
        articleURL = 'http://www2.scjn.gob.mx/ConsultaTematica/PaginasPub/' + \
            link.get('href')
        #ndriver = webdriver.PhantomJS() # or add to your PATH
        #ndriver.set_window_size(1024, 768) # optional
        ndriver = webdriver.Chrome(chrome_options=chrome_options)
        ndriver.get(articleURL)
        articleSoup = BeautifulSoup(ndriver.page_source, 'html.parser')
        infoTables = articleSoup.find_all('table')
        tableText = ''
        allTds = []

        for table in infoTables:
            tempTds = table.find_all('td')
            for tempTd in tempTds:
                allTds.append(tempTd)
        currentTable = 0
        for td in allTds:
            currentTable += 1
            if isinstance(td, bs4.element.ResultSet):
                continue
            else:
                if currentTable == 2:
                    # print('date', td.get_text())
                    response_data['date'] = td.get_text()
                if currentTable == 4:
                    # print('text', td.get_text())
                    response_data['text'] = td.get_text()[:90] + '...'
                tableText += ' ' + td.get_text()
        # tableText is complete, let's now search for the person
        tableText = tableText.upper()
        nombre = nombre.upper()
        # foundNameAt = tableText.find(nombre)
        #print('Scraping '+str(linkIdx+1)+'/'+str(totalLinks))
        # if (foundNameAt != -1):
        # response_data['resultado']='si'
        response_data['url'] = articleURL
        if headless_mode:
            ndriver.quit()

        results.append(response_data)

    return results


def se_encuentra_en_supremacorte_blacklist(request):
    tipoPersonaFiscal = request.get('type')
    chrome_options = webdriver.ChromeOptions()
    if headless_mode:
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")
    chrome_options.add_argument('window-size=1200x700')
    # response_data = {}
    # response_data['resultado'] = 'no'
    # response_data['fuente'] = 'http://www2.scjn.gob.mx/ConsultaTematica/PaginasPub/TematicaPub.aspx'
    if tipoPersonaFiscal == 'moral':
        nombre = request.get('name')
    else:
        nombre = request.get(
            'name') + ' ' + request.get('lastName1') + ' ' + request.get('lastName2')
    if nombre.lower() == "Víctor Manuel Peña".lower():  # Special testing case for pagination
        nombreURL = 'Víctor'.lower().replace(' ', '%20')
    else:
        nombreURL = nombre.lower().replace(' ', '%20')
    nombreURL = urllib.parse.quote_plus(nombreURL).replace('%2520', '%20')
    pagerURL = 'http://www2.scjn.gob.mx/ConsultaTematica/PaginasPub/ResultadosPub.aspx?Tema=' + \
        nombreURL+'&Consecutivo=0&Anio=0&TipoAsunto=0&Pertenecia=0&MinistroID=0&SecretarioID=0&MateriaID=0'
    #driver = webdriver.PhantomJS() # or add to your PATH
    #driver.set_window_size(1024, 768) # optional
    driver = webdriver.Chrome(chrome_options=chrome_options)
    #print('Attempting to connect to scjn.gob.mx...')
    driver.get(pagerURL)
    #print('Connection succesful.')
    pagerSoup = BeautifulSoup(driver.page_source, 'html.parser')
    pagerElement = driver.find_element_by_xpath(
        '//*[@id="ctl00_MainContentPlaceHolder_UpdatePanelAccionInconstitucionalidad"]/div[2]/table/tbody/tr[2]/td').get_attribute('innerHTML')
    if pagerElement.strip(' \t\n\r') == '':
        print('No entries found in scjn.gob.mx')
        if headless_mode:
            driver.quit()
        return []
    else:
        numberOfPages = int(pagerElement.strip(' \t\n\r').split()[-1])
        #print('Number of pages:'+str(numberOfPages))
        for page in range(numberOfPages):
                # if response_data['resultado']=='si':
                #     break
                # else:
            if page == 0:
                result = scrape_page(pagerSoup, nombre)
            else:  # Go to next page
                try:
                    nextPageButton = driver.find_element_by_xpath(
                        '//*[@id="ctl00_MainContentPlaceHolder_pagerGridConsulta1"]/tbody/tr/td/table/tbody/tr/td[17]/img')
                    nextPageButton.click()
                    #print('Clicking on element to request next page...')
                    driver.save_screenshot('waiting.png')
                    try:
                        #print('Waiting for next page to load...')
                        # for i in range(60):
                        #     driver.implicitly_wait(1)
                        #     new_screenshot_path = 'waiting_%s.png'%i
                        #     print(new_screenshot_path)
                        #     driver.save_screenshot(new_screenshot_path)
                        WebDriverWait(driver, 40).until(
                            EC.invisibility_of_element_located((By.XPATH, '//*[@id="ctl00_MainContentPlaceHolder_loadingPanelConsultaAsuntos"]/tbody/tr')))
                    except:
                        print('Connection to scjn.gob.mx timed out.')
                    finally:
                        driver.save_screenshot('afterwait.png')
                        #print('Loaded next page')
                        pagerSoup = BeautifulSoup(
                            driver.page_source, 'html.parser')
                        #print('*'*50)
                        result = scrape_page(pagerSoup, nombre)
                except NoSuchElementException as e:
                    print(e)
        if headless_mode:
            driver.quit()

        return result


def find_court(data):
    url = se_encuentra_en_supremacorte_blacklist(data)

    if len(url) <= 0:
        status = 0
    else:
        status = 100

    if data.get('type') == 'moral':
        mongo_handler.update_organization_court(data.get('rfc'), status, url)
    else:
        mongo_handler.update_person_court(data.get('rfc'), status, url)

def search_csv(name, type_):
    name_files = ["Cancelados.csv", "Condonadosart146BCFF.csv", "Condonadosart21CFF.csv", "Condonadosart74CFF.csv", "CondonadosporDecreto.csv",
                  "Eliminados.csv", "Exigibles.csv", "Firmes.csv", "No_localizados.csv", "Retornoinversiones.csv", "Sentencias.csv"]
    list_json = []
    for x, file_ in enumerate(name_files):
        output_json = {}
        df = pd.read_csv(file_, encoding='latin1')
        df.set_index(type_, inplace=True)
        columns = df.columns
        try:
            for i, content in enumerate(df.loc[name]):
                if not pd.isna(content):
                    column = str(columns[i])
                    if len(column) < 65:
                        content = str(content)
                        content = unidecode.unidecode(content)
                        column = unidecode.unidecode(column)
                        column = column.replace(" ", "_")
                        output_json[column] = content
        except:
            print()
        if output_json:
            output_json['nombre_documento'] = name_files[x]
            output_json[type_] = name
            list_json.append(output_json)
    return list_json

def find_sat(data):
    res = search_csv(data.get('rfc'), 'RFC')
    url = []

    for r in res:
        url.append({
            'date': r['FECHAS_DE_PRIMERA_PUBLICACION'],
            'text': r['SUPUESTO'],
            'url': 'http://omawww.sat.gob.mx/cifras_sat/Paginas/datos/vinculo.html?page=ListCompleta69.html'
        })

    if len(res) == 0:
        status = 0
    else:
        status = 100

    if data.get('type') == 'moral':
        mongo_handler.update_organization_sat(data.get('rfc'), status, url)
    else:
        mongo_handler.update_person_sat(data.get('rfc'), status, url)

def find_rfc(data):
   if headless_mode:
      chrome_options.add_argument('--disable-extensions')
      chrome_options.add_argument('--headless')
      chrome_options.add_argument('--disable-gpu')
      chrome_options.add_argument('--no-sandbox')
   chrome_options.add_argument(
       "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")
   chrome_options.add_argument('window-size=1200x700')
   basePage = 'https://www.mi-rfc.com.mx/consulta-rfc-homoclave'
   driver = webdriver.Chrome(chrome_options=chrome_options)
   driver.get(basePage)
   birth = data['birthdate'].split('-')
   months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
             'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

   driver.find_element_by_xpath(
       '//input[@id="nameInput"]').send_keys(data['name'])
   driver.find_element_by_xpath(
       '//input[@id="fatherSurnameInput"]').send_keys(data['lastName1'])
   driver.find_element_by_xpath(
       '//input[@id="motherSurnameInput"]').send_keys(data['lastName2'])
   driver.find_element_by_xpath(
       '//select[@name="birth_day"]').send_keys(birth[0])
   driver.find_element_by_xpath(
       '//select[@name="birth_month"]').send_keys(months[int(birth[1])-1])
   driver.find_element_by_xpath(
       '//select[@name="birth_year"]').send_keys(birth[2])

   driver.find_element_by_xpath('//a[@class="button form-button"]').click()

   soup = BeautifulSoup(driver.page_source, 'html.parser')
   driver.quit()
   rfc = soup.find('span', {'class': 'rfc'}).getText()

   return rfc

def search(data):
    type = data['type']
    print(type)
    
    if type == 'fisica':
        rfc = find_rfc(data)
    else:
        rfc = data['rfc']

        for ent in data.get('entities'):

            data_fi = {
                "name": ent[0][0],
                "lastName1": ent[0][1],
                "lastName2": ent[0][2],
                "birthdate": ent[1],
                "country": data.get('addressCountry'),
                "user_id": data.get('user_id'),
                "type": 'fisica'
            }
            search(data_fi)

    if data.get('address') is None:
        data['address'] = ''
    if data.get('commercialTurn') is None:
        data['commercialTurn'] = ''
    if data.get('constitutionDate') is None:
        data['constitutionDate'] = ''
    if data.get('legalRepresentative') is None:
        data['legalRepresentative'] = ''
    if data.get('legalPosition') is None:
        data['legalPosition'] = ''
    if data.get('legalEmail') is None:
        data['legalEmail'] = ''
    if data.get('legalEmail') is None:
        data['legalEmail'] = ''
    if data.get('addressStreet') is None:
        data['addressStreet'] = ''
    if data.get('addressColony') is None:
        data['addressColony'] = ''
    if data.get('addressMunicipality') is None:
        data['addressMunicipality'] = ''
    if data.get('addressDelegation') is None:
        data['addressDelegation'] = ''
    if data.get('addressCity') is None:
        data['addressCity'] = ''
    if data.get('addressState') is None:
        data['addressState'] = ''
    if data.get('addressEntity') is None:
        data['addressEntity'] = ''
    if data.get('addressCountry') is None:
        data['addressCountry'] = ''
    if data.get('addressCP') is None:
        data['addressCP'] = ''
    if data.get('addressPhone') is None:
        data['addressPhone'] = ''
    if data.get('addressEmail') is None:
        data['addressEmail'] = ''
    if data.get('exteriorNum') is None:
        data['exteriorNum'] = ''
    if data.get('interiorNum') is None:
        data['interiorNum'] = ''
    if data.get('legalEmail') is None:
        data['legalEmail'] = ''
    if data.get('representatives') is None:
        data['representatives'] = []
    if data.get('corporateStructure') is None:
        data['corporateStructure'] = []
    if data.get('shareStructure') is None:
        data['shareStructure'] = []
    if data.get('file_type') is None:
        data['file_type'] = ''
    if data.get('file_url') is None:
        data['file_url'] = ''
    if data.get('email') is None:
        data['email'] = ''
    if data.get('ocupation') is None:
        data['ocupation'] = ''
    if data.get('twitter_account') is None:
        data['twitter_account'] = ''
    if data.get('curp') is None:
        data['curp'] = ''

    data['rfc'] = rfc
    data['percentage'] = 0
    if type == 'moral':
        if not mongo_handler.check_if_organization_exists(rfc):
            mongo_handler.create_organization(data)
        else:
            mongo_handler.update_organization(data)
    elif type == 'fisica':
        if not mongo_handler.check_if_person_exists(rfc):
            mongo_handler.create_person(data)
        else:
            mongo_handler.update_person(data)

    threads  = []

    # find_rfc(data)
    print('SAT')
    threads.append(threading.Thread(target=find_sat, args=(data,)))
    # find_sat(data)
    print('Supreme Court')
    threads.append(threading.Thread(target=find_court, args=(data,)))
    # find_court(data)
    print('OFAC')
    threads.append(threading.Thread(target=find_ofac, args=(data,)))
    # find_ofac(data)
    print('PEP')
    threads.append(threading.Thread(target=find_pep, args=(data,)))
    # find_pep(data)
    print('Diaro Oficial')
    threads.append(threading.Thread(target=find_dof, args=(data,)))

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

    threads = []

    # find_license(data)
    print('Cedulas Profesionales')
    threads.append(threading.Thread(target=find_license, args=(data,)))
    # find_dof(data)
    print('Newspapers')
    threads.append(threading.Thread(target=find_news, args=(data,)))
    # find_news(data)
    print('ONU')
    threads.append(threading.Thread(target=find_onu, args=(data,)))
    if data.get('twitter_account') is not None:
        print('Twitter')
        threads.append(threading.Thread(target=find_social, args=(data,)))
    else:
        data['twitter']['status'] = 0
        threads.append(threading.Thread(target=find_social, args=(data,)))
        # find_social(data)

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()

    # find_onu(data)

    if type == 'moral':
        mongo_handler.update_score_organization(rfc)
    elif type == 'fisica':
        mongo_handler.update_score_person(rfc)

    return jsonify({
        'result': 'completed'
    })


def create(data):
    name = data['name']
    type = data['type']

    print("CREATE", json.dumps(data, indent=2))

    if type == 'fisica':
        rfc = find_rfc(data)
    else:
        rfc = data['rfc']

        for ent in data.get('entities'):

            data_fi = {
                "name": ent[0][0],
                "lastName1": ent[0][1],
                "lastName2": ent[0][2],
                "birthdate": ent[1],
                "country": data.get('addressCountry'),
                "user_id": data.get('user_id'),
                "type": 'fisica'
            }
            create(data_fi)

    if data.get('address') is None:
        data['address'] = ''
    if data.get('commercialTurn') is None:
        data['commercialTurn'] = ''
    if data.get('constitutionDate') is None:
        data['constitutionDate'] = ''
    if data.get('legalRepresentative') is None:
        data['legalRepresentative'] = ''
    if data.get('legalPosition') is None:
        data['legalPosition'] = ''
    if data.get('legalEmail') is None:
        data['legalEmail'] = ''
    if data.get('legalEmail') is None:
        data['legalEmail'] = ''
    if data.get('addressStreet') is None:
        data['addressStreet'] = ''
    if data.get('addressColony') is None:
        data['addressColony'] = ''
    if data.get('addressMunicipality') is None:
        data['addressMunicipality'] = ''
    if data.get('addressDelegation') is None:
        data['addressDelegation'] = ''
    if data.get('addressCity') is None:
        data['addressCity'] = ''
    if data.get('addressState') is None:
        data['addressState'] = ''
    if data.get('addressEntity') is None:
        data['addressEntity'] = ''
    if data.get('addressCountry') is None:
        data['addressCountry'] = ''
    if data.get('addressCP') is None:
        data['addressCP'] = ''
    if data.get('addressPhone') is None:
        data['addressPhone'] = ''
    if data.get('addressEmail') is None:
        data['addressEmail'] = ''
    if data.get('exteriorNum') is None:
        data['exteriorNum'] = ''
    if data.get('interiorNum') is None:
        data['interiorNum'] = ''
    if data.get('legalEmail') is None:
        data['legalEmail'] = ''
    if data.get('representatives') is None:
        data['representatives'] = []
    if data.get('corporateStructure') is None:
        data['corporateStructure'] = []
    if data.get('shareStructure') is None:
        data['shareStructure'] = []
    if data.get('file_type') is None:
        data['file_type'] = ''
    if data.get('file_url') is None:
        data['file_url'] = ''
    if data.get('email') is None:
        data['email'] = ''
    if data.get('ocupation') is None:
        data['ocupation'] = ''
    if data.get('twitter_account') is None:
        data['twitter_account'] = ''
    if data.get('curp') is None:
        data['curp'] = ''

    data['rfc'] = rfc
    data['percentage'] = 0
    if type == 'moral':
        if not mongo_handler.check_if_organization_exists(rfc):
            mongo_handler.create_organization(data)
        else:
            mongo_handler.update_organization(data)
    elif type == 'fisica':
        if not mongo_handler.check_if_person_exists(rfc):
            mongo_handler.create_person(data)
        else:
            mongo_handler.update_person(data)

    return jsonify({
        'result': 'completed'
    })


def update_all():
    organizations = mongo_handler.list_organization().json
    people = mongo_handler.list_person().json

    # threads = []

    for organization in organizations[5]:
        organization['type'] = 'moral'
        search(organization)
        # threads.append(threading.Thread(target=search, args=(organization,)))
    for person in people[5]:
        person['type'] = 'fisica'
        search(person)
        # threads.append(threading.Thread(target=search, args=(person,)))

    # for thread in threads:
    #     thread.start()
    #
    # for thread in threads:
    #     thread.join()

    return jsonify({
        'result': 'completed'
    })
