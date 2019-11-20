import React, { Component } from 'react';
import '../src/App.scss';
import Dashboard from '../src/pages/Dashboard'

// PAGES
import Anomalydetection from '../src/pages/anomaly-detection'
import Landing from '../src/pages/Landing'
import Welcome from '../src/pages/Welcome'
import Settings from '../src/pages/Settings'
import Profile from '../src/pages/Profile'
import UserProfile from './pages/UserProfile'
import Pay from './pages/Pay'
import Register from './pages/Register'
import Confirmation from './pages/Confirmation'
import ValidateEmail from './pages/ValdiateEmail'
import SelectPlan from './pages/SelectPlan'
import AforeDashboard from './pages/AforeDashboard'
import AforeExchange from './pages/AforeExchange'
import Terms from './pages/Terms'

// AUTH0
import Callback from './auth0/Callback';
import axios from 'axios'
import jwtDecode from 'jwt-decode'

import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL
const AUTH0_URL = process.env.REACT_APP_AUTH0_URL
const AUTH0_TOKEN = process.env.REACT_APP_AUTH0_TOKEN

class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      role:"",
      uploading: false,
      current_curp: "",
      payed: false
    }
  }
  _setState = (state) => {
    this.setState(state);
  }

  Scrapper = (data) => {

    data.twitter = []

    this.setState({
      uploading:true
    }, () => {
        axios.post(API_URL + "/api/v1/search/upload", {
      data
    }).then((res) => {

      this.setState({
        uploading:false
      })
    });
    })

    
  }

  componentDidMount = () => {
    this.checkRole();
  }

  checkRole = async () => {
    let user_id = ''
    try {
      user_id = localStorage.getItem("id_token").sub
    }
    catch{
      console.log("NO USER ID")
    }

    var res = await axios.get(API_URL + "/api/v1/search/metadata", {
      params: {
        user_id
      }
    });

    if (res.data !== "empty") {
      this.setState({
        payed: true
      })
    }

    if (user_id !== '') {

      let headers = {
        'Authorization': AUTH0_TOKEN,
        'Content-Type': 'application/json'
      }
      res = await axios.get(AUTH0_URL + "/api/v2/users/" + jwtDecode(localStorage.getItem("id_token")).sub + "/roles", {
        headers: headers
      });

      if (res["data"][0] != null) {
        localStorage.setItem("role", res["data"][0]["name"]);
        this.setState({
          role: res["data"][0]["name"]
        })
      }
      else {
        this.setState({
          role: "no"
        })
      }
    }
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path ="/callback" render ={(...props) =>(
              <Callback {...this.props}/>
            )}/>
            <Route path ="/landing" render ={(...props) =>(
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <Redirect to="/welcome" />
              ) : (
                <Landing {...this.props}/>
              )
            )}/>
            <Route path ="/pay" render ={(...props) =>(
              this.props.auth.isAuthenticated() ? (
                <Pay {...this.props} select_plan={false} checkRole={this.checkRole}/>
              ) : (
                <Redirect to="/landing" />
              )
            )}/>
            <Route path ="/register" render ={(...props) =>(
              <Register {...this.props}/>
            )}/>
            <Route path ="/terms" render ={(...props) =>(
              <Terms {...this.props}/>
            )}/>
            <Route path ="/confirmation" render ={(...props) =>(
              <Confirmation {...this.props}/>
            )}/>
            <Route path="/validate" render={(...props) => (
              <ValidateEmail {...this.props} />
            )} />
            <Route path ="/select-plan" render ={(...props) =>(
              this.props.auth.isAuthenticated() ? (
                <Pay {...this.props} select_plan={true} checkRole={this.checkRole}/>
              ) : (
                <Redirect to="/landing" />
              )
            )}/>            
            <Route path ="/anomaly-detection/:rfc/:type" name="anomaly-detection" component={(props) =>
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <Anomalydetection location={props} parent={this.props}/>
              ) : (
                <Redirect to="/landing"/>
              )
            }
            />
            <Route path="/welcome" exact render={(...props)=>(
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <Welcome {...this.props} role={this.state.role} setState={this._setState}/>
              ) : (
                <Redirect to="/landing"/>
              )
            )}/>
            <Route path="/afore-exchange" exact render={(...props)=>(
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <AforeExchange {...this.props} role={this.state.role} setState={this._setState} />
              ) : (
                <Redirect to="/landing"/>
              )
            )}/>
            <Route path="/dashboard" exact render={(...props) => (
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <Dashboard {...this.props} role={this.state.role} Scrapper={this.Scrapper} />
              ) : (
                <Redirect to="/landing"/>
              )
            )} />
            <Route path="/afore-dashboard" exact render={(...props) => (
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <AforeDashboard {...this.props} role={this.state.role}/>
              ) : (
                <Redirect to="/landing"/>
              )
            )} />
            <Route path="/settings" exact render={(...props) => (
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <Settings {...this.props} role={this.state.role}/>
              ) : (
                <Redirect to="/landing"/>
              )
            )} />            
            <Route path="/profile" exact render={(...props) => (
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <Profile {...this.props} role={this.state.role} />
              ) : (
                <Redirect to="/landing" />
              )
            )} />
            <Route path="/user-profile" exact render={(...props) => (
              this.state.role === "no" ? (
                <Redirect to="/pay" />
              ) : this.props.auth.isAuthenticated() ? (
                <UserProfile {...this.props} role={this.state.role} />
              ) : (
                <Redirect to="/landing" />
              )
            )} />
            <Redirect from="/" to="/landing" />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
