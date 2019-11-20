from bs4 import BeautifulSoup
import bs4
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import urllib.parse
from flask import jsonify
import time
import unicodedata
import re

headers = {'User-agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; FSL 7.0.6.01001)'}
headless_mode = True

def buscar_en_impi(request):
    # if request.method == 'POST':
    #     search_term = request.POST.get('nombre','Pepsi')
    # elif request.method == 'GET':
    #     search_term = request.GET.get('nombre','Pepsi')
    # else:
    #     search_term = 'Pepsi'
    search_term = request.get('nombre','Pepsi')
    # print('Code for all http verbs | with search_term:'+search_term)
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('headless')
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")
    chrome_options.add_argument('window-size=1200x700')
    basePage = 'http://marcanet.impi.gob.mx/marcanet/vistas/common/datos/bsqDenominacionCompleto.pgi'
    response_data = {}
    response_data['resultado'] = ''
    response_data['fuente'] = basePage
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get(basePage)
    driver.find_element_by_xpath('//*[@id="frmBsqDen:denominacionId"]').send_keys(search_term)
    driver.find_element_by_xpath('//*[@id="frmBsqDen:busquedaIdButton"]').click()
    WebDriverWait(driver,200).until(EC.presence_of_element_located((By.XPATH,'//*[@id="frmBsqDen:resultadoExpediente:j_idt98"]')))
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    table = soup.find(id="frmBsqDen:pnlResultados")
    table.find('thead').extract()
    raw_text = table.get_text()
    res_str = ''
    for numero_de_registros_raw in re.findall(r'Total de registros = [0-9]{1,45}', raw_text):
        for numero_de_registros in re.findall(r'[0-9]{1,45}', numero_de_registros_raw):
            response_data['numero_de_registros'] = numero_de_registros
            if int(numero_de_registros) > 0:
                res_str = 'Ya existen '+str(numero_de_registros)+' registros relacionados con el Signo Distintivo '+search_term+' ¿Quieres que intentemos con otro nombre?'

            else:
                res_str = 'El nombre '+search_term+' está disponible para ser registrado en el IMPI, ¿Quieres que generemos una Solicitud de Registro?'
    response_data['resultado'] = res_str
    driver.close()
    return jsonify(response_data)
