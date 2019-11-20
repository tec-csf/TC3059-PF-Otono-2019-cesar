import React, { Component } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import { Redirect } from 'react-router-dom'
import ContactTopBar from '../components/ContactTopBar/ContactTopBar'
import Footer from '../components/Footer/Footer'
import OpenPayLogo from '../img/logo_openpay.svg'

class Terms extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <React.Fragment>
        <ContactTopBar/>
        <Navbarmenu {...this.props}/>
        <div className="container mt-90">
          <div className="row d-flex">
            <div className="col-12 mt-50">
              <a href="/landing" className="button -fabtn"><i class="fas fa-arrow-left"></i></a>
            </div>
          </div>

          <div className="row d-flex">
            <div className="col-12">
              <p className="title mt-30">TÉRMINOS Y CONDICIONES</p>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <p className="subtitle mt-50">Responsable de la protección de sus datos personales. </p>
              <p className="mt-20">En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y Lineamientos del Aviso de 
                Privacidad (en lo sucesivo la Ley), le informamos que NDS COGNITIVE LABS con domicilio en Prolongación Reforma 1190, Torre B, piso 21, Colonia Cruz 
                Manca, Delegación Cuajimalpa, C.P. 05349, en la Ciudad de México y página de internet http://www.ndscognitivelabs.com, es el responsable del uso y 
                protección de sus datos personales, los cuales se utilizarán para la identificación, operación, administración y aquellos tratamientos que más adelante se 
                identifican, que sean necesarios para la prestación de los servicios que contrate o para prestarnos algún servicio. 

                Las políticas de privacidad adoptadas por NDS COGNITIVE LABS tienen como objetivo permitirle decidirde manera libre e informada sobre el tratamiento 
                de sus datos personales. Además, estamos conscientes de que el artículo 16 de la Constitución Política de los Estados Unidos Mexicanos reconoce que 
                toda persona tiene derecho a la protección de sus datos personales, al acceso, rectificación y cancelación de los mismos, así como a manifestar su 
                oposición en los términos que fije la ley.
              </p>
            </div>

            <div className="col-12">
              <p className="subtitle mt-50">¿Para qué fines recabamos y utilizamos sus datos personales?</p>
              <p className="mt-20">En NDS COGNITIVE LABS reconocemos la importancia de proteger su información personal y tenemos el compromiso de procesarla de forma responsable y en conformidad con las leyes de protección aplicables.</p>
            </div>

            <div className="col-12">
              <p className="subtitle mt-50">¿Qué datos personales utilizaremos?</p>
              <p className="mt-20">Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, NDS COGNITIVE LABS, quien funge como persona moral responsable, utilizará los siguientes datos personales: datos de identificación, datos de contacto, datos sobre la empresa y representante (s) legal (es), datos patrimoniales o financieros.</p>
              <ul className="mt-20">
                <li> Información de contacto (Nombre, Email, Dirección, Teléfono, Celular, Fax).</li>
                <li>Documentación de identidad (Credencial de Elector, Pasaporte, Licencia de Manejo, Cartilla o Cédula Profesional).</li>
                <li>Información financiera y medios de pago (Tarjeta de crédito, débito, cheques).</li>
                <li>Información Fiscal (RFC, Dirección de Facturación).</li>
              </ul>
            </div>

            <div className="col-12">
              <p className="subtitle mt-50">Periodo de Retención</p>
              <p className="mt-20">Los datos personales que recaba NDS COGNITIVE LABS, se utilizarán para las siguientes finalidades que son necesarias para el cumplimiento de sus procesos administrativos y/o de operación, siendo estas aplicables a cualquier persona que decida contratar nuestros servicios. <br/>
                De manera adicional, utilizaremos su información personal para las siguientes finalidades que no son necesarias para el cumplimiento de nuestros 
                procesos administrativos y/o de operación, pero que nos permiten y facilitan brindarle una mejor atención:
              </p>
              <ul className="mt-20">
                <li>Contacto para oferta de productos y servicios, existentes y/o nuevos.</li>
                <li>Entendimiento de su negocio para prospección comercial.</li>
                <li> Contacto para oferta de capacitación sobre el uso de nuestros servicios.</li>
              </ul>
              <p className="mt-20">
                Registrar la información de los clientes para la facturación de productos y servicios una vez que se convierten en clientes.
                En caso de que no desee que sus datos personales sean tratados para estos fines adicionales, desde este momento nos puede comunicar lo anterior 
                enviando un correo electrónico a nuestro Departamento de Datos Personales en la siguiente dirección: marketing@ndscognitivelabs.com La negativa para
                el uso de sus datos personales para estas finalidades no será motivo determinante para que le neguemos los servicios que contrata con 
                NDS COGNITIVE LABS. 
                De conformidad con la Ley, contará con un plazo de 5 días hábiles de ser el caso, manifieste su negativa a NDS COGNITIVE LABS para el uso de sus datos
                personales conforme a las finalidades secundarias antes descritas y den origen a la relación jurídica entre NDS COGNITIVE LABS y el titular. 
                Si no manifiesta dentro de los referidos 5 días hábiles su negativa para el tratamiento de sus datos personales conforme a las finalidades secundarias 
                informadas, se entenderá que ha otorgado su consentimiento para el tratamiento de los mismos. Sin perjuicio de lo anterior, usted podrá en cualquier 
                momento, manifestar su negativa para el tratamiento de sus datos personales conforme a las finalidades secundarias, a través de la solicitud 
                correspondiente, y enviarla a la dirección de correo electrónico marketing@ndscognitivelabs.com Si en el ejercicio de su derecho de cancelación, 
                solicita que sus datos sean eliminados de nuestras bases de datos, es importante señalar que seguirán en nuestros sistemas, hasta en tanto no se extingan
                las acciones que pudieran derivar de nuestra relación jurídica, en el que serán conservados exclusivamente para efectos de las responsabilidades emanadas 
                de su tratamiento. 
              </p>
            </div>

            <div className="col-12">
              <p className="subtitle mt-50">Datos Personales derechos ARCO</p>
              <p className="mt-20">El ejercicio de los derechos “ARCO” (acceso, rectificación, cancelación u oposición) respecto de sus datos personales para qué los utilizamos y las 
                condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, 
                sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada
                adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición), esto lo podrá solicitar ante el 
                responsable de la Protección de Datos Personales Los datos de contacto del área responsable de datos personales, que está a cargo de dar trámite a las 
                solicitudes de derechos ARCO, son los siguientes:
              </p>
              <ul className="mt-20">
                <li>Área responsable de datos personales: Lic. Montserrat García</li>
                <li>Correo electrónico: marketing@ndscognitivelabs.com</li>
                <li>Dirección: Prolongación Reforma 1190, Torre B, piso 21, Colonia Cruz Manca, Delegación Cuajimalpa, C.P. 05349, en la Ciudad de México.</li>
                <li>Teléfono: +52 (55) 5081-2070 ext. 119</li>
                <li>Horario de atención: 09:00 a 16:00 horas de lunes a viernes</li>
                <li>El ejercicio de derechos ARCO será gratuito, debiendo cubrir usted como titular únicamente los gastos justificados de envío o con el costo de reproducción en copias u otros formatos.</li>
              </ul>
              <p className="mt-20">El referido departamento le proporcionará la atención necesaria para el ejercicio de sus derechos ARCO y/o revocación del consentimiento y/o limitación divulgación de sus datos personales. Además, velará por la protección de sus datos personales.</p>
            </div>

            <div className="col-12">
              <p className="subtitle mt-50">Revocar su consentimiento para el uso de sus datos personales</p>
              <p className="mt-20">
                Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Sin embargo, es importante que 
                tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación
                legal requiramos seguir tratando sus datos personales. Asimismo, usted deberá considerar que para ciertos fines, la revocación de su consentimiento 
                implicará que no le podamos seguir prestando el servicio que nos solicitó o la conclusión de su relación con nosotros. 
                Para la revocación de su consentimiento, tendrá que requerir una solicitud respectiva al responsable antes mencionado o si usted requiere mayor 
                información sobre el procedimiento y requisitos para la revocación del consentimiento, podrá llamar al siguiente número telefónico +52 (55) 5081-2070, 
                ext. 119 y ponerse en contacto con nuestra área Responsable de Datos Personales, la cual dará atención a su solicitud. Si usted considera que su derecho
                de protección de datos personales ha sido lesionado por alguna conducta de parte de NDS COGNITIVE LABS, si usted presume que en el tratamiento de 
                sus datos personales existe alguna violación a las disposiciones previstas en la Ley Federal de Protección de Datos Personales en Posesión de los 
                Particulares (LFPDPPP), podrá interponer la queja o denuncia correspondiente ante el Instituto Nacional de Transparencia, Acceso a la Información y 
                Protección de Datos Personales, para mayor información visite http://inicio.ifai.org.mx 
              </p>
            </div>

            <div className="col-12">
              <p className="subtitle mt-50">¿Cómo puede conocer los cambios a este aviso de privacidad?</p>
              <p className="mt-20">
                El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales; de nuestras propias 
                necesidades, por los productos o servicios que ofrecemos; de nuestras prácticas de privacidad; de cambios en nuestro modelo de negocio, o por otras causas
                NDS COGNITIVE LABS  notificará de cualquier cambio al aviso de privacidad a través de su sitio principal http://www.ndscognitivelabs.com 
              </p>
              <p className="mt-20">Los pagos serán efectuados por:</p>
              <img src={ OpenPayLogo } alt=""/>
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
    )
  }
}

export default Terms