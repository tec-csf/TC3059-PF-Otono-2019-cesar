import React, {Component} from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Value from '../img/value.jpg'
import Teams from '../img/teams.jpg'
import ServicesCard from '../components/ServicesCard/ServicesCard'
import Footer from '../components/Footer/Footer'
import InputForm from '../components/InputForm/InputForm'
import ContactTopBar from '../components/ContactTopBar/ContactTopBar'


class Landing extends Component {

  constructor(props){
    super(props);

    this.state = {
      redirect:false
    }
  }

  render() {
    return(
      <React.Fragment>
        <ContactTopBar/>
        <Navbarmenu {...this.props}></Navbarmenu>
        <div className="container-fluid px-0">
          <div className="row mx-0">
            <div className="col-12 px-0">
              <div className="landing-hero">
                <div className="content">
                  <div className="container">
                    <h1 className="hero-title text-center text-white">Riesgo Cognitivo</h1>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className="title text-center mt-100">
                ¿CÓMO FUNCIONA?
              </p>
              <p className="mt-50 text-center fs-18">Riesgo Cognitivo es una plataforma que facilita la gestión
                documental y monitoreo de entidades para la <b>evaluación
                del riesgo.</b>  A través del consumo de fuentes de
                información públicas la plataforma genera alertas sobre
                el posible riesgo asociado a una persona <b>física o moral.</b>

                Riesgo Cognitivo utiliza información pública proveniente
                de fuentes como Twitter, Noticias, SAT, Suprema Corte,
                OFAC, entre otras fuentes, incluyendo Organismos de
                Gobierno.
              </p>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            <div className="col-12 col-lg-4">
              <a href="#contact"><button className="button -primary mt-50">Contratar</button></a>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="img-card -physical mt-100 d-flex flex-column">
                <h3 className="subtitle text-white">Personas Físicas</h3>
                <p className="mt-50">Riesgo Cognitivo analiza la presencia de personas físicas
                  en múltiples fuentes de información y bases de datos.
                  Dependiendo de la relevancia que se le asigne a las
                  fuentes.
                </p>
                <a href="#contact"><button className="w-auto button -outline -white">Contratar</button></a>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="img-card -moral mt-100 d-flex flex-column">
              <h3 className="subtitle text-white">Personas Morales</h3>
                <p className="mt-50">Utilizando algoritmos de inteligencia artificial para el
                  reconocimiento de imágenes, Riesgo Cognitivo analiza y
                  extrae la información más importante de documentos
                  como Actas Constitutivas.

                  A su vez, analiza la presencia de la sociedad, socios y
                  accionistas en bases de datos públicas, noticias y redes
                  sociales, facilitando así la gestión del riesgo.
                </p>
                <a href="#contact"><button className="w-auto button -outline -white">Contratar</button></a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className="title mt-100 mb-50 text-center">ANALIZA Y MEJORA TU ESTRATEGIA DE RIESGO</h4>
            </div>
              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fab fa-twitter" title="Twitter" plan="Inicial"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-newspaper" title="Noticias" plan="Inicial"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-donate" title="SAT" plan="Intermedio"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-balance-scale" title="Suprema corte" plan="Intermedio"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-book" title="Diario oficial" plan="Intermedio"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-sitemap" title="OFAC" plan="Empresarial"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-passport" title="ONU" plan="Empresarial"/>
              </div>

              <div className="col-6 col-lg-3">
                <ServicesCard customClass="mb-50" icon="fas fa-university" title="PEP" plan="Empresarial"/>
              </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className="title my-50 text-center">SOLUCIONES A RIESGOS</h4>
            </div>
          </div>

          <div className="row d-flex align-items-center">
            <div className="col-lg-6">
              <img className="solutions-img d-none d-lg-block" src= { Value } alt="hands shake"/>
            </div>

            <div className="col-12 col-lg-6">
              <h4 className="subtitle mb-30">Personalización de Valores</h4>
              <p className="mb-50">Riesgo Cognitivo permite personalizar la
                asignación del valor de riesgo a las fuentes de
                información disponibles, que mejor se adapte a
                sus necesidades de monitoreo y gestión.
              </p>
            </div>
          </div>

          <div className="row d-flex align-items-center">
            <div className="col-12 col-lg-6">
              <h4 className="subtitle text-right mb-30">Personalización de Valores</h4>
              <p className="text-right">
                Riesgo Cognitivo es una herramienta que
                mejora y facilita el trabajo de los equipos de
                análisis, ya sea para actividades de KYC, AML o
                para la verificación de antecedentes.
              </p>
            </div>

            <div className="col-lg-6">
              <img className="solutions-img d-none d-lg-block mb-50" src= { Teams } alt=" team working"/>
            </div>
          </div>

          <div id="contact" className="row">
            <div className="col-12">
              <h4 className="title my-50 text-center">PLANES</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-4">
              <div className="cm-card -white -no-cursor -plans mb-50 d-flex flex-column">
                <p className="subtitle">Inicial</p>
                <p className="higlight-big mt-30">$10 USD mensuales</p>
                <p className="mt-30">
                  Está pensando para PYMES que
                  desean mejorar la gestión de riesgo.
                </p>
                <ul className="my-30">
                  <li>Registra hasta 5 personas físicas</li>
                  <li>Registra hasta 2 personas morales</li>
                  <li>Monioreo de cuentas de Twitter</li>
                  <li>Monioreo de las principales fuentes de noticias</li>
                </ul>
                <a className="-anchor mt-auto" href="/register">CONTRATAR <i class="fas fa-long-arrow-alt-right"></i></a>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="cm-card -white -no-cursor -plans mb-50 d-flex flex-column">
                <p className="subtitle">Intermedio</p>
                <p className="higlight-big mt-30">$50 USD mensuales</p>
                <p className="mt-30">
                  Esta configuración está dirigida a
                  empresas de volumen medio con equipos de
                  analistas dedicados.
                </p>
                <p><b>Beneficios del plan básico</b></p>
                <ul className="my-30">
                  <li>+ 10 personas físicas</li>
                  <li>+ 5 personas morales</li>
                  <li>Monioreo de SAT</li>
                  <li>Monioreo de Suprema corte</li>
                  <li>Monioreo de Diario oficial</li>
                </ul>
                <a className="-anchor mt-auto" href="/register">CONTRATAR <i class="fas fa-long-arrow-alt-right"></i></a>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="cm-card -white -no-cursor -plans mb-50 d-flex flex-column">
                <p className="subtitle">Empresarial</p>
                <p className="higlight-big mt-30">$250 USD mensuales</p>
                <p className="mt-30">
                  La mejor opción para
                  organizaciones con equipos de analistas
                  dedicados y alta volumetría de documentos.
                </p>
                <p><b>Beneficios del plan intermedio</b></p>
                <ul className="my-30">
                  <li>+ 100 personas físicas</li>
                  <li>+ 50 personas morales</li>
                  <li>Monioreo de OFAC</li>
                  <li>Monioreo de ONU</li>
                  <li>Monioreo de listas de Personas Políticamente Expuestas</li>
                </ul>
                <a className="-anchor mt-auto" href="/register">CONTRATAR <i class="fas fa-long-arrow-alt-right"></i></a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className="title my-50 text-center">CONTACTO</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-5">
              <div className="row">
                <div className="col-12">
                  <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" type="text" label="Nombre"/>
                </div>

                <div className="col-12">
                  <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" type="email" label="Correo"/>
                </div>

                <div className="col-12">
                  <div className="group mt-50">
                    <textarea rows="4" className="-secondary"/>
                    <label htmlFor="">Mensaje</label>                    
                  </div>
                </div>

                <div className="col-12">
                  <button className="button -primary mt-30">Enviar</button>
                </div>
              </div>              
            </div>

            <div class="col-12 col-lg-4 px-0">
              <iframe 
                class="contact-map" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.192910125554!2d-99.27167378454746!3d19.360797986925114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d200c8db275b9b%3A0x449abdf0ec68dcb2!2sProlongacion%20Paseo%20de%20la%20Reforma%201190%2C%20Lomas%20de%20Santa%20Fe%2C%20Lomas%20de%20Vista%20Hermosa%2C%2005349%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1572630331484!5m2!1ses-419!2smx"
                frameborder="0" 
                style={{ border:0 }} 
                allowfullscreen="">
              </iframe>
            </div>

            <div class="col-12 col-lg-3 px-0">
              <div class="contact-info">
                <i class="fas fa-map-marker-alt"></i>
                <p>Av. Prolongación Paseo de la Reforma 1190 C.P. 05349</p>

                <i class="fas fa-envelope"></i>
                <p>riesgocognitivo@nearshoremx.com</p>

                <i class="fas fa-phone"></i>
                <p>+52 (55) 50 81 20 70 </p>
                <p> <b>EXT </b> 119</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid px-0">
          <div className="row mx-0">
            <div className="col-12 px-0">
              <Footer/>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Landing
