import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {
  FaArrowLeft,
  FaExchangeAlt
  } from 'react-icons/fa'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  ButtonSubmit,
  ButtonPrimary } from '../components/Button/Button'
import AmexLogo from '../img/Amex.svg'
import CarnetLogo from '../img/Carnet.svg'
import VisaLogo from '../img/Visa.svg'
import MasterLogo from '../img/Master.svg'
import OpenPayLogo from '../img/logo_openpay.svg'
import InputForm from '../components/InputForm/InputForm'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import SelectPlan from '../pages/SelectPlan'

const API_URL = process.env.REACT_APP_API_URL
const re_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const re_card = /^\d+$/;

window.OpenPay.setId('mec335nw7tdv7ozibwhe');
window.OpenPay.setApiKey('pk_f8b6680f9ae64335a1f8aedafec8c4f4');
window.OpenPay.setSandboxMode(true);

class Pay extends Component{

  constructor(props) {
    super(props);

    this.state = {
      role:'',
      price: '10',
      redirect: false,
      select_plan: false,
      plan: "básico",
      name: "",
      lastname: "",
      email: "",
      card: "",
      month: "",
      year: "",
      cvv: "",
      modal: false,
      modal_text: "",
      modal_title: "",
      button_continue: false,
      invalid: true,
      validEmail: false,
      validCard: false,
      validMonth: false,
      validYear: false,
      validCvv: false,
      termsChecked: false,
      warningEmail: "",
      warningCard: "",
      warningMonth: "",
      warningYear: "",
      warningCvv: ""
    }
  }

  componentDidMount = () => {
    this.setState({select_plan: this.props.select_plan})
  }

  componentDidUpdate = () => {
    if (this.state.invalid && this.state.termsChecked && this.state.validEmail && this.state.validCard && this.state.validMonth && this.state.validYear && this.state.validCvv && this.state.name.length > 0 && this.state.lastname.length > 0) {
      this.setState({
        invalid: false
      })
    }
  }

  updateRole = (event) => {

    let acPrice = '0'

    switch(event.target.value){
      case 'basico':
        acPrice = '200'
        break;
      case 'intermedio':
        acPrice = '300'
        break;
      case 'pro':
        acPrice = '400'
        break;
      default:
        break;
    }

    this.setState({
      role: event.target.value,
      price: acPrice
    })
  }

  payRole = async () => {
    
    switch (this.state.plan) {
      case "básico":
        var plan = "basico";
        break
      case "intermedio":
        var plan = "intermedio";
        break
      case "avanzado":
        var plan = "pro";
        break
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
          
          this.props.checkRole().then(() => {
            this.setState({
              redirect:true
            })
          })

        });
      }
  }

  chargeOpenPay = (ev) => {
    ev.preventDefault();
    window.OpenPay.token.create({
      "card_number": this.state.card,
      "holder_name": this.state.name + " " + this.state.lastname,
      "expiration_year": this.state.year,
      "expiration_month": this.state.month,
      "cvv2": this.state.cvv
    }, this.onSuccess, this.onError);
  }

  onSuccess = (response) => {
    console.log(response);
    switch (this.state.plan) {
      case "básico":
        var plan = 0;
        break
      case "intermedio":
        var plan = 1;
        break
      case "avanzado":
        var plan = 2;
        break
    }

    var token_id =  response.data.id;
    axios.post("https://us-central1-monitoreo-empresas.cloudfunctions.net/Risk-Subscription", {
      name: this.state.name,
      last_name: this.state.lastname,
      email: this.state.email,
      package: plan,
      token: token_id,
      device_session_id: window.OpenPay.deviceData.setup()
    }).then((res) => {
      console.log(res);
      this.setState({
        modal_title: "Transacción exitosa",
        modal_text: "Su pago se ha realizado con éxito.",
        button_continue: true
      })
      this.toggleModal();
    }).catch((error) => {
      this.setState({
        modal_title: "Error en el Pago",
        button_continue: false
      })
      switch(error.response.data.error_code) {
        case 3001:
          this.setState({
            modal_text: "Su tarjeta fue declinada."
          })
          break;
        case 3002:
          this.setState({
            modal_text: "Su tarjeta está expirada."
          })
          break;
        case 3003:
          this.setState({
            modal_text: "Su tarjeta no tiene los fondos suficientes."
          })
          break;
        case 3004:
          this.setState({
            modal_text: "Su tarjeta aparece como robada."
          })
          break;
        case 3005:
          this.setState({
            modal_text: "Su tarjeta fue rechazada por el sistema antifraude."
          })
          break;
        case 3006:
          this.setState({
            modal_text: "La operación no es permitida para este usuario o transacción."
          })
        case 3008:
          this.setState({
            modal_text: "Su tarjeta no permite transacciones en línea."
          })
          break;
        case 3009:
          this.setState({
            modal_text: "Su tarjeta aparece como perdida."
          })
        case 3010:
          this.setState({
            modal_text: "La tarjeta fue rechazada por su banco."
          })
        case 3011:
          this.setState({
            modal_text: "El banco pidió retener su tarjeta, por favor comuníquese con su banco."
          })
        case 3012:
          this.setState({
            modal_text: "Se requiere autorización de su banco para realizar la transacción."
          })
        default:
          this.setState({
            modal_text: "Hubo un error en su forma de pago."
          })
          break
      }
      this.toggleModal();
    })
  }

  onError = (response) => {
    console.log(response);
  }

  changePlan = () => {
    this.setState({select_plan: true})
  }

  _setState = (state) => {
    this.setState(state);
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/welcome' />
    }
  }

  handlerName = (event) => {
    this.setState({ name: event.target.value })
  }

  handlerLastName = (event) => {
    this.setState({ lastname: event.target.value })
  }

  handlerEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  handlerCard = (event) => {
    this.setState({ card: event.target.value })
  }

  handlerMonth = (event) => {
    this.setState({ month: event.target.value })
  }

  handlerYear = (event) => {
    this.setState({ year: event.target.value })
  }

  handlerCvv = (event) => {
    this.setState({ cvv: event.target.value })
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    })
  }

  validateEmail = () => {
    if (!re_email.test(this.state.email)) {
      this.setState({
        warningEmail: " -warning",
        messageEmail: "Correo no válido",
        validEmail: false,
        invalid: true
      })
    }
    else {
      this.setState({
        warningEmail: "",
        messageEmail: "Correo no válido",
        validEmail: true
      })
    }
  }

  validateCard = () => {
    if (!re_card.test(this.state.card)) {
      this.setState({
        warningCard: " -warning",
        validCard: false,
        invalid: true
      })
    }
    else {
      this.setState({
        warningCard: "",
        validCard: true
      })
    }
  }

  validateMonth = () => {
    if (!re_card.test(this.state.month)) {
      this.setState({
        warningMonth: " -warning",
        validMonth: false,
        invalid: true
      })
    }
    else {
      this.setState({
        warningMonth: "",
        validMonth: true
      })
    }
  }

  validateYear = () => {
    if (!re_card.test(this.state.year)) {
      this.setState({
        warningYear: " -warning",
        validYear: false,
        invalid: true
      })
    }
    else {
      this.setState({
        warningYear: "",
        validYear: true
      })
    }
  }

  validateCvv = () => {
    if (!re_card.test(this.state.cvv)) {
      this.setState({
        warningCvv: " -warning",
        validCvv: false,
        invalid: true
      })
    }
    else {
      this.setState({
        warningCvv: "",
        validCvv: true
      })
    }
  }

  validateTerms = (event) => {
    if (event.target.checked) {
      this.setState({
        termsChecked: true
      })
    }
    else {
      this.setState({
        termsChecked: false,
        invalid: true
      })
    }
  }

  render() {
    if (this.state.select_plan) {
      return(
        <SelectPlan plan={this.state.plan} setState={this._setState} {...this.props}/>
      )
    }
    else {
      return(
        <div>
        { this.renderRedirect() }
          <div>
            <Modal centered={true} isOpen={this.state.modal} toggle={() => this.toggleModa()} className={this.props.className}>
              <ModalHeader toggle={() => this.toggleModal()}>{this.state.modal_title}</ModalHeader>
              <ModalBody>
                {this.state.modal_text}
              </ModalBody>
              <ModalFooter>
                {!this.state.button_continue &&
                  <ButtonPrimary onClick={() => this.toggleModal()} title="Cerrar"></ButtonPrimary>
                }
                {this.state.button_continue &&
                  <ButtonPrimary onClick={() => this.payRole()} title="Continuar"></ButtonPrimary>
                }
              </ModalFooter>
            </Modal>
          </div>
          <Navbarmenu {...this.props}/>
          <div className="container mt-90">
            <div className="row d-flex">
              <div className="col-12 mt-50">
                <a href="/landing" className="button -fabtn"><i class="fas fa-arrow-left"></i></a>
              </div>
            </div>
  
            <div className="row d-flex">
              <div className="col-12">
                <p className="title my-30">MÉTODO DE PAGO</p>
              </div>
            </div>
  
            <div className="row">
              <div className="col-12 col-lg-6">              
                <p>Aceptamos cualquier tarjeta de débito/crédito</p>
                <div className="d-flex">
                  <img className="mr-10 mb-10" src={ AmexLogo } alt=""/>
                  <img className="mr-10 mb-10" src={ CarnetLogo } alt=""/>
                  <img className="mr-10 mb-10" src={ VisaLogo } alt=""/>
                  <img className="mr-10 mb-10" src={ MasterLogo } alt=""/>
                </div>                    
              </div>
            </div>
            <form onSubmit={this.chargeOpenPay}>
              <div className="row">
                <div className="col-12 col-lg-6">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" type="text" label="Nombre como aparece en la tarjeta" onChange={this.handlerName} required/>
                    </div>
                    <div className="col-12 col-lg-6">
                      <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" type="text" label="Apellido como aparece en la tarjeta" onChange={this.handlerLastName} required/>
                    </div>
                  </div>
                  <InputForm inputColor="-secondary" customClasses="mt-50" warning="Correo no válido" type="text" label="Correo electrónico" onChange={this.handlerEmail} onBlur={this.validateEmail} warningMessage={this.state.warningEmail} required/>
                  <InputForm inputColor="-secondary" customClasses="mt-50" warning="Número de tarjeta no válido" type="text" label="Número de tarjeta" onChange={this.handlerCard} onBlur={this.validateCard} warningMessage={this.state.warningCard} maxLength="16" />
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <InputForm inputColor="-secondary" customClasses="mt-50" warning="Mes no válido" type="text" placeholder="MM" label="Mes de vencimiento" onChange={this.handlerMonth} onBlur={this.validateMonth} warningMessage={this.state.warningMonth} maxLength="2" required/>
                    </div>
                    <div className="col-12 col-lg-6">
                      <InputForm inputColor="-secondary" customClasses="mt-50" warning="Año no válido" type="text" placeholder="AA" label="Año de vencimiento" onChange={this.handlerYear} onBlur={this.validateYear} warningMessage={this.state.warningYear} maxLength="2" required/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <InputForm inputColor="-secondary" customClasses="mt-50" warning="CVV no válido" type="text" placeholder="CVV" label="Número de validación" onChange={this.handlerCvv} onBlur={this.validateCvv} warningMessage={this.state.warningCvv} maxLength="4" required/>
                    </div>                      
                  </div>
                </div>
    
                <div className="col-12 col-lg-4">
                  <div className="cm-card -dark mt-50">
                    <p className="subtitle">Resumen</p>
                    <p>Plan {this.state.plan}</p>
                    <p className="higlight-big mb-30">${this.state.price}.<sup>00</sup></p>
                    {/* <button onClick={this.changePlan}> */}
                      <a href="#" onClick={this.changePlan}>CAMBIAR PLAN <i class="fas fa-long-arrow-alt-right"></i></a>
                    {/* </button> */}
                  </div>
                </div>
              </div>
    
              <div className="row">
                <div className="col-12 col-lg-6 mt-50">
                  <p>Tu compra está asegurada a través de <a target="blank" href="https://www.openpay.mx/">Open pay</a> un vendedor certificado </p>
                  <img className="mr-10 mb-10" src={ OpenPayLogo } alt=""/>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <input className="mt-50" type="checkbox" name="vehicle1" value="Bike" required onChange={this.validateTerms} /> He leido y estoy de acuerdo con los <a href="/terms">Términos y condiciones</a>
                </div>
              </div>
    
              <div className="row">
                <div className="col-12 col-lg-4">
                  <ButtonSubmit title="Pagar" customClass="my-30" disabled={this.state.invalid} />

                  {/* <ButtonPrimary
                    onClick = {() => { this.chargeOpenPay(); }}
                    title="Pagar"
                    customClass="my-30"
                  /> */}
                </div>
              </div>                 
            </form>
          </div>        
  
        </div>
      )
    }
  }
}

export default Pay

