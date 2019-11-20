import threading 
import logging
import base64
import six 
import io
import re
import os
from config import CPU_CORES
from collections import deque
from difflib import SequenceMatcher
from pdf2image import convert_from_path
from time import gmtime, strftime, time
from PyPDF2 import PdfFileWriter, PdfFileReader
from azure.storage.blob import BlockBlobService, PublicAccess
from google.cloud import vision
from google.cloud import storage
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.protobuf import json_format

logger = logging.getLogger(__name__)
document_type = ''
pdf_name = ''
q = deque()

#return the percentage of similarity between two strings
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

#clean the string with no desired characters
def remove_characters(sentence):
    output = ""
    for i, x in enumerate(sentence):
        if x.isdigit() or x == '%' or x == '-' or x == '.':
            continue
        elif x == '.' and sentence[i - 1].isdigit():
            continue 
        else:
            output += x
    return output.strip()

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
        elif x == 'á':
            output_str += 'a'
        elif x == 'é':
            output_str += 'e'
        elif x == 'í':
            output_str += 'i'
        elif x == 'ó':
            output_str += 'o'
        elif x == 'ú':
            output_str += 'u'
        elif x == 'ñ':
            output_str += 'n'
        elif x == ' ':
            continue
        else:
            output_str += x
    return output_str

def string2date(string):
    list_words = string.split()
    months = {
        'ENERO' : '01',
        'FEBRERO' : '02',
        'MARZO' : '03',
        'ABRIL' : '04',
        'MAYO' : '05',
        'JUNIO' : '06',
        'JULIO' : '07',
        'AGOSTO' : '08',
        'SEPTIEMBRE' : '09',
        'OCTUBRE' : '10',
        'NOVIEMBRE' : '11',
        'DICIEMBRE' : '12'
    }
    day = ''
    month = ''
    year = ''
    for word in list_words:
        if len(word) == 2 and word.isdigit():
            day = word
        elif word in months:
            month = months[word]
        elif len(word) == 4 and word.isdigit():
            year = word
    return { 
        0 : day, 
        1 : month, 
        2 : year
    }

def isrfc(string):
    if len(string) != 12:
        return False
    if not string[ : 3].isalpha():
        return False
    if not string[3 : 9].isdigit():
        return False
    return True

def read_rfc(string_pdf):
    # Create a file in Documents to test the upload and download.
    local_path=os.path.abspath(os.path.curdir)

    try:
        image_64_decode = base64.b64decode(string_pdf)
    except:
        return "String de imagen incorrecto", "", "" 

    pdf_name = 'rfc_' + strftime("%Y_%m_%d_%H_%M.pdf", gmtime())
    pdf_result = open(pdf_name, 'wb') # create a writable image and write the decoding result 
    pdf_result.write(image_64_decode)
    pdf_result.close()

    upload_pdf(pdf_name, pdf_name, 'riesgo_cognitivo', 'rfc/')    
    text, list_words, list_v1, list_v2, list_v3, list_v4 = async_detect_document_rfc('gs://riesgo_cognitivo/rfc/' + pdf_name, 'gs://riesgo_cognitivo/archivos_json/') 
    output = find_rfc(list_words, list_v1, list_v2, list_v3, list_v4) 
    os.remove(pdf_name)
    return output

def find_rfc(list_words, list_v1, list_v2, list_v3, list_v4):
    rfc = ''
    #find content
    for i in range(len(list_words)):
        if len(list_words[i]) == 12 and list_words[i].isupper() and list_words[i][ : 3].isalpha() and list_words[i][3 : 9].isdigit():
            rfc = list_words[i]
            break
    return {'rfc': rfc}

def find_cif(list_words, list_v1, list_v2, list_v3, list_v4):
    flag_taxpayers = 0
    flag_taxpayers2 = 0
    flag_cedula = 0
    flag_name = 0
    flag_name2 = 0
    flag_end = 0
    idcif = ''
    name = ''
    rfc = ''
    #find tags
    for i in range(len(list_words) - 2):
        if (list_words[i] == 'CEDULA' or list_words[i] == 'CÉDULA') and list_words[i + 1] == 'DE':
            flag_cedula = i
            break
    if flag_cedula != 0:
        for i in range(len(list_words) - 3):
            if list_words[i] == 'VALIDA' and list_words[i + 1] == 'TU' and (list_words[i + 2] == 'INFORMACIÓN' or list_words[i + 2] == 'INFORMACION'):
                flag_end = i
                break
        for i in range(len(list_words) - 4):
            if list_words[i] == 'Registro' and list_words[i + 1] == 'Federal' and list_words[i + 2] == 'de' and list_words[i + 3] == 'Contribuyentes':
                flag_taxpayers = i
                flag_taxpayers2 = i + 3
                break
        for i in range(len(list_words) - 5):
            if list_words[i] == 'Nombre' and (list_words[i + 1] == 'denominación' or list_words[i + 1] == 'denominacion') and list_words[i + 2] == 'o' and (list_words[i + 3] == 'razón' or list_words[i + 3] == 'razon'):
                flag_name = i
                flag_name2 = i + 3
                break
            elif list_words[i] == 'Nombre' and list_words[i + 1] == ',' and (list_words[i + 2] == 'denominación' or list_words[i + 2] == 'denominacion') and list_words[i + 3] == 'o' and (list_words[i + 4] == 'razón' or list_words[i + 4] == 'razon'):
                flag_name = i
                flag_name2 = i + 4
                break
        for i in range(len(list_words) - 3):
            if list_words[i] == 'idCIF' and list_words[i + 1] == ':' and list_words[i + 2].isdigit() and len(list_words[i + 2]) >= 5: 
                idcif = list_words[i + 2]
                break
            elif list_words[i] == 'idCIF' and list_words[i + 1].isdigit() and len(list_words[i + 1]) >= 5: 
                idcif = list_words[i + 1]
                break
        #find content
        if flag_cedula != 0 and flag_taxpayers != 0 and flag_taxpayers2 != 0:
            for i in range(len(list_words)):
                if list_v1[i].y > list_v4[flag_cedula].y and list_v1[flag_taxpayers].y > list_v4[i].y: #verify the position at y
                    if list_v1[i].x > list_v1[flag_taxpayers].x and list_v2[flag_taxpayers2].x > list_v2[i].x: #verify the position at x
                        if len(list_words[i]) == 12 and list_words[i].isupper() and list_words[i][ : 3].isalpha() and list_words[i][3 : 9].isdigit():
                            rfc = list_words[i]
        if flag_name != 0 and flag_taxpayers != 0 and flag_name != 0 and flag_name2 != 0:
            for i in range(len(list_words)):
                if list_v1[i].y > list_v4[flag_taxpayers].y and list_v1[flag_name].y > list_v4[i].y: #verify the position at y
                    if list_v1[i].x > list_v1[flag_name].x and list_v2[flag_name2].x > list_v2[i].x: #verify the position at x
                        name += list_words[i] + ' ' 
        return {'rfc': rfc}
    else:
        return {'rfc': 'Cedula no identificada'}

def read_activity(text):
    i = 0
    activities = []
    percentages = []
    act_per = []
    reserved_words = ['Orden', 'Actividad Económica', 'Actividad Economica', 'Porcentaje Fecha Inicio', 
        'Porcentaje', 'Fecha', 'Inicio', 'Porcentaje Fecha', 'Fecha Inicio', 'Fecha Fin', 
        'Porcentaje Fecha Inicio Fecha Fin', 'Fecha Inicio Fecha Fin', 'Fin', 'porcenta']
    rows = text.split('\n')
    while rows[i] != 'Actividades Económicas:' and rows[i] != 'Actividades Economicas:':
        i += 1
    while rows[i] != 'Regimenes:' and rows[i] != 'Regímenes:':
        i += 1
        if rows[i] in reserved_words:
            continue
        elif remove_accents(rows[i]).isalpha():
            activities.append(rows[i])
        elif rows[i].isdigit() and int(rows[i]) > 9:
            percentages.append(rows[i])
    if len(activities) == len(percentages) or len(activities) > len(percentages):
        for i in range(len(activities)):
            act_per.append({ 'activity' : activities[i], 
                'percentage' : percentages[i]})
    elif len(activities) < len(percentages):
        for i in range(len(percentages)):
            act_per.append({ 'activity' : activities[i], 
                'percentage' : percentages[i]})
    return act_per

#clean the entities in order to get only the name of the founders
def filters(text):
    reserved_words = ['ELSEÑOR', 'SEÑOR', 'LICENCIADO', 'LIC', 'FIRMA']
    no_rows = ['A', 'NOMBRE', 'CARGO', 'Y', 'FECHA', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS',
        'SIETE', 'OCHO', 'NUEVE', 'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'ENERO', 'FEBRERO',
        'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
        'ASAMBLEA', 'SECRETARIA', 'SOCIEDAD', 'SECRETARIO', 'EDAD', 'GERENTE', 'GENERAL', 'FEDERALES',
        'ESTATALES', 'INSTRUMENTO', 'IMPUESTO', 'FEDERACIÓN', 'FEDERACION', 'ENUNCIATIVA', 'DOCUMENTO',
        'UNIDOS', 'REPRESENTANTES', 'REPRESENTANTE', 'SECRETARÍA']
    ordinal = ['PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA', 'SEXTA', 'SÉPTIMA', 'SEPTIMA','OCTAVA', 
        'NOVENA', 'DÉCIMA', 'DECIMA', 'UNDÉCIMA', 'UNDECIMA', 'DUODÉCIMA', 'DUODECIMA', 'VIGÉSIMA', 'VIGESIMA', 
        'TRIGÉSIMA', 'TRIGESIMA', 'CUADRAGÉSIMA', 'CUADRAGESIMA', 'PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 
        'QUINTO', 'SEXTO', 'SÉPTIMO', 'SEPTIMO','OCTAVO', 'NOVENO', 'DÉCIMO', 'DECIMO', 'UNDÉCIMO', 'UNDECIMO', 
        'DUODÉCIMO', 'DUODECIMO', 'VIGÉSIMO', 'VIGESIMO', 'TRIGÉSIMO', 'TRIGESIMO', 'CUADRAGÉSIMO', 'CUADRAGESIMO']
    words = {}
    output_json = {}
    rows = []
    final = set()
    final2 = []
    final3 = []
    final4 = []
    final5 = []
    alike = []
    array_insiders = []
    list_rows = text.split('\n')
    for row in list_rows:
        list_words = row.split()
        if len(list_words) > 2 and len(list_words) < 6 and len(row) > 12:
            eraser = row.upper()
            eraser = remove_characters(eraser)
            rows.append(eraser)
    
    for row in rows:
        flag = True
        name = row.split()
        if row[-1] == '.':
            row = row[ : -1]
        for word in no_rows:
            if flag and (word in name or word in ordinal):
                flag = False
        if flag:
            final.add(row)
    
    for row in final:
        flag = True
        list_words = row.split()
        for i in range(len(list_words) - 1):
            word = list_words[i] + list_words[i + 1]
            if word.find('.') != -1:
                word = word.replace('.', '')
            if word in ordinal:
                flag = False
                break
        if flag:
            final2.append(row)
    
    for row in final2:
        flag = True
        list_words = row.split()
        for i in range(len(list_words) - 2):
            word = list_words[i] + list_words[i + 1] + list_words[i + 2]
            if word.find('.') != -1:
                word = word.replace('.', '') 
            if word in ordinal:
                flag = False
                break
        if flag:
            final3.append(row)
    
    for row in final3:
        flag = True
        for word in ordinal:
            if row.find(word) != -1:
                flag = False
        if flag:
            final4.append(row)
    
    for row in final4:
        new_row = ""
        list_words = row.split()
        for word in list_words:
            if not word in reserved_words:
                new_row += word + " "       
        final5.append(new_row.strip())
   
    for i in range(len(final5)):
        if final5[i] != '':
            alike.append(set())
            alike[-1].add(final5[i])
            for j in range(i + 1, len(final5)):
                if similar(final5[i], final5[j]) >= 0.8:
                    alike[-1].add(final5[j])
                    final5[j] = ''

    for i, elements in enumerate(alike):
        inside = []
        for j, element in enumerate(elements):
            inside.append(element)
        array_insiders.append(inside)
    output_json = array_insiders
    return output_json

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

def detect_entities(text):
    output = ""
    client = language.LanguageServiceClient()

    if isinstance(text, six.binary_type):
        text = text.decode('utf-8')

    # Instantiates a plain text document.
    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects entities in the document. You can also analyze HTML with:
    #   document.type == enums.Document.Type.HTML
    entities = client.analyze_entities(document).entities

    for entity in entities:
        entity_type = enums.Entity.Type(entity.type)
        if entity_type.name == 'PERSON':
            eraser = entity.name + "\n"
            output += eraser

    return output

def async_detect_document(gcs_source_uri, gcs_destination_uri):
    """OCR with PDF/TIFF as source files on GCS"""
    annotation = ''
    list_json = []
    # Supported mime_types are: 'application/pdf' and 'image/tiff'
    mime_type = 'application/pdf'

    # How many pages should be grouped into each json output file.
    batch_size = 2

    client = vision.ImageAnnotatorClient()
    feature = vision.types.Feature(
        type=vision.enums.Feature.Type.DOCUMENT_TEXT_DETECTION)

    gcs_source = vision.types.GcsSource(uri=gcs_source_uri)
    input_config = vision.types.InputConfig(
        gcs_source=gcs_source, mime_type=mime_type)

    gcs_destination = vision.types.GcsDestination(uri=gcs_destination_uri)
    output_config = vision.types.OutputConfig(
        gcs_destination=gcs_destination, batch_size=batch_size)

    async_request = vision.types.AsyncAnnotateFileRequest(
        features=[feature], input_config=input_config,
        output_config=output_config)

    operation = client.async_batch_annotate_files(
        requests=[async_request])

    operation.result(timeout=180)

    # Once the request has completed and the output has been
    # written to GCS, we can list all the output files.
    storage_client = storage.Client()

    match = re.match(r'gs://([^/]+)/(.+)', gcs_destination_uri)
    bucket_name = match.group(1)
    prefix = match.group(2) + 'out'

    bucket = storage_client.get_bucket(bucket_name)

    # List objects with the given prefix.
    blob_list = list(bucket.list_blobs(prefix=prefix))
    for blob in blob_list:
        list_json.append(blob.name) 

        # Since we specified batch_size=2, the first response contains
        # the first two pages of the input file.
        output = blob
        json_string = output.download_as_string()
        response = json_format.Parse(json_string, vision.types.AnnotateFileResponse())

        # The actual response for the first page of the input file.
        for res in response.responses:
            annotation += res.full_text_annotation.text

    for name in list_json:
        delete_blob(bucket_name, name)

    # Here we print the full text from the first page.
    # The response contains more information:
    # annotation/pages/blocks/paragraphs/words/symbols
    # including confidence scores and bounding boxes
    return annotation

def async_detect_document_rfc(gcs_source_uri, gcs_destination_uri):
    """OCR with PDF/TIFF as source files on GCS"""
    annotation = ''
    text = ''
    word_ = ''
    list_words = []
    list_json = []
    list_v1 = []
    list_v2 = []
    list_v3 = []
    list_v4 = []
    ll_words = []
    ll_v1 = []
    ll_v2 = []
    ll_v3 = []
    ll_v4 = []
    listw_selected = []
    listv1_selected = []
    listv2_selected = []
    listv3_selected = []
    listv4_selected = [] 
    # Supported mime_types are: 'application/pdf' and 'image/tiff'
    mime_type = 'application/pdf'

    # How many pages should be grouped into each json output file.
    batch_size = 2

    client = vision.ImageAnnotatorClient()
    feature = vision.types.Feature(
        type=vision.enums.Feature.Type.DOCUMENT_TEXT_DETECTION)

    gcs_source = vision.types.GcsSource(uri=gcs_source_uri)
    input_config = vision.types.InputConfig(
        gcs_source=gcs_source, mime_type=mime_type)

    gcs_destination = vision.types.GcsDestination(uri=gcs_destination_uri)
    output_config = vision.types.OutputConfig(
        gcs_destination=gcs_destination, batch_size=batch_size)

    async_request = vision.types.AsyncAnnotateFileRequest(
        features=[feature], input_config=input_config,
        output_config=output_config)

    operation = client.async_batch_annotate_files(
        requests=[async_request])

    operation.result(timeout=180)

    # Once the request has completed and the output has been
    # written to GCS, we can list all the output files.
    storage_client = storage.Client()

    match = re.match(r'gs://([^/]+)/(.+)', gcs_destination_uri)
    bucket_name = match.group(1)
    prefix = match.group(2) + 'out'

    bucket = storage_client.get_bucket(bucket_name)

    # List objects with the given prefix.
    blob_list = list(bucket.list_blobs(prefix=prefix))
    for blob in blob_list:
        list_json.append(blob.name) 

        # Since we specified batch_size=2, the first response contains
        # the first two pages of the input file.
        output = blob
        json_string = output.download_as_string()
        response = json_format.Parse(json_string, vision.types.AnnotateFileResponse())

        # The actual response for the first page of the input file.
        for res in response.responses:
            annotation += res.full_text_annotation.text
            pages = res.full_text_annotation.pages
            for page in pages:
                blocks = page.blocks
                for block in blocks:
                    paragraphs = block.paragraphs
                    for paragraph in paragraphs:
                        words = paragraph.words
                        for word in words:
                            symbols = word.symbols
                            for symbol in symbols:
                                letter = symbol.text
                                word_ += letter
                                text += letter
                            text += ' '
                            v1 = word.bounding_box.normalized_vertices[0]
                            v2 = word.bounding_box.normalized_vertices[1]
                            v3 = word.bounding_box.normalized_vertices[2]
                            v4 = word.bounding_box.normalized_vertices[3]
                            list_v1.append(v1)
                            list_v2.append(v2)
                            list_v3.append(v3)
                            list_v4.append(v4)
                            list_words.append(word_)
                            word_ = ''
                        text += '\n'
                ll_words.append(list_words)
                ll_v1.append(list_v1)
                ll_v2.append(list_v2)
                ll_v3.append(list_v3)
                ll_v4.append(list_v4)
                list_words = []
                list_v1 = []
                list_v2 = []
                list_v3 = []
                list_v4 = []
    for name in list_json:
        delete_blob(bucket_name, name)
    for j, list_words in enumerate(ll_words):
        for i in range(len(list_words)):
            if (list_words[i] == 'CEDULA' or list_words[i] == 'CÉDULA') and list_words[i + 1] == 'DE':
                listw_selected = list_words
                listv1_selected = ll_v1[j]
                listv2_selected = ll_v2[j]
                listv3_selected = ll_v3[j]
                listv4_selected = ll_v4[j] 
    return annotation, listw_selected, listv1_selected, listv2_selected, listv3_selected, listv4_selected 

def delete_blob(bucket_name, blob_name):
    """Deletes a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)

    blob.delete()

def upload_pdf(name_file, name_saved, name_bucket, directory):
    client = storage.Client()
    bucket = client.get_bucket(name_bucket)
    blob = bucket.blob(directory + name_saved)
    # Uploading from local file without open()
    blob.upload_from_filename(name_file)

def split_pdf(name_pdf):
    global CPU_CORES
    inputpdf = PdfFileReader(open(name_pdf, "rb"))
    if inputpdf.numPages > 8:
        pages = round(inputpdf.numPages / CPU_CORES)
    else:
        CPU_CORES = inputpdf.numPages
        pages = 1

    for i in range(CPU_CORES):
        output = PdfFileWriter()
        min_ = pages * i
        max_ = pages * (i + 1)
        if i + 1 == CPU_CORES:
            max_ = inputpdf.numPages
        else:
            max_ = pages * (i + 1)
        for j in range(min_, max_):    
            output.addPage(inputpdf.getPage(j))
            with open("document-page%s.pdf" % i, "wb") as outputStream:
                output.write(outputStream)
    return CPU_CORES

def master_function(counter):
    global document_type
    global pdf_name
    upload_pdf('document-page%s.pdf' % counter, 'document-page%s.pdf' % counter, 'riesgo_cognitivo', '')    
    text = async_detect_document('gs://riesgo_cognitivo/document-page%s.pdf' % counter, 'gs://riesgo_cognitivo/archivos_json/' + str(counter))
    q.append(text)
    delete_blob('riesgo_cognitivo', "document-page%s.pdf" % counter)
    os.remove("document-page%s.pdf" % counter)
    if counter == 0:
        if text.find('CEDULA DE IDENTIFICACION FISCAL') != -1 or text.find('CONSTANCIA DE SITUACIÓN FISCAL') != -1 or text.find('CONSTANCIA DE SITUACION FISCAL') != -1:
            document_type = 'rfc'
        else:
            document_type = 'acta'
        pdf_name = document_type + '_' + strftime("%Y_%m_%d_%H_%M.pdf", gmtime())
        if document_type == 'acta':
            upload_pdf('output.pdf', pdf_name, 'riesgo_cognitivo', 'actas_constitutivas/')
        elif document_type == 'rfc':
            upload_pdf('output.pdf', pdf_name, 'riesgo_cognitivo', 'rfc/')

def read_text(string_pdf):
    global document_type
    global pdf_name
    counter = 1
    text = ""
    output = {}
    threads = []

    # Create a file in Documents to test the upload and download.
    local_path=os.path.abspath(os.path.curdir)

    try:
        image_64_decode = base64.b64decode(string_pdf)
    except:
        output = {}
        output['error'] = "Archivo incorrecto"
        return output

    pdf_result = open('output.pdf', 'wb') # create a writable image and write the decoding result 
    pdf_result.write(image_64_decode)
    pdf_result.close()

    cpu_cores = split_pdf('output.pdf')
    for i in range(cpu_cores):
        threads.append(threading.Thread(target=master_function, args=(i,)))
    for i in range(cpu_cores):
        threads[i].start()
    for i in range(cpu_cores):
        threads[i].join()
    while len(q) > 0:
        text += q.pop()
    
    if document_type == 'acta':
        entities = detect_entities(text)
        r_entities = ClearEntities(filters(entities))
        output['entities'] = r_entities
        output['pdf_name'] = pdf_name
        output['type'] = document_type
    os.remove("output.pdf")
    
    return output

def ClearEntities(entities):
    R_entities = []
    for entity in entities:
        e_split = entity[0].split(' ')

        num_names = len(e_split)
        full_name = []
        names = ''        
        if num_names > 2: 
            for i in range (num_names-2):
                names += e_split[i]
                if i != (num_names -3):
                    names += ' '
            
            full_name.append(names)
            full_name.append(e_split[num_names-2])
            full_name.append(e_split[num_names-1])

        else:
            full_name.append(entity[0])

        R_entities.append(full_name)

    return R_entities
