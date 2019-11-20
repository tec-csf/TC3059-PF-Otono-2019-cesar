import React, { PureComponent } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import SliderCard from '../components/SliderCard/SliderCard'
import { Bar } from 'react-chartjs-2';
import {
  FaArrowLeft,
  FaCoins,
  FaUniversity,
  FaNewspaper,
  FaGlobe,
  FaBalanceScale,
  FaChartLine } from 'react-icons/fa'
import { 
  ButtonPrimary,
  ButtonOutline} from '../components/Button/Button'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { 
    NotificationError,
    NotificationSucces } from '../components/Notification/Notification'
import Footer from '../components/Footer/Footer'    

// const data = {
//   labels: ['TW', 'N', 'SAT', 'SC', 'DO', 'OFAC', 'PEP'],
//   datasets: [
//     {
//       label: 'My First dataset',
//       backgroundColor: '#262260',            
//       hoverBackgroundColor: '#6257fa',      
//     }
//   ]
// }

const API_URL = process.env.REACT_APP_API_URL

class Settings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      percentages_updated: false,
      court: 0,
      dof: 0,
      news: 0,
      ofac: 0,
      onu: 0,
      pep: 0,
      sat: 0,
      twitter: 0,
      original_court: 0,
      original_dof: 0,
      original_news: 0,
      original_ofac: 0,
      original_onu: 0,
      original_pep: 0,
      original_sat: 0,
      original_twitter: 0,
      statusExceeded: '-hide',
      statusSuccess: '-hide',
      statusLack: '-hide',
      disabled: false,
      default: false, 
      basico: false, 
      intermedio: false,
      pro: false,
      role: true
    }
  }

  changePercentages = () => {
    if (this.state.court + this.state.dof + this.state.news + this.state.ofac +
      this.state.onu + this.state.pep + this.state.sat + this.state.twitter === 100) {
        axios.post(API_URL + "/api/v1/change/percentages", {
          percentages: {
            court: this.state.court,
            dof: this.state.dof,
            news: this.state.news,
            ofac: this.state.ofac,
            onu: this.state.onu,
            pep: this.state.pep,
            sat: this.state.sat,
            twitter: this.state.twitter
          },
          user_id: jwtDecode(localStorage.getItem("id_token")).sub
        }).then((res) => {
          this.setState({
            statusSuccess: '-show',
            original_court: this.state.court,
            original_dof: this.state.dof,
            original_news: this.state.news,
            original_ofac: this.state.ofac,
            original_onu: this.state.onu,
            original_pep: this.state.pep,
            original_sat: this.state.sat,
            original_twitter: this.state.twitter
          })
        });
      }
  }

  restablishPercentages = () => {
    this.setState({
      court: this.state.original_court,
      dof: this.state.original_dof,
      news: this.state.original_news,
      ofac: this.state.original_ofac,
      onu: this.state.original_onu,
      pep: this.state.original_pep,
      sat: this.state.original_sat,
      twitter: this.state.original_twitter,
      default: true
    })
  }

  componentDidMount = () => {
    let user_id = jwtDecode(localStorage.getItem("id_token")).sub

    axios.get(API_URL + "/api/v1/search/percentages", {
      params: {
        user_id: user_id
      }
    }).then((res) => {

      this.setState({
        court: res.data.court,
        dof: res.data.dof,
        news: res.data.news,
        ofac: res.data.ofac,
        onu: res.data.onu,
        pep: res.data.pep,
        sat: res.data.sat,
        twitter: res.data.twitter,
        original_court: res.data.court,
        original_dof: res.data.dof,
        original_news: res.data.news,
        original_ofac: res.data.ofac,
        original_onu: res.data.onu,
        original_pep: res.data.pep,
        original_sat: res.data.sat,
        original_twitter: res.data.twitter,
        percentages_updated: true, 
      })
    });
  }

  componentWillUnmount = () =>{
    this.setState({
      role:true
    })
  }

  componentDidUpdate = () => {

    if (this.state.role){

      let role_ls = localStorage.getItem("role")

      if(role_ls === "basico"){
        this.setState({
          basico:true,
          role: false
        })
      }
      else if (role_ls === "intermedio"){
        this.setState({
          basico:true,
          intermedio: true,
          role:false
        })
      }
      else if (role_ls === "pro"){
        this.setState({
          basico:true,
          intermedio:true,
          pro:true, 
          role:false
        })
      }
    }

    if (this.state.percentages_updated) {
      if (this.state.court + this.state.dof + this.state.news + this.state.ofac + 
          this.state.onu + this.state.pep + this.state.sat + this.state.twitter > 100 &&
          this.state.statusExceeded !== '-show') {
        if (this.state.statusExceeded === '-hide') {
          this.setState({ statusExceeded: '-show' })
        }
        if (this.state.statusLack === '-show') {
          this.setState({ statusLack: '-hide' })
        }
        if (!this.state.disabled) {
          this.setState({ disabled: true })
        }
      }
      if (this.state.court + this.state.dof + this.state.news + this.state.ofac +
          this.state.onu + this.state.pep + this.state.sat + this.state.twitter < 100 &&
          this.state.statusLack !== '-show') {
        if (this.state.statusExceeded === '-show') {
          this.setState({ statusExceeded: '-hide' })
        }
        if (this.state.statusLack === '-hide') {
          this.setState({ statusLack: '-show' })
        }
        if (!this.state.disabled) {
          this.setState({ disabled: true })
        }
      }
      if (this.state.court + this.state.dof + this.state.news + this.state.ofac +
          this.state.onu + this.state.pep + this.state.sat + this.state.twitter === 100) {
        if (this.state.statusExceeded === '-show') {
          this.setState({ statusExceeded: '-hide' })
        }
        if (this.state.statusLack === '-show') {
          this.setState({ statusLack: '-hide' })
        }
        if (this.state.disabled) {
          this.setState({ disabled: false })
        }
      }
    }
  }

  _setState = (state) => {    
    this.setState(state);
  }

  render() {
    if(this.state.percentages_updated) {
      return(
        <div>
          <Navbarmenu {...this.props}></Navbarmenu>
          <div className="container-fluid p-0">
            <Sidenav/>
            <div className="container">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="title my-30">Ajustes</h4>
                  <p className="mb-30">Aquí podrás darle valor a cada una de las categorías. Inicialmente los valores están predeterminados. Al terminar tu configuración da “click” en el botón Guardar y los valores se aplicarán en el área de perfil de las personas registradas. </p>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6">
                  <ButtonOutline customClass="mb-30" title="Restablecer valores" onClick={this.restablishPercentages}></ButtonOutline>
                </div>
              </div>
  
              <div className="row">
                <div className="col-12 col-md-9">
                  
                  {this.state.basico &&
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <SliderCard title="Twitter" percentage={this.state.twitter} customClass="mb-30 disable" setState={this._setState} default={this.state.default}/>
                      </div>
    
                      <div className="col-12 col-lg-6">
                        <SliderCard title="Noticias" percentage={this.state.news} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
                    </div>
                  }
                  {this.state.intermedio &&
                    <div className="row">
                      <div className="col-12 col-lg-4">
                        <SliderCard title="SAT" percentage={this.state.sat} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
    
                      <div className="col-12 col-lg-4">
                        <SliderCard title="Suprema Corte" percentage={this.state.court} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
    
                      <div className="col-12 col-lg-4">
                        <SliderCard title="Diario Oficial" percentage={this.state.dof} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
                    </div>
                  }
                  {this.state.pro &&
                    <div className="row">
                      <div className="col-12 col-lg-4">
                        <SliderCard title="ONU" percentage={this.state.onu} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
    
                      <div className="col-12 col-lg-4">
                        <SliderCard title="OFAC" percentage={this.state.ofac} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
    
                      <div className="col-12 col-lg-4">
                        <SliderCard title="PEP" percentage={this.state.pep} customClass="mb-30" setState={this._setState} default={this.state.default}/>
                      </div>
                    </div>
                  }                                                    
              </div>
                
              <div className="col-12 col-md-3">
                <div className="cm-card -white">
                  <Bar 
                    data={{
                      labels: ['Twitter', 'Noticias', 'SAT', 'Suprema Corte', 'Diario Oficial', 'ONU', 'OFAC', 'PEP'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: '#0070D0',
                          hoverBackgroundColor: '#10d3ce',
                          data: [this.state.twitter, this.state.news, this.state.sat, this.state.court,
                            this.state.dof, this.state.onu, this.state.ofac, this.state.pep],
                          scaleStartValue: 0 
                        }
                      ]
                    }}
                  width={100}
                  height={300}
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                      }]
                    },
                    legend: {
                      display: false
                    }
                  }}/>
                </div>
              </div>
            </div>
            <div className="row">                    
              <div className="col-12 col-md-6">
                <ButtonPrimary customClass="mb-30" title="Guardar" onClick={this.changePercentages} disabled={this.state.disabled}></ButtonPrimary>
              </div>
            </div>
            {/* {!this.state.pro &&
              <React.Fragment>              
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="title my-30">Contratar más servicios</h4>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <p>Conoce todos nuestros servicios de búsqueda.</p>
                </div>
              </div>
              </React.Fragment>
            }
              {!this.state.intermedio &&
              <React.Fragment>
                <div className="row">
                  <div className="col-12">
                    <h3 className="subtitle mb-30">Paquete Intermedio</h3>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-lg-4">
                    <div className="cm-card h-120 -white mb-30">
                      <p className="subtitle -inter">SAT</p>
                      <div className="icon -inter"><FaCoins/></div>
                      <p className="mb-0">Adipiscing elit malesuada.</p>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="cm-card h-120 -white mb-30">
                      <p className="subtitle -inter">SUPREMA CORTE</p>
                      <div className="icon -inter"><FaUniversity/></div>
                      <p className="mb-0">Consectetur adipiscing elit malesuada.</p>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="cm-card h-120 -white mb-30">
                      <p className="subtitle -inter">DIARIO OFICIAL</p>
                      <div className="icon -inter"><FaNewspaper/></div>
                      <p className="mb-0">Dolor sit amet adipiscing elit malesuada.</p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
              }
              {!this.state.pro &&
              <React.Fragment>
              <div className="row">
                <div className="col-12">
                  <h3 className="subtitle mb-30">Paquete Premium</h3>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-4">
                  <div className="cm-card h-120 -white mb-30">
                    <p className="subtitle -pro">ONU</p>
                    <div className="icon -pro"><FaGlobe/></div>
                    <p className="mb-0">Adipiscing elit malesuada.</p>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="cm-card h-120 -white mb-30">
                    <p className="subtitle -pro">OFAC</p>
                    <div className="icon -pro"><FaBalanceScale/></div>
                    <p className="mb-0">Consectetur adipiscing elit malesuada.</p>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="cm-card h-120 -white mb-30">
                    <p className="subtitle -pro">PEP</p>
                    <div className="icon -pro"><FaChartLine/></div>
                    <p className="mb-0">Dolor sit amet adipiscing elit malesuada.</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <button className="button -primary mb-30">Ver planes</button>                      
                </div>
              </div>
              </React.Fragment>
              } */}
            </div>
          </div>

          <div className="container-fluid px-0">
            <div className="row mx-0">
              <div className="col-12 px-0">
                <Footer/>
              </div>
            </div>
          </div>

          <NotificationError 
            title="Límite excedido"
            description="Solo puedes seleccionar el 100%, has seleccionado un "
            show={this.state.statusExceeded}
            total={this.state.court + this.state.dof + this.state.news + this.state.ofac +
              this.state.onu + this.state.pep + this.state.sat + this.state.twitter}
            setState={this._setState}
          />
          <NotificationError
            title="Límite faltante"
            description="Tienes que declarar el 100%, has declarado un "
            show={this.state.statusLack}
            total={this.state.court + this.state.dof + this.state.news + this.state.ofac +
              this.state.onu + this.state.pep + this.state.sat + this.state.twitter}
            setState={this._setState}
          />
          <NotificationSucces
            title="Ok"
            description="Los cambios se han realizado con éxito"
            show={this.state.statusSuccess}
            total={this.state.court + this.state.dof + this.state.news + this.state.ofac +
              this.state.onu + this.state.pep + this.state.sat + this.state.twitter}
            setState={this._setState}
          />  
        </div>
      )
    }
    else {
      return(
        <div>
          <Navbarmenu {...this.props}></Navbarmenu>
          <div className="container p-0">
            <Sidenav />
            <div className="container">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="title my-30">Cargando</h4>                  
                </div>
              </div>
            </div>
          </div>
        </div> 
      )
    }
  }
}

export default Settings


