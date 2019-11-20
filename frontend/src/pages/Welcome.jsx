import React, {Component} from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import WelcomeTable from '../components/WelcomTable/WelcomeTable';
import Footer from '../components/Footer/Footer'

const API_URL = process.env.REACT_APP_API_URL

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0, 
      redirect: false
    }
  }
  componentDidMount(){
    let user_id = jwtDecode(localStorage.getItem("id_token")).sub

    if(!this.props.auth.isAuthenticated()){
      this.props.auth.login()
    } 
    else {

      axios.get(API_URL + "/api/v1/search/metadata", {
			params: {
				user_id
			}
			}).then((res) => {

				if(res.data.user_name == null){
					this.setState({
						redirect: true
					})					
				}
			});
    }

    const data = {
      user_id
    }
    axios({
      method:'POST',
      url: API_URL + '/api/v1/get_count_employee/search',
      data,
      config: {headers: {'Content-Type': 'application/json'}}
    }).then((res) => {
      this.setState({
        count : res.data["count"]
      })
    });
  }

  render() {

    return (
      <div>
        <Navbarmenu {...this.props}></Navbarmenu>
        <div className="container-fluid p-0">
          <Sidenav/>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8 mb-30">
                <h4 className="title my-30">Análisis cognitivo</h4>
                <p className="mb-0"><b>{this.props.name}</b>, estas son tus estadísticas de las últimas actividades en tu cuenta.</p>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-4 mb-30">
                <a href="/dashboard">
                  <button className="button -primary  w-100"><i className="fas fa-user-plus"></i> Nuevo análisis</button>
                </a>
              </div>

              <div className="col-12 col-lg-4 mb-30">
                <a href="/settings">
                  <button className="button -primary  w-100">
                    <i class="fas fa-cogs"></i>Ajustes
                  </button>                
                </a>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <WelcomeTable></WelcomeTable>
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
      </div>
    );
  }
}

export default Welcome
