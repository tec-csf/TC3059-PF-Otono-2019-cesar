import React, {Component} from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import Anomalycard from '../components/AnomalyCard/AnomalyCard'
import AnomalyCardTabs from '../components/AnomalyCardTabs/AnomalyCardTabs'
import {
  FaPen, } from 'react-icons/fa'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { Progress } from 'reactstrap';
import Footer from '../components/Footer/Footer'

const API_URL = process.env.REACT_APP_API_URL

class Anomalydetection extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      rfc: '',
      type: '',
      address: '',
      birthdate: '',
      newsTabs: false,
      score: 0,
      sat: {
        status: 0
      },
      court: {
        status: 0
      },
      ofac: {
        status: 0
      },
      onu: {
        status: 0
      },
      pep: {
        status: 0
      },
      dof: {
        status: 0
      },
      news: {
        status: 0
      },
      twitter: {
        status: 0
      },
      basico: false, 
      intermedio: false,
      pro: false,
      role: true
    }
  }

  _setState = (state) => {
    this.setState(state);
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
  }

  componentDidMount() {
    let rfc = this.props.location.match.params.rfc
    let type = this.props.location.match.params.type

    if(!this.props.parent.auth.isAuthenticated()){
      this.props.parent.auth.login()
    }

    axios.post(API_URL + "/api/v1/get_employee/search", {
      user_id: jwtDecode(localStorage.getItem("id_token")).sub,
      rfc,
      type
    }).then((res) => {

      if (type === 'fisica'){
        this.setState({
          name: res.data.name + ' ' + res.data.lastName1 + ' ' + res.data.lastName2,
          address: res.data.address,
          birthdate: res.data.birthdate,
          score: res.data.score,
          sat: res.data.sat,
          ofac: res.data.ofac,
          onu: res.data.onu,
          pep: res.data.pep,
          court: res.data.court,
          dof: res.data.dof,
          news: res.data.news,
          twitter: res.data.twitter,
          rfc: res.data.rfc,
          type: 'fisica'
        });
      } else {
        this.setState({
          name: res.data.name,
          address: res.data.addressCity + ' ' + res.data.addressColony + ' ' + res.data.addressCountry,
          score: res.data.score,
          sat: res.data.sat,
          ofac: res.data.ofac,
          onu: res.data.onu,
          pep: res.data.pep,
          court: res.data.court,
          dof: res.data.dof,
          news: res.data.news,
          twitter: res.data.twitter,
          rfc: res.data.rfc,
          type: 'moral'
        })
      }
      this.setState({newsTabs: true})
    });
  }

  render() {

    return (
      <div>
        <Navbarmenu {...this.props.parent}></Navbarmenu>
        <div className="container-fluid p-0">
          <Sidenav/>
          <div className="container mt-30">            
            <div className="row">
              <div className="col-12 col-lg-6">
                <h4 className="title mt-30">Análisis de riesgo</h4>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-6">
                <div className="cm-card -white my-30">                  

                  <div className="row">
                    <div className="col-12 col-lg-4">
                      <p className="-highlight">Nombre:</p>
                    </div>
                    <div className="col-12 col-lg-8">
                      <p>{this.state.name}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-lg-4">
                      <p className="-highlight">Domicilio:</p>
                    </div>
                    <div className="col-12 col-lg-8">
                      <p>{this.state.address}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-lg-4">
                      <p className="-highlight">Fecha de nacimiento:</p>
                    </div>
                    <div className="col-12 col-lg-8">
                      <p>{this.state.birthdate}</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="col-12 col-lg-6 d-flex justify-content-center flex-column">
              <div className="subtitle mb-30 text-center">Porcentaje de confiabilidad {this.state.score}%</div>
                {/* <Progress value={this.state.score} /> */}
                <Progress multi>
                  {/* <Progress className="bg-twitter" bar value={this.state.twitter.status} />
                  <Progress className="bg-news" bar value={this.state.news.status} />
                  <Progress className="bg-sat" bar value={this.state.sat.status} />
                  <Progress className="bg-court" bar value={this.state.court.status} />
                  <Progress className="bg-dof" bar value={this.state.dof.status} />
                  <Progress className="bg-onu" bar value={this.state.onu.status} />
                  <Progress className="bg-ofac" bar value={this.state.ofac.status} />
                  <Progress className="bg-pep" bar value={this.state.pep.status} /> */}
                  <Progress className="bg-dof" bar value={this.state.score} />
                </Progress>
              </div>
            </div>
            {this.state.basico &&
              <React.Fragment>
                <div className="row">
                  <div className="col-12">
                    <AnomalyCardTabs
                      customClasses="my-30"
                      data={this.state.twitter}
                      newsTabs={this.state.newsTabs}
                      title="TWITTER"
                      setState={this._setState}
                      type="-tw"
                      rfc={this.state.rfc}
                      type={this.state.type}
                    />
                  </div>
                  <div className="col-12">
                    <AnomalyCardTabs
                      customClasses="my-30"
                      data={this.state.news}
                      newsTabs={this.state.newsTabs}
                      title="NOTICIAS"
                      setState={this._setState}
                      type="-news"
                    />
                  </div>
                </div>
              </React.Fragment>
            }
            {this.state.intermedio &&
              <div className="row">
                <div className="col-12 col-lg-4">
                  <Anomalycard
                    customClasses="my-30"
                    data={this.state.sat}
                    title="SAT"
                    type="-sat"
                  />
                </div>
                <div className="col-12 col-lg-4">
                  <Anomalycard
                    customClasses="my-30"
                    data={this.state.court}
                    title="Suprema Corte"
                    type="-court"
                  />
                </div>
                <div className="col-12 col-lg-4">
                  <Anomalycard
                    customClasses="my-30"
                    data={this.state.dof}
                    title="Diario Oficial"
                    type="-dof"
                  />
                </div>
              </div>
            }
            {this.state.pro &&
              <div className="row">
                <div className="col-12 col-lg-4">
                  <Anomalycard
                    customClasses="my-30"
                    data={this.state.onu}
                    title="ONU"
                    type="-onu"
                  />
                </div>
                <div className="col-12 col-lg-4">
                  <Anomalycard
                    customClasses="my-30"
                    data={this.state.ofac}
                    title="OFAC"
                    type="-ofac"
                  />
                </div>
                <div className="col-12 col-lg-4">
                  <Anomalycard
                    customClasses="my-30"
                    data={this.state.pep}
                    title="PEP"
                    type="-pep"
                  />
                </div>
              </div>
            }
          </div>          
        </div>

        <div className="container-fluid px-0">
          <div className="row mx-0">
            <div className="col-12 px-0">
              <Footer/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Anomalydetection
