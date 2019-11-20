import React, {Component} from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import Footer from '../components/Footer/Footer'
import AforeTable from '../components/AforeTable/AforeTable'

class AforeDashboard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <React.Fragment>
        <Navbarmenu {...this.props}></Navbarmenu>
        <div className="container-fluid p-0">
          <Sidenav/>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8 mb-30">
                <h4 className="title my-30">Cambio de Afore</h4>
                <p className="mb-0">Estas son todas las personas que has registrado para el cambio de afore</p>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-4 mb-30">
                <a href="/afore-exchange">
                  <button className="button -primary  w-100"><i className="fas fa-exchange-alt"></i> Nuevo cambio de afore</button>
                </a>
              </div>              
            </div>

            <div className="row">
              <div className="col-12">
                <AforeTable></AforeTable>
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
    )
  }
}

export default AforeDashboard