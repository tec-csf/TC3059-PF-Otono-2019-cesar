import React, {Component} from 'react'
import DocumentCard from '../components/DocumentCard/DocumentCard';
import Sidenav from '../components/Sidenav/Sidenav'
import Footer from '../components/Footer/Footer'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import { Table } from 'reactstrap';
import axios from 'axios';
import AforeCoincidence from '../components/AforeCoincidence/AforeCoincidence'

const API_URL = process.env.REACT_APP_API_URL

class AforeExchange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      documents : false,
      per_type: 'afore',
      show_spinner: false,
      video: '', 
      image: '',
      error: '',
      afore:{
        identity_verified: '', 
        name_verified: '', 
        organization_destiny: '', 
        organization_origin: '',
        name_ine: '',
        name_video: ''
      }
    }
  }

  _setState = (state) => {
    this.setState(state);
  }

  componentDidUpdate(){
    if (this.state.error == '' && this.state.image != '' && this.state.video != '' && this.state.afore.identity_verified == ''){
      console.log(this.state.image);
      console.log(this.state.video);
      this.transcript_afore()
    }
  }

  show_spinner(){
    this.setState({
      show_spinner: true
    })
  }

  no_show_spinner(){
    this.setState({
      show_spinner: false
    })
  }

  transcript_afore(){
    if (localStorage.getItem("id_token")){
      let res;
      var files = new FormData();
      files.append('image', this.state.image)
      files.append('video', this.state.video)
      let url = API_URL + '/api/v1/transcript_afore/search';

      axios({                                                         //
        method:'POST',                                                //    
        url,                                                          // Coment for hardcode
        data: files,                                        //
        config: {headers: {'Content-Type': 'multipart/form-data'}}    //
      }).then((res) => {                                              //
        if (res['data']['name_ine'] == 'Documento no identificado' || res['data']['name_ine'] == 'Documento en mala posicion'){
          this.setState({
            error: res['data']['name_ine']
          })
        }
        else if(res['data']['identity_verified'] == false){
          this.setState({
            error: 'identity_verified false',
            afore:{
              identity_verified: res['data']['identity_verified'],
              name_verified: res['data']['name_verified'],
              organization_destiny: res['data']['organization_destiny'],
              organization_origin: res['data']['organization_origin'],
              name_ine: res['data']['name_ine'],
              name_video: res['data']['name_video']
            }
          })
        }
        else{
          this.setState({
            error: '',
            afore:{
              identity_verified: res['data']['identity_verified'],
              name_verified: res['data']['name_verified'],
              organization_destiny: res['data']['organization_destiny'],
              organization_origin: res['data']['organization_origin'],
              name_ine: res['data']['name_ine'],
              name_video: res['data']['name_video']
            }
          })
        }
      })
    }
  }

  render() {
    return(
      <React.Fragment>
        <Navbarmenu {...this.props}></Navbarmenu>
        <div className="container-fluid p-0">
          <Sidenav/>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6">
                <h4 className="title my-30">Cambio de afore</h4>
                <p className="mb-30">Para comenzar, deberás subir 2 archivos válidos: un video de autenticación y una fotografía de tu INE.</p>
              </div>                
            </div>
            
            <div className="row">
                <div className="col-12 col-lg-6 mb-30">
                  <DocumentCard customClasses="-light" setState={this._setState} params={this.state} id={0} />
                </div>
                <div className="col-12 col-lg-6">
                  <DocumentCard customClasses="-light" setState={this._setState} params={this.state} id={1} />
                </div>
            </div>        

            <div className="row">
              <div className="col-12 col-lg-6">
                {this.state.afore.name_ine !== '' && <AforeCoincidence params={this.state}/>}
              </div>

              <div className="col-12 col-lg-6">
                {this.state.afore.name_ine !== '' && <div className="cm-card -white">
                  <Table>
                    <thead>
                      <tr>
                        <th>
                          <p className="mb-0">Afore origen</p>
                        </th>
                        <th>
                          <p className="mb-0">Afore destino</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p>{this.state.afore.organization_origin}</p>
                        </td>

                        <td>
                          <p>{this.state.afore.organization_destiny}</p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>}
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

export default AforeExchange