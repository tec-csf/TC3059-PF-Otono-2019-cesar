import React, { Component } from 'react'
import Logo from '../../img/logo-r-c.svg'

class Footer extends Component {
  render() {
    return(
      <React.Fragment>
        <footer>
          <div className="container mt-100">
            <div className="row">
              <div className="col-6 col-md-3">
                <a routerLink="/">
                  <img className="logo-img" src= { Logo } alt="Fuga de Cerebros"/>
                </a>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-4">
                <div className="footer-col br-1">
                  <p className="footer-subtitle">Riesgo cognitivo</p>
                  <a href="">Login</a>
                  <a href="/register">Registro</a>
                  <a href="/terms">Términos y condicones</a>
                  <a href="mailto:marketing@ndscognitivelabs.com">marketing@ndscognitivelabs.com</a>          
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="footer-col br-1">
                  <p className="footer-subtitle">Podría interesarte</p>
                  <a target="blank" href="https://ndscognitivelabs.com/">NDS Cognitivelabs</a>
                  <a target="blank" href="https://nearshoremx.com/">Nearshore Delivery Solutions</a>
                  <a target="blank" href="https://gsuite.ndscognitivelabs.com/">G Suite para tu empresa</a>
                  <a target="blank" href="https://innovacion.ndscognitivelabs.com/">Centro de innovación</a>
                  <a target="blank" href="https://chat.ndscognitivelabs.com/">Whatsapp para tu empresa</a>
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="footer-col">
                  <p className="footer-subtitle">Cóntáctanos</p>
                  <p>Tel: +52(55) 508 120 70 ext. 119 / 114 </p>
                  <p>Whatsapp: 5255 550 846 20</p>

                  <p className="footer-subtitle">Síguenos</p>
                  <div className="sm-container">
                    <a target="blank" href="https://www.facebook.com/NDSCognitiveLabs/"><i className="fab fa-facebook-f"></i></a>
                    <a target="blank" href="https://www.linkedin.com/company/nds-cognitive-labs/"><i className="fab fa-linkedin"></i></a>
                    <a target="blank" href="https://twitter.com/NDSCognitiveLab"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="rights text-center">
            <p>Fuga de Cerebros.© Todos los derechos reservados 2019.</p>
          </div>
        </footer>
      </React.Fragment>
    )
  }
}

export default Footer