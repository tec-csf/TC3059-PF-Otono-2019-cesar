import React, { Component } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import {   
  FaChevronDown } from 'react-icons/fa'
import PlanDescription from '../components/PlanDescription/PlanDescription'
import ServicesCard from '../components/ServicesCard/ServicesCard'
import DropdownSelect from '../components/DropdownSelect/DropdownSelect'

const dropdown_plan_items = [
  {
    value: "básico",
    text: "Plan básico"
  },
  {
    value: "intermedio",
    text: "Plan intermedio"
  },
  {
    value: "avanzado",
    text: "Plan avanzado"
  }
]

class SelectPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plan: ""
    }
  }

  componentDidMount() {
    this.setState({plan: this.props.plan})
  }

  returnToPay = () => {
    this.props.setState({select_plan: false})
  }

  changePlan = (event) => {
    switch (event) {
      case "básico":
        var price = 10;
        break
      case "intermedio":
        var price = 50;
        break
      case "avanzado":
        var price = 250;
        break
    }
    this.setState({ plan: event })
    this.props.setState({
      plan: event,
      price: price
    })
  }

  render() {    
    return(
      <React.Fragment>
        <Navbarmenu {...this.props}/>
        <div className="container mt-60">
          <div className="row d-flex">
            <div className="col-12 mt-50">
              <a href="#" onClick={this.returnToPay} className="button -fabtn"><i class="fas fa-arrow-left"></i></a>
            </div>
          </div>

          <div className="row d-flex">
            <div className="col-12">
              <p className="title my-30">SELECCIONAR PLAN</p>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">
              <DropdownSelect customClass="mb-30" styleSelect="mb-30 d-flex w-100" onChange={this.changePlan} items={dropdown_plan_items} selected="Plan básico" />
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">
              <PlanDescription customClass="my-50" plan={this.state.plan}/>
            </div>
            
            <div className="col-12 col-lg-6">
              <div className="row">
                <div className="col-6 col-lg-4">
                  <ServicesCard customClass="mb-50" icon="fab fa-twitter" title="Twitter"/>
                </div>
                <div className="col-6 col-lg-4">
                  <ServicesCard customClass="mb-50" icon="fas fa-newspaper" title="Noticias"/>
                </div>
              </div>

              {this.state.plan === 'intermedio' &&
                <div className="row">
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-donate" title="SAT"/>
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-balance-scale" title="Suprema corte"/>
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-book" title="Diario oficial"/>
                  </div>
                </div>             
              }  
              {this.state.plan === 'avanzado' &&
                <div className="row">
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-donate" title="SAT" />
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-balance-scale" title="Suprema corte" />
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-book" title="Diario oficial" />
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-sitemap" title="OFAC" />
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-passport" title="ONU" />
                  </div>
                  <div className="col-6 col-lg-4">
                    <ServicesCard customClass="mb-50" icon="fas fa-university" title="PEP" />
                  </div>
                </div> 
              }
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">              
              <a href="#" onClick={this.returnToPay}><button className="button -primary" >Ir a método de pago</button></a>
            </div>
          </div>

        </div>
      </React.Fragment>
    )
  }
}

export default SelectPlan