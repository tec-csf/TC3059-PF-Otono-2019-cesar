import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

class PlanCard extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)

    this.state={
      redirect:false
    }
    
  }

  listBenefits = this.props.benefits.map((benefit) =>
    <li className="listelement">{benefit}</li>
  );

  buyPlan= (planType) =>{
    let plan 
    switch (planType) {
      case 'BÁSICO':
        plan = 'basico'
        break;
      case 'INTERMEDIO':
        plan = 'intermedio'
        break;
      case 'EMPRESARIAL':
        plan = 'pro'
        break;
      default:
        break;
    }

    if (localStorage.getItem("id_token")){

      const options = {
        heders:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          'role':plan,
          'user_id':jwtDecode(localStorage.getItem("id_token")).sub
        }
      }

      axios.post(API_URL + "/api/v1/change_role", {
        data: options
      }).then((res) => {

        localStorage.setItem("role", plan);

        this.setState({
          redirect:true
        })

      });
    }
  }

  onClick() {
    if (!this.props.auth.isAuthenticated()){
      this.props.auth.login()
    }
    else{
      this.buyPlan(this.props.title)
    }
  }

  render() {

    if(this.state.redirect){
      return(<Redirect to="/welcome" {...this.props}/>)
    }
    return (
      <div>
        <div className={`pay-card ${this.props.customClasses}`}>
          <img className="payicon" src={this.props.image} alt=""></img>
          <p className="subtitle">{this.props.title}</p>
          <p className={`title ${this.props.planColor}`}>{this.props.price}</p>
          <p>{this.props.description}</p>
          <p className={`${this.props.planColor}`}><b>{this.props.lastBenefits}</b></p>
          <ul className="list-style">
            {this.listBenefits}
          </ul>
          <button className="cm-btn -primary w-100 my-30" onClick={this.onClick}>Contratar</button>
        </div>

      </div>
    );
  }
}

export default PlanCard
