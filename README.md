# *Riesgo Cognitivo*
---
#### Materia: *Desarrollo de Aplicaciónes en la Nube*

##### Campus: *CSF*

##### Integrantes:
1. *César Armando Valladares Martínez*

---
## 1. Aspectos generales

### 1.1 Requerimientos técnicos

A continuación se mencionan los requerimientos técnicos mínimos del proyecto, favor de tenerlos presente para que cumpla con todos.

* El equipo tiene la libertad de elegir las tecnologías de desarrollo a utilizar en el proyecto, sin embargo, debe tener presente que la solución final se deberá ejecutar en una de las siguientes plataformas en la nube: [Google Cloud Platform](https://cloud.google.com/?hl=es), [Amazon Web Services](https://aws.amazon.com/) o [Microsoft Azure](https://azure.microsoft.com/es-mx/).
* El proyecto deberá utilizar 
* La solución debe utilizar una arquitectura de microservicios. Si no tiene conocimiento sobre este tema, le recomendamos la lectura [*Microservices*](https://martinfowler.com/articles/microservices.html) de [Martin Fowler](https://martinfowler.com).
* La arquitectura debe ser modular, escalable, con redundancia y alta disponibilidad.
* La arquitectura deberá estar separada claramente por capas (*frontend*, *backend*, *API RESTful*, datos y almacenamiento).
* Deberá utilizarse contenedores [Docker](https://www.docker.com/) y un orquestador como [Kubernetes](https://kubernetes.io/).
* La API deberá utilizar autenticación y estar desplegada detrás de un API Manager como [Cloud Endpoints](https://cloud.google.com/endpoints/).
* El proyecto deberá contar con los archivos de configuración y *scripts* necesarios para crear toda la infraestructura necesaria, utilizando alguna solución de *Infraestructure as a Code* como [Deployment Manager](https://cloud.google.com/deployment-manager/).
* Todo el código, *datasets* y la documentación del proyecto debe alojarse en este repositorio de GitHub. Favor de mantener la estructura de carpetas propuesta.

### 1.2 Estructura del repositorio
El proyecto debe seguir la siguiente estructura de carpetas, la cual generamos por usted:
```
- / 			        # Raíz de todo el proyecto
    - README.md			# Archivo con los datos del proyecto (este archivo)
    - frontend			# Carpeta con la solución del frontend (Web app)
    - backend			  # Carpeta con la solución del backend (CMS)
    - api			      # Carpeta con la solución de la API
    - datasets		  # Carpeta con los datasets y recursos utilizados (csv, json, audio, videos, entre otros)
    - dbs			      # Carpeta con los modelos, catálogos y scripts necesarios para generar las bases de datos
    - models			  # Carpeta donde se almacenarán los modelos de Machine Learning ya entrenados
    - docs			    # Carpeta con la documentación del proyecto
```

### 1.3 Documentación  del proyecto

Como parte de la entrega final del proyecto, se debe incluir la siguiente información:

* Descripción del problema a resolver.
* Diagrama con la arquitectura de la solución.
* Descripción de cada uno de los componentes de la arquitectura.
* Justificación de los componentes seleccionados.
* Explicación del flujo de información en la arquitectura.
* Descripción de las fuentes de información utilizadas (archivos CSV, JSON, TXT, bases de datos, entre otras).
* Guía de configuración, instalación y despliegue de la solución en la plataforma en la nube seleccionada.
* Documentación de la API. Puede ver un ejemplo en [Swagger](https://swagger.io/). 
* El código debe estar documentado siguiendo los estándares definidos para el lenguaje de programación seleccionado.

## 2. Descripción del proyecto

Riesgo Cognitivo es una platadorma que te permite analizar tanto a personas físicas como a personas morales, lo que se necesita es al menos un documento
de identificación oficial (*INE*, *IFE*, *Pasaporte*). Dependiendo del paquete que se haya comprado se podra visualizar cierta información:
- El paquete 1 permitira analizar fuentes de periodico como El Universal, Milenio, El Sol, entre otros a demás de cuentas de Twitter, especificamente
lo que se hable de esa cuenta
- El paquete 2 tendrá lo del paquete 1 a demás de un análisis de *SAT*, *Suprema Corte* y *Diario Oficial*.
- El paquete 3 tendrá lo del paqiete 2 a demás de un análisis de *ONU*, *OFAC* y *PEP*.
Al final se mostrará un porcentaje de confiabilidad, el cual podra ser ajustado dependeiendo de las necesidades de cada usuario.


## 3. Solución

A continuación aparecen descritos los diferentes elementos que forman parte de la solución del proyecto.

### 3.1 Arquitectura de la solución

<img src="https://raw.githubusercontent.com/tec-csf/TC3059-PF-Otono-2019-cesar/master/docs/ArquitecturaRiesgo.png" width="65%">

<a href="https://github.com/tec-csf/TC3059-PF-Otono-2019-cesar/tree/master/docs">Descripción del flujo</a>

### 3.2 Descripción de los componentes

- <a href="https://github.com/tec-csf/TC3059-PF-Otono-2019-cesar/blob/master/docs/Descripci%C3%B3n%20de%20Componentes%20.pdf">Componentes</a>

### 3.3 Frontend

*[Incluya aquí una explicación de la solución utilizada para el frontend del proyecto. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

#### 3.3.1 Lenguaje de programación

- Javascript
- HTML
- CSS 

#### 3.3.2 Framework

- <a href="https://es.reactjs.org/">Reactjs</a>

#### 3.3.3 Librerías de funciones o dependencias

- auth0-js
- axios
- bootstrap
- chart.js
- express
- jwt-decode
- node-sass
- npm
- npm-upgrade
- openpay
- react
- react-chartjs-2
- react-circular-progressbar
- react-dom
- react-icons
- react-input-slider
- react-router-dom
- react-scripts
- reactstrap
- serve

### 3.4 Backend

*[Incluya aquí una explicación de la solución utilizada para el backend del proyecto. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

#### 3.4.1 Lenguaje de programación
#### 3.4.2 Framework
#### 3.4.3 Librerías de funciones o dependencias

### 3.5 API

*[Incluya aquí una explicación de la solución utilizada para implementar la API del proyecto. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

#### 3.5.1 Lenguaje de programación

- Python 3.6 

#### 3.5.2 Framework

- <a href="https://www.fullstackpython.com/flask.html">Flask</a>

#### 3.5.3 Librerías de funciones o dependencias

- <a href="https://github.com/tec-csf/TC3059-PF-Otono-2019-cesar/blob/master/api/requirements.txt">Requirements.txt</a>


*[Incluya aquí una explicación de cada uno de los endpoints que forman parte de la API. Cada endpoint debe estar correctamente documentado.]*

- <a href="https://github.com/tec-csf/TC3059-PF-Otono-2019-cesar/blob/master/docs/Endpoints.pdf">Endpoints</a>

* **Descripción**:
* **URL**:
* **Verbos HTTP**:
* **Headers**:
* **Formato JSON del cuerpo de la solicitud**: 
* **Formato JSON de la respuesta**:


## 3.6 Pasos a seguir para utilizar el proyecto

### API
1. En la carpeta de la api crear un ambiente virtual (Linux): virtualenv NOMBRE -p python3
2. Instalar las librerias necesarias del archivo requierements.txt: pip install -r requirements.txt
3. Ejecutar: python manage.py

### Frontend
1. Tener instalado node: sudo apt-get install -y nodejs
2. En la carpeta del frontend instalar las dependencias: npm install 
3. Ejecutar la aplicación: npm start
4. En cualquier navegador entrar a "localhost:3000"

## 4. Referencias

- Para el frontend: https://www.w3schools.com/ 
- Para React https://es.reactjs.org/docs/getting-started.html 
- Para codigo en general https://stackoverflow.com/ 