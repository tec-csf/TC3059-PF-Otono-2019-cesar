import logging
import requests
import base64
import json
import cv2
import six
import io
import os
from PIL import Image
import moviepy.editor as mp
from time import gmtime, strftime
from difflib import SequenceMatcher
from pdf2image import convert_from_path
from google.cloud import vision, language, speech
from google.cloud.language import enums, types
from azure.storage.blob import BlockBlobService, PublicAccess

logger = logging.getLogger(__name__)

def hasNumbers(inputString):
    return any(char.isdigit() for char in inputString)

"""
Receive two url's image in order to compare the faces and determine if they are the same person
"""
def compare_faces(name_img1, name_img2, folder = 0):
    facedId1 = ""
    facedId2 = ""
    
    if folder == 0:
        url = os.environ.get('URL_BLOB3')
    elif folder == 1:
        url = os.environ.get('URL_BLOB2')
    
    url_image1 = url + name_img1
    url_image2 = url + name_img2

    # Request headers set Subscription key which provides access to this API
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': os.environ.get('FACE_KEY'),
    }

    # Request URL 
    FaceApiDetect = os.environ.get('URL_DETECT') 

    body = dict()
    body["url"] = url_image1
    body = str(body)

    try:
        # REST Call 
        response = requests.post(FaceApiDetect, data=body, headers=headers) 
        facedId1 = response.json()[0]["faceId"]
        response = requests.get(url_image1)
        img = Image.open(io.BytesIO(response.content))  
        width, height = img.size
        if width < 200 and height < 200:
            print("El tamano de la imagen debe ser mayor a 200 pixeles tanto de altura como de lo ancho")
            facedId1 = ""
    except Exception as e:
        print(e)
    
    if not facedId1:
        output = {}
        output["error"] = "Imagen no reconocida de url_image1"
        return output

    body = dict()
    body["url"] = url_image2
    body = str(body)

    try:
        # REST Call 
        response = requests.post(FaceApiDetect, data=body, headers=headers) 
        facedId2 = response.json()[0]["faceId"]
        response = requests.get(url_image2)
        img = Image.open(io.BytesIO(response.content))  
        width, height = img.size
        if width < 200 and height < 200:
            print("El tamano de la imagen debe ser mayor a 200 pixeles tanto de altura como de lo ancho")
            facedId2 = ""
    except Exception as e:
        print(e)
    
    if not facedId2:
        output = {}
        output["error"] = "Imagen no reconocida de url_image2"
        return output 

    body = dict()
    body["faceId1"] = facedId1
    body["faceId2"] = facedId2
    body = str(body)

    # Request URL 
    FaceApiDetect = os.environ.get('URL_VERIFY')

    try:
        # REST Call 
        response = requests.post(FaceApiDetect, data=body, headers=headers) 
        return response.json()

    except Exception as e:
        print(e)

def detect_text(path):
    """Detects text in the file."""
    client = vision.ImageAnnotatorClient()

    # [START vision_python_migration_text_detection]
    try:
        with io.open(path, 'rb') as image_file:
            content = image_file.read()
    except:
        output = {}
        output['error'] = "El archivo no pudo ser encontrado"
        return output

    image = vision.types.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    if texts:
        return texts[0].description
    else:
        output = {}
        output['error'] = "Texto no reconocido"
        return output

def read_text(string_pdf):
    counter = 1
    output = {}
    try:
        image_64_decode = base64.b64decode(string_pdf)
    except:
        return "String de imagen incorrecto", "", "" 

    pdf_result = open('output.pdf', 'wb') # create a writable image and write the decoding result 
    pdf_result.write(image_64_decode)
    pdf_result.close()
    pages = convert_from_path('output.pdf', 500)
    for page in pages:
        page.save('output' + str(counter) + '.jpg', 'JPEG')
        output[counter - 1] = detect_text('output' + str(counter) + '.jpg')
        counter += 1

    #remove the pdf
    os.remove("output.pdf")
    for i in range(1, counter):
        os.remove('output' + str(i) + '.jpg')
    return output

def get_url(string_image, pdf):
    try:
        # Create the BlockBlockService that is used to call the Blob service for the storage account
        block_blob_service = BlockBlobService(account_name='ocrimagerecognition', account_key=os.environ.get('BLOB_KEY'))
        # Create a container called 'quickstartblobs'.
        container_name ='fisicas'
        block_blob_service.create_container(container_name)
        # Set the permission so the blobs are public.
        block_blob_service.set_container_acl(container_name, public_access=PublicAccess.Container)
        # Receive the base64 string
        try:
            image_64_decode = base64.b64decode(string_image)
            print("--------------------DECODED\n")
        except:
            return "Archivo incorrecto", "", "" 
        if pdf == 'true':
            pdf_result = open('output.pdf', 'wb') # create a writable image and write the decoding result 
            pdf_result.write(image_64_decode)
            pdf_result.close()
            pages = convert_from_path('output.pdf', 500)
            for page in pages:
                page.save('output.jpg', 'JPEG')
                break
        else:
            image_result = open('output.jpg', 'wb') # create a writable image and write the decoding result 
            image_result.write(image_64_decode)
            image_result.close()

        type_image, words, list_v1, list_v2, list_v3, list_v4 = identify_card('output.jpg')
        if len(words) > 0:
            if type_image == 1:
                if words[0].find('CREDENCIAL PARA') != -1: 
                    for i in range(1, len(words) - 2):
                        if words[i] == 'CREDENCIAL' and words[i + 1] == 'PARA':
                            if abs(list_v1[i][1] - list_v2[i + 1][1]) > 50 and abs(list_v4[i][1] - list_v3[i + 1][1]) > 50:
                                return "Documento en mala posicion", "", ""
                            break
                else:
                    for i in range(1, len(words) - 2):
                        if len(words[i]) > 3 and len(words[i + 1]) > 3: 
                            if abs(list_v1[i][1] - list_v2[i + 1][1]) > 50 and abs(list_v4[i][1] - list_v3[i + 1][1]) > 50:
                                return "Documento en mala posicion", "", ""
                            break
            elif type_image == 4:
                if words[0].find('Estados Unidos') != -1: 
                    for i in range(1, len(words) - 2):
                        if words[i] == 'Estados' and words[i + 1] == 'Unidos':
                            if abs(list_v1[i][1] - list_v2[i + 1][1]) > 50 and abs(list_v4[i][1] - list_v3[i + 1][1]) > 50:
                                return "Documento en mala posicion", "", ""
                            break
                else:
                    for i in range(1, len(words) - 2):
                        if len(words[i]) > 3 and len(words[i + 1]) > 3: 
                            if abs(list_v1[i][1] - list_v2[i + 1][1]) > 50 and abs(list_v4[i][1] - list_v3[i + 1][1]) > 50:
                                return "Documento en mala posicion", "", ""
                            break
        if type_image:
            if type_image == 1: #INE
                name, birthdate, sex, address, id_card, curp, rfc = read_ine(words, list_v1, list_v2, list_v3, list_v4)
            elif type_image == 3: #professional license
                name, birthdate, sex, address, id_card, curp, rfc = read_professional_license(words)
            elif type_image == 4: #passport
                name, birthdate, sex, address, id_card, curp, rfc = read_passport(words, list_v1, list_v2, list_v3, list_v4)
            else:
                return "Documento no identificado", "", ""
            output = set_format(name, birthdate, sex, address, id_card, curp, rfc)
            if type_image == 1 and (name == [] or address == []) and birthdate == [] and sex == '' and id_card == '' and curp == '':
                return "Documento en mala posicion", "", ""
            elif type_image == 4 and birthdate == [] and id_card == '' and sex == '':
                return "Documento en mala posicion", "", ""
            else:
                output_json = json.loads(output)
        else:
            return "Documento no identificado", "", "" 

        img_name = output_json["name"]["first_surname"][:3] + "_"
        img_name += output_json["name"]["first_name"][:3] + "_"
        img_name += strftime("%Y_%m_%d_%H_%M_", gmtime())
        if type_image == 1:
            img_name += "ine.jpg"
        elif type_image == 2:
            img_name += "lic.jpg"
        elif type_image == 3:
            img_name += "ced.jpg"
        elif type_image == 4:
            img_name += "pas.jpg"
        # Create a file in Documents to test the upload and download.
        local_path=os.path.abspath(os.path.curdir)
        #local_file_name =input("Enter file name to upload : ")
        full_path_to_file =os.path.join(local_path, 'output.jpg')

        # Upload the created file, use local_file_name for the blob name
        block_blob_service.create_blob_from_path(container_name, img_name, full_path_to_file)
        #remove the image
        os.remove("output.jpg")
        if pdf == 'true':
            os.remove("output.pdf")

        # List the blobs in the container
        generator = block_blob_service.list_blobs(container_name)
        url_blob = block_blob_service.make_blob_url(container_name, img_name)
        if type_image == 1:
            return output_json, img_name, "ine"
        elif type_image == 2:
            return output_json, img_name, "licencia"
        elif type_image == 3:
            return output_json, img_name, "cedula"
        elif type_image == 4:
            return output_json, img_name, "pasaporte"

    except Exception as e:
        print(e)

def remove_accents(input_str):
    #remove accents from a given string
    output_str = ""
    for x in input_str:
        if x == 'Á':
            output_str += 'A'
        elif x == 'É':
            output_str += 'E'
        elif x == 'Í':
            output_str += 'I'
        elif x == 'Ó':
            output_str += 'O'
        elif x == 'Ú':
            output_str += 'U'
        elif x == 'Ñ':
            output_str += 'N'
        else:
            output_str += x
    return output_str

def identify_card(name_img):
    """Detects text in the file."""
    words = []
    list_v1 = []
    list_v2 = []
    list_v3 = []
    list_v4 = []
    type_image = 0
    client = vision.ImageAnnotatorClient()

    # [START vision_python_migration_text_detection]
    try:
        with io.open(name_img, 'rb') as image_file:
            content = image_file.read()
    except:
        print("El archivo no pudo ser encontrado")
        return 0, [], [], [], [], []

    image = vision.types.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    if texts:
        if texts[0].description.find("CREDENCIAL PARA VOTAR") != -1:
            type_image = 1
        elif texts[0].description.find("LICENCIA DE CONDUCIR") != -1:
            type_image = 2
        elif texts[0].description.find("LICENSIA DE CONDUCIR") != -1:
            type_image = 2
        elif texts[0].description.find("LICENSIADE CONDUCIR") != -1:
            type_image = 2
        elif texts[0].description.find("LICENSIA PARA CONDUCIR") != -1: 
            type_image = 2    
        elif texts[0].description.find("LICENCIA PARA CONDUCIR") != -1:
            type_image = 2
        elif texts[0].description.find("CEDULA PROFESIONAL") != -1:
            type_image = 3
        elif texts[0].description.find("CÉDULA PROFESIONAL") != -1:
            type_image = 3
        elif texts[0].description.find("PASAPORTE") != -1:
            type_image = 4
        else:
            type_image = False
        for text in texts:
            words.append(text.description)
            list_v1.append((text.bounding_poly.vertices[0].x, text.bounding_poly.vertices[0].y))
            list_v2.append((text.bounding_poly.vertices[1].x, text.bounding_poly.vertices[1].y))
            list_v3.append((text.bounding_poly.vertices[2].x, text.bounding_poly.vertices[2].y))
            list_v4.append((text.bounding_poly.vertices[3].x, text.bounding_poly.vertices[3].y))
        return type_image, words, list_v1, list_v2, list_v3, list_v4
    else:
        return 0, [], [], [], [], []

def order_address(address):
    key_words = ['D.F.', 'D.F', 'CDMX', 'MICH.', 'MICH', 'MEX.']
    street = ''
    colony = ''
    state = ''
    zip_ = ''
    city = ''
    flag_street = False
    flag_colony = False
    for i, word in enumerate(address):
        if word == 'C' or word == 'AND' or word == 'AV' or word == 'CDA' or word == '1A': 
            street += word + " "
            flag_street = True
        elif word == 'COL' or word == 'COL.' or word == 'CTON' or word == 'CTO' or word == 'FRACC':
            colony += word + " "
            flag_street = False
            flag_colony = True
        elif flag_colony and (len(word) == 5 or len(word) == 4) and word.isdigit():
            if len(word) == 5:
                zip_ = word
            elif len(word) == 4:
                zip_ = '0' + word
            i += 1
            break
        elif flag_street:
            street += word + ' '
        elif flag_colony:
            colony += word + ' '
    while address[i][-1] != ',' and i + 1 != len(address):      
        if len(address) - i > 1 and (address[i + 1][0] == ',' or address[i + 1] in key_words):
            break
        city += address[i] + ' '
        if len(address[i]) > 4 and (address[i][-3 : ] in key_words or address[i][-4 : ] in key_words):
            city_state = address[i].split(',')
            city = city_state[0]
            state = city_state[1]
            break
        i += 1
    if address[i][-1] == ',':
        city += address[i][0:-1]
        state = address[i + 1]
    elif len(address) - i > 1:
        if address[i + 1][0] == ',':
            city += address[i]
            state = address[i + 1][1:]
        elif address[i + 1] in key_words:
            city += address[i]
            state = address[i + 1]
    elif len(address) - i == 1 and city == '' and state == '' and address[i].find(',') != -1:
        city_state = address[i].split(',')  
        city = city_state[0]
        state = city_state[1]      
    return [street.strip(), colony.strip(), zip_, city.strip(), state] 

def isrfc(string):
    if len(string) != 13:
        return False
    if not string[ : 4].isalpha():
        return False
    if not string[4 : 10].isdigit():
        return False
    return True

def isminicurp(string):
    if len(string) != 10:
        return False
    if not string[ : 4].isalpha():
        return False
    if not string[4 : 10].isdigit():
        return False
    return True

def read_driver_license(words):
    key_words = ['CDMX', 'RFC', 'MEXICANA', 'ESTADOS', 'UNIDOS', 'MEXICANOS', 'GOBIERNO', 'DEL', 'DISTRITO', 'FEDERAL', 'SECRETARIA', 'DE', 'TRANSPORTES', 'VIALIDAD', 'LICENCIA', 'PARA', 'CONDUCIR', 'TIPO', 'PERMANENTE']
    name = []
    list_name = []
    curp = ""
    rfc = ""
    i = 0
    while True:
        if len(words[i]) == 9 and words[i][0].isalpha() and words[i][1 : ].isdigit():
            id_card = words[i]        
            break
        elif len(words[i]) == 1 and words[i].isalpha() and len(words[i + 1]) == 8 and words[i + 1].isdigit():
            id_card = words[i] + words[i + 1]
            break 
        i += 1
    if len(words) - i < 7:
        i = 0
    while not isrfc(words[i]) and not isminicurp(words[i]):
        if words[i].isupper() and words[i].isalpha() and not words[i] in key_words and not len(words[i]) == 1:
            name.append(words[i])
        i += 1
    if isrfc(words[i]):
        rfc = words[i]
    elif isminicurp(words[i]):
        curp = words[i]
    if len(name) == 0:
        while not words[i].isupper() or not words[i].isalpha():
            i += 1
    if len(name) == 0:
        while words[i].isupper() and words[i].isalpha() and not words[i] in key_words:
            name.append(words[i])
            i += 1
    if len(name) == 0:
        i += 1
        while words[i].isupper() and words[i].isalpha() and not words[i] in key_words:
            name.append(words[i])
            i += 1
    if len(name) != 0:
        list_name.append(name[-2])
        list_name.append(name[-1])
        length = len(name) - 2
        for j in range(length):
            list_name.append(name[j])
        return list_name, [], "", "", id_card, curp, rfc
    return [], [], "", "", id_card, curp, rfc

def read_ine(words, list_v1, list_v2, list_v3, list_v4):
    name = []
    address = []
    birthdate = []
    sex = ''
    curp = ''
    id_card = ''
    pos = 1
    flag_sex = 0
    flag_curp = 0
    flag_name = 0
    flag_address = 0
    flag_birthdate = 0
    flag_key_elector = 0
    #get the key words of the ine
    while words[pos] != 'NOMBRE' and words[pos] != 'NMBRE' and pos + 1 != len(words):
        pos += 1
    flag_name = pos
    pos = 1
    if words[0].find('EDAD') == -1:
        while pos + 3 != len(words):
            if words[pos] == 'FECHA' and words[pos + 1] == 'DE' and (words[pos + 2] == 'NACIMIENTO' or words[pos + 2] == 'NACIMENTO'):
                break
            elif words[pos] == 'FECHA' and (words[pos + 1] == 'NACIMIENTO' or words[pos + 1] == 'NACIMENTO'):
                break
            pos += 1
        flag_birthdate = pos
        #get the birthdate of the user
        for i in range(len(words)):
            if len(words[i]) == 10 and words[i][2] == '/' and words[i][5] == '/' and list_v1[i][0] > list_v4[flag_birthdate][0] and list_v2[i][0] < list_v3[flag_birthdate + 2][0] and list_v1[i][1] > list_v4[flag_birthdate][1]:
                birthdate = words[i].split('/')
    else:
        while pos + 1 != len(words):
            if words[pos] == 'EDAD':
                break
            pos += 1
        flag_birthdate = pos
    pos = 1       
    while words[pos] != 'DOMICILIO' and pos + 1 != len(words):
        pos += 1
    flag_address = pos
    pos = 1
    while words[pos] != 'SEXO' and words[pos] != 'SEXOH' and words[pos] != 'SEXOM' and pos + 1 != len(words):
        pos += 1
    flag_sex = pos
    if words[pos] == 'SEXOH':
        sex = 'H'
    elif words[pos] == 'SEXOM':
        sex = 'M'
    pos = 1
    while pos + 4 != len(words) and (words[pos] != 'CLAVE' or words[pos + 1] != 'DE' or words[pos + 2] != 'ELECTOR'):
        pos += 1
    flag_key_elector = pos
    pos = 1
    while words[pos] != 'CURP' and pos + 1 != len(words):
        pos += 1
    flag_curp = pos
    #get the name of the user
    if flag_name != len(words) - 1 and flag_birthdate + 3 != len(words):
        for i in range(len(words)):
            if list_v1[i][1] > list_v1[flag_name][1] and list_v1[i][0] < list_v1[flag_birthdate][0] and list_v4[i][1] < list_v4[flag_address][1]:   
                name.append(words[i])
    #get the sex of the user
    if flag_sex != len(words) - 1 and sex == '':
        for i in range(len(words)):
            if len(words[i]) == 1 and list_v1[i][0] >= list_v2[flag_sex][0] and list_v1[i][1] <= list_v2[flag_sex][1]:
                if sex == 'H' or sex == 'M':
                    sex = words[i]
    #get the address of the user
    if flag_address != len(words) - 1:
        for i in range(len(words)):
            if list_v1[i][1] > list_v4[flag_address][1] and list_v1[flag_key_elector][1] > list_v4[i][1] and list_v4[flag_birthdate][0] > list_v1[i][0] and list_v2[i][0] >= list_v4[flag_address][0]: 
                address.append(words[i])
    #get the id card of the user
    if flag_key_elector != len(words) - 1:
        for i in range(len(words)):
            if len(words[i]) == 18 and list_v1[i][0] > list_v2[flag_key_elector + 2][0] and list_v1[i][1] - 10 < list_v2[flag_key_elector + 2][1] and list_v4[i][1] + 10 > list_v3[flag_key_elector + 2][1]:
                id_card = words[i]
                break
    #get the curp of the user
    if flag_curp != len(words) - 1:
        for i in range(len(words) - 2):    
            if hasNumbers(words[i]) and (len(words[i]) == 18 or len(words[i]) + len(words[i + 1]) == 18) and list_v1[i][0] > list_v2[flag_curp][0] and list_v1[i][1] - 10 < list_v2[flag_curp][1] and list_v4[i][1] + 10 > list_v3[flag_curp][1]:
                curp = words[i]
                if len(curp) != 18 and len(curp) + len(words[i + 1]) == 18:
                    curp += words[flag_curp + 2]
                break
    if len(address) != 0:
        address = order_address(address)
    return name, birthdate, sex, address, id_card, curp, ""

def read_professional_license(words):
    name = []
    array_rows = words[0].split('\n')
    last_name = ""
    first_name = ""
    career = ""
    professional_license = ""
    for i, row in enumerate(array_rows):
        if row == "CEDULA PROFESIONAL" or row == "CÉDULA PROFESIONAL": 
            break
    for j in range(i + 1, len(array_rows)):
        if array_rows[j].isdigit():
            professional_license = array_rows[j]
        elif array_rows[j] != "SEP" and not last_name:
            last_name = array_rows[j]
        elif array_rows[j] != "SEP" and not first_name:
            first_name = array_rows[j]
        elif array_rows[j] == "FIRMA DEL TITULAR":
            break
        elif first_name:
            career += array_rows[j] + " "
    name = last_name.split() + first_name.split()
    return name, "", "", "", professional_license, "", ""

def read_passport(words, list_v1, list_v2, list_v3, list_v4):
    flag_expedition_date = 0
    flag_passport_number = 0
    flag_nationality = 0
    flag_birthplace = 0
    flag_birthdate = 0
    flag_lastname = 0
    flag_name = 0
    flag_curp = 0
    flag_sex = 0
    pos = 1
    sex = ''
    curp = ''
    id_card = ''
    lastname = ''
    firstname = ''
    birthdate = []
    #get the position of the tags
    while pos + 1 != len(words) and words[pos - 1] != 'Pasaporte' or (words[pos] == 'No' and words[pos] == 'No.'):
        pos += 1
    flag_passport_number = pos
    pos = 1
    while pos + 1 != len(words) and words[pos].find('Apellidos') == -1:
        pos += 1
    flag_lastname = pos
    pos = 1
    while pos + 1 != len(words) and words[pos].find('Nombres') == -1:
        pos += 1
    flag_name = pos
    pos = 1
    while pos + 1 != len(words) and (words[pos] != 'Fecha' or words[pos + 1] != 'de' or (words[pos + 2].find('nacimiento') == -1 and words[pos + 2].find('nacimento') == -1 and words[pos + 2].find('nacimente') == -1 and words[pos + 2].find('naciniento') == -1)):
        pos += 1
    flag_birthdate = pos
    pos = 1
    while pos + 1 != len(words) and (words[pos] != 'Fecha' or words[pos + 1] != 'de' or (words[pos + 2].find('expedicion') == -1 and words[pos + 2].find('expedición') == -1 and words[pos + 2].find('expedition') == -1)):
        pos += 1
    flag_expedition_date = pos
    pos = 1
    while pos + 1 != len(words) and ((words[pos] != 'Lugar' and words[pos].find('Lugar') != -1 and words[pos].find('Eugar') != -1) or words[pos + 1] != 'de'):
        pos += 1
    flag_birthplace = pos
    pos = 1
    while pos + 1 != len(words) and words[pos].find('CURP') == -1:
        pos += 1
    flag_curp = pos
    pos = 1
    while pos + 1 != len(words) and words[pos].find('Sexo') == -1:
        pos += 1
    flag_sex = pos
    pos = 1
    while pos + 1 != len(words) and (words[pos].find('Nacionalidad') == -1 and words[pos].find('Nacionafidad') == -1):
        pos += 1
    flag_nationality = pos
    if flag_passport_number != len(words) - 1:
        for i in range(len(words)):
            if len(words[i]) == 9 and words[i][0].isalpha() and words[i][1 : ].isdigit() and list_v1[i][1] > list_v1[flag_passport_number][1] and list_v1[i][0] > list_v4[flag_passport_number][0]:
                id_card = words[i]
    if flag_lastname != len(words) - 1 and flag_name != len(words) - 1:
        for i in range(len(words)):
            if words[i].isalpha() and words[i].isupper() and list_v4[i][1] >= list_v1[flag_lastname][1] and list_v1[flag_name][1] >= list_v4[i][1]: 
                lastname += words[i] + ' '
    if flag_name != len(words) - 1 and flag_nationality != len(words) - 1:
        for i in range(len(words)):
            if words[i].isalpha() and words[i].isupper() and list_v1[i][1] >= list_v4[flag_name][1] and list_v1[flag_nationality][1] >= list_v4[i][1]:
                firstname += words[i] + ' '
    if flag_birthdate != len(words) - 1 and flag_sex != len(words) - 1:
        for i in range(len(words) - 4):
            if list_v1[i][1] >= list_v4[flag_birthdate][1] and list_v1[flag_sex][1] >= list_v4[i][1]:
                eraser = words[i] + words[i + 1]
                eraser2 = words[i] + words[i + 1] + words[i + 2]
                eraser3 = words[i] + words[i + 1] + words[i + 2] + words[i + 3]
                if words[i].isdigit() and (len(words[i]) == 2 or len(words[i]) == 4):
                    birthdate.append(words[i])
                elif len(words[i]) == 18 and words[i].isupper() and words[i][ : 4].isalpha() and words[i][4 : 10].isdigit() and words[i][10 : 16].isalpha() and words[i][16 : ].isdigit():
                    curp = words[i]
                elif len(eraser) == 18 and eraser.isupper() and eraser[ : 4].isalpha() and eraser[4 : 10].isdigit() and eraser[10 : 16].isalpha() and eraser[16 : ].isdigit():
                    curp = eraser
                elif len(eraser2) == 18 and eraser2.isupper() and eraser2[ : 4].isalpha() and eraser2[4 : 10].isdigit() and eraser2[10 : 16].isalpha() and eraser2[16 : ].isdigit():
                    curp = eraser2
                elif len(eraser3) == 18 and eraser3.isupper() and eraser3[ : 4].isalpha() and eraser3[4 : 10].isdigit() and eraser3[10 : 16].isalpha() and eraser3[16 : ].isdigit():
                    curp = eraser3
    if curp == '':
        for i in range(len(words) - 4):
            eraser = words[i] + words[i + 1]
            eraser2 = words[i] + words[i + 1] + words[i + 2]
            eraser3 = words[i] + words[i + 1] + words[i + 2] + words[i + 3]
            if len(words[i]) == 18 and words[i].isupper() and words[i][ : 4].isalpha() and words[i][4 : 10].isdigit() and words[i][10 : 16].isalpha() and words[i][16 : ].isdigit():
                curp = words[i]
            elif len(eraser) == 18 and eraser.isupper() and eraser[ : 4].isalpha() and eraser[4 : 10].isdigit() and eraser[10 : 16].isalpha() and eraser[16 : ].isdigit():
                curp = eraser
            elif len(eraser2) == 18 and eraser2.isupper() and eraser2[ : 4].isalpha() and eraser2[4 : 10].isdigit() and eraser2[10 : 16].isalpha() and eraser2[16 : ].isdigit():
                curp = eraser2
            elif len(eraser3) == 18 and eraser3.isupper() and eraser3[ : 4].isalpha() and eraser3[4 : 10].isdigit() and eraser3[10 : 16].isalpha() and eraser3[16 : ].isdigit():
                curp = eraser3
    if flag_sex != len(words) - 1 and flag_birthplace != len(words) - 1 and flag_expedition_date != len(words) - 1:
        for i in range(len(words)):
            if len(words[i]) == 1 and list_v1[i][1] >= list_v4[flag_sex][1] and list_v1[flag_expedition_date][1] >= list_v4[i][1] and list_v4[flag_birthplace][0] > list_v2[i][0]:
                sex = words[i]
    elif flag_sex != len(words) - 1 and flag_birthplace != len(words) - 1:
        for i in range(len(words)):
            if len(words[i]) == 1 and list_v1[i][1] >= list_v4[flag_sex][1] and list_v4[flag_birthplace][0] > list_v2[i][0]:
                sex = words[i]
    elif flag_sex != len(words) - 1 and flag_expedition_date != len(words) - 1:
        for i in range(len(words)):
            if len(words[i]) == 1 and list_v1[i][1] >= list_v4[flag_sex][1] and list_v1[flag_expedition_date][1] >= list_v4[i][1]:
                sex = words[i]
    name = lastname.split() + firstname.split()
    if sex == 'M':
        sex = 'H' 
    elif sex == 'F':
        sex = 'M'
    return name, birthdate, sex, "", id_card, curp, ""

def set_format(name, birthdate, sex, address, id_card, curp, rfc):
    #prepare the information to send like a JSON
    if len(name) > 3:
        name[2] = " ".join(name[2:])
        output = {
            "name" : {
                "first_surname" : name[0],
                "second_surname" : name[1],
                "first_name" : name[2]
            }
        }
    elif len(name) == 2:
        output = {
            "name" : {
                "first_surname" : name[0],
                "second_surname" : name[1],
                "first_name" : ""
            }
        }
    elif len(name) == 3: 
        output = {
            "name" : {
                "first_surname" : name[0],
                "second_surname" : name[1],
                "first_name" : name[2]
            }
        }
    else:
        output = {
            "name" : {
                "first_surname" : "",
                "second_surname" : "",
                "first_name" : ""
            }
        }

    if len(birthdate) == 3:
        output["birthdate"] = {
            0 : birthdate[0],
            1 : birthdate[1],
            2 : birthdate[2]
        }
    else:
        output["birthdate"] = {
            0 : "",
            1 : "",
            2 : ""
        }
  
    if sex:
        output["sex"] = sex
    else:
        output["sex"] = ""
    
    if len(address) == 5:
        output["address"] = {
            "street" : address[0],
            "colony" : address[1],
            "zip" : address[2],
            "city" : address[3],
            "state" : address[4]
        }
    else:
        output["address"] = {
            "street" : "",
            "colony" : "",
            "zip" : "",
            "city" : "",
            "state" : ""
        }

    if id_card:
        output["id_card"] = id_card
    else:
        output["id_card"] = ""

    if curp:
        output["curp"] = curp
    else:
        output["curp"] = ""

    if rfc:
        output["rfc"] = rfc
    else:
        output["rfc"] = ""

    output_json = json.dumps(output)
    return output_json

def transcript_afore(string_img, string_video):
    name_img = 'input_img' + '_' + strftime("%Y_%m_%d_%H_%M_%S", gmtime()) + '.jpg'
    name_video = 'input_video.mp4'
    organization_origin = ''
    organization_destiny = ''
    type_image = 0

    # Receive the base64 string
    try:
        image_64_decode = base64.b64decode(string_img)
    except:
        return "Picture not received", "", "", "" 
    
    try:
        video_64_decode = base64.b64decode(string_video)
    except:
        return "Video not received", "", "", "" 
    
    img_result = open(name_img, 'wb') # create a writable image and write the decoding result 
    img_result.write(image_64_decode)
    img_result.close()

    video_result = open(name_video, 'wb') # create a writable image and write the decoding result 
    video_result.write(video_64_decode)
    video_result.close()

    upload_image(name_img)
    identity_verified, name_ine, name_speech = convert_video2pictures(name_video, name_img)
    transcript = transcribe_model_selection(name_video, 'default')
    os.remove('audio_output.wav')
    list_transcript = transcript.split()

    type_image, words, list_v1, list_v2, list_v3, list_v4 = identify_card(name_img)
    if len(words) > 0:
        if type_image == 1:
            if words[0].find('CREDENCIAL PARA') != -1: 
                for i in range(1, len(words) - 2):
                    if words[i] == 'CREDENCIAL' and words[i + 1] == 'PARA':
                        if abs(list_v1[i][1] - list_v2[i + 1][1]) > 50 and abs(list_v4[i][1] - list_v3[i + 1][1]) > 50:
                            return "", "", "", "", "Documento en mala posicion", ""
                        break
            else:
                for i in range(1, len(words) - 2):
                    if len(words[i]) > 3 and len(words[i + 1]) > 3: 
                        if abs(list_v1[i][1] - list_v2[i + 1][1]) > 50 and abs(list_v4[i][1] - list_v3[i + 1][1]) > 50:
                            return "", "", "", "", "Documento en mala posicion", ""
                        break

    if type_image == 1: #INE
        name, birthdate, sex, address, id_card, curp, rfc = read_ine(words, list_v1, list_v2, list_v3, list_v4)
        print("name", name)
        if len(name) > 2:
            first_surname = name[0]
            second_surname = name[1]
            first_name = name[2 : ]
            name = ' '.join(first_name) + ' ' + first_surname + ' ' + second_surname
        elif len(name) == 2:
            first_surname = name[0]
            second_surname = name[1]
            name = first_surname + ' ' + second_surname
        else:
            return "", "", "", "", "Documento no identificado", "" 
    else:
        return "", "", "", "", "Documento no identificado", ""
    
    name_verified = verify_name(name, list_transcript)
    entities_organization = detect_organizations(transcript)
    if len(entities_organization) == 2:
        organization_origin = entities_organization[-1]
        organization_destiny = entities_organization[0] 
    os.remove(name_img)
    os.remove(name_video)

    return identity_verified, name_verified, organization_origin, organization_destiny, name_ine, name_speech

def upload_image(name_img):
    # Create the BlockBlockService that is used to call the Blob service for the storage account
    block_blob_service = BlockBlobService(account_name='ocrimagerecognition', account_key=os.environ.get('BLOB_KEY'))

    # Create a container called 'quickstartblobs'.
    container_name ='demo'
    block_blob_service.create_container(container_name)

    # Set the permission so the blobs are public.
    block_blob_service.set_container_acl(container_name, public_access=PublicAccess.Container)

    # Create a file in Documents to test the upload and download.
    local_path=os.path.abspath(os.path.curdir)
    #local_file_name =input("Enter file name to upload : ")
    full_path_to_file =os.path.join(local_path, name_img)

    # Upload the created file, use local_file_name for the blob name
    block_blob_service.create_blob_from_path(container_name, name_img, full_path_to_file)

    # List the blobs in the container
    generator = block_blob_service.list_blobs(container_name)
    url_blob = block_blob_service.make_blob_url(container_name, name_img)

    return url_blob

def convert_video2pictures(name_file, name_img):
    # Read the video from specified path 
    cam = cv2.VideoCapture(name_file) 
    list_names = []
    currentframe = 0
    counter = 0
    identity_verified = False

    while(currentframe < 4):         
        # reading from frame 
        ret,frame = cam.read() 
        if ret: 
            # if video is still left continue creating images 
            name = 'frame' + str(currentframe) + '_' + strftime("%Y_%m_%d_%H_%M_%S", gmtime()) + '.jpg'
            list_names.append(name)
            print ('Creating...' + name) 

            # writing the extracted images 
            cv2.imwrite(name, frame) 
            upload_image(name)
            
            while True:
                res = compare_faces(name_img, name, 1)
                print('res', res)
                if 'error' in res:
                    img_rotate_90_clockwise = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE) 
                    name = 'frame' + str(currentframe) + '_' + strftime("%Y_%m_%d_%H_%M_%S", gmtime()) + '.jpg'
                    list_names.append(name)
                    print ('Creating...' + name) 
                    cv2.imwrite(name, img_rotate_90_clockwise) 
                    upload_image(name)
                else:
                    break
                if counter > 3:
                    break
                counter += 1

            if 'isIdentical' in res and res['isIdentical']:
                identity_verified = True
                break

            # increasing counter so that it will 
            # show how many frames are created 
            currentframe += 1
        else: 
            identity_verified = False
            break
        counter = 0
    # Release all space and windows once done 
    cam.release() 
    cv2.destroyAllWindows() 
    for name in list_names:
        os.remove(name)
    return identity_verified, name_img, name

def transcribe_model_selection(speech_file, model):
    """Transcribe the given audio file synchronously with
    the selected model."""
    text = ''
    name_audio = 'audio_output.wav'
    original_clip = mp.VideoFileClip(speech_file)
    if original_clip.duration >= 60:
        original_clip = mp.VideoFileClip(speech_file).subclip(0, 59)
    original_clip.audio.write_audiofile(name_audio)

    client = speech.SpeechClient()

    with open(name_audio, 'rb') as audio_file:
        content = audio_file.read()

    audio = speech.types.RecognitionAudio(content=content)

    config = speech.types.RecognitionConfig(
        encoding=speech.enums.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code='es-MX',
        audio_channel_count=2,
        model=model)

    response = client.recognize(config, audio)

    for i, result in enumerate(response.results):
        alternative = result.alternatives[0]
        print('-' * 20)
        print('First alternative of result {}'.format(i))
        print(u'Transcript: {}'.format(alternative.transcript))
        text = alternative.transcript 
    return text

def read_ine_afore(name_img):
    """Detects text in the file."""
    words = []
    name = []
    birthdate = ""
    i = 0 
    client = vision.ImageAnnotatorClient()

    # [START vision_python_migration_text_detection]
    try:
        with io.open(name_img, 'rb') as image_file:
            content = image_file.read()
    except:
        print("El archivo no pudo ser encontrado")
        return

    image = vision.types.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    if texts:
        for text in texts:
            words.append(text.description)

    while words[i] != 'NOMBRE' and words[i] != 'NMBRE':
        if words[i] == 'FECHA' and words[i + 1] == 'DE' and (words[i + 2] == 'NACIMIENTO' or words[i + 2] == 'NACIMENTO'):
            if words[i + 3][2] == '/' and words[i + 3][5] == '/':
                birthdate = words[i + 3].split('/')
        i += 1
    i += 1
    while words[i][:4] != 'SEXO' and words[i] != 'H' and words[i] != 'M' and words[i] != 'DOMICILIO': 
        if len(words[i]) > 6 and words[i][2] == '/' and words[i][5] == '/':
            birthdate = words[i].split('/')
        elif words[i] == 'FECHA' and words[i + 1] == 'DE' and (words[i + 2] == 'NACIMIENTO' or words[i + 2] == 'NACIMENTO'):
            i += 2
        elif words[i].isupper() and words[i].isalpha() and words[i] != 'EDAD':
            name.append(words[i])
        i += 1
    if len(name) > 2:
        first_surname = name[0]
        second_surname = name[1]
        first_name = name[2 : ]
    elif len(name) == 2:
        first_surname = name[0]
        second_surname = name[1]
        return first_surname + ' ' + second_surname 
    return ' '.join(first_name) + ' ' + first_surname + ' ' + second_surname

def verify_name(name_ine, list_transcript):
    #first case: verify the similarity between the name ine and the upper case words of the audio
    list_name = []
    last_position = 0
    pos_first_word = 0
    for i in range(1, len(list_transcript)):
        if list_transcript[i][0].isupper():
            if last_position == 0:
                pos_first_word = i
            if last_position == 0 or i - last_position <= 2:
                list_name.append(list_transcript[i])
                last_position = i
    name_audio = remove_accents(' '.join(list_name).upper())
    print('first case', name_audio)
    percentage_first_case = similar(name_ine, name_audio)
    print(percentage_first_case)
    #second case: count the amount of words in the name ine and compare them with the same amount of words of the audio
    list_name = []
    len_name = len(name_ine.split())
    for i in range(pos_first_word, pos_first_word + len_name):
        list_name.append(list_transcript[i])
    name_audio = remove_accents(' '.join(list_name).upper())
    print('second case', name_audio)
    percentage_second_case = similar(name_ine, name_audio)
    print(percentage_second_case)
    #finally compare which is the one with the best similarity
    if percentage_first_case > percentage_second_case:
        final_percentage = percentage_first_case
    else:
        final_percentage = percentage_second_case
    if final_percentage > 0.83:
        return True
    else: 
        return False

def detect_organizations(transcript):
    transcript = transcript.upper()
    banks = ['PROFUTURO', 'SURA', 'COPPEL', 'CITIBANAMEX', 'INBURSA', 'AZTECA', 'PENSIONISSSTE', 'PENSIONISTE', 'BANORTE', 'PRINCIPAL', 'INVERCAP']
    organizations = []

    for bank in banks:
        if transcript.find(bank) != -1:
            organizations.append(bank)
    return organizations

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()