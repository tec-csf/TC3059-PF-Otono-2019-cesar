import React, { Component } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import ContactTopBar from '../components/ContactTopBar/ContactTopBar'

class Confirmation extends Component {
  constructor(props) {
    super(props);
  }

  onClickIn = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <React.Fragment>
        <ContactTopBar/>
        <Navbarmenu {...this.props}/>
        <div className="container mt-90">
          <div className="row d-flex justify-content-center">
            <div className="col-8">
              <div className="row d-flex">
                <div className="col-12 mt-50">
                  <a href="/landing" className="button -fabtn"><i class="fas fa-arrow-left"></i></a>
                </div>
              </div>

              <div className="row d-flex">
                <div className="col-12">
                  <p className="title mt-30">CONFIRMACIÓN DE CORREO</p>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <p className="mt-50">
                    Te hemos enviado un correo para que verifiques tu
                    cuenta.
                    Una vez verificada, podrás acceder a tu perfil</p>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-4 mt-50">              
                  <a href="#" onClick={this.onClickIn}><button className="button -primary" >Continuar</button></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Confirmation