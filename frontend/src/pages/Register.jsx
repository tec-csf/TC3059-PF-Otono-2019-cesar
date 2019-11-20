import React, { Component } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import { ButtonSubmit } from '../components/Button/Button'
import InputForm from '../components/InputForm/InputForm'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import ContactTopBar from '../components/ContactTopBar/ContactTopBar'

const API_URL = process.env.REACT_APP_API_URL
const re_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const re_phone = /^\d+$/;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      company: "",
      password: "",
      redirect: false,
      validEmail: false,
      validPhone: false,
      // validPassword: true,
      warningEmail: "",
      warningPhone: "",
      warningPassword: "",
      messageEmail: "Correo no válido",
      messagePassword: "Contraseña no válida",
      invalid: true,
      termsChecked: false
    }
  }

  componentDidUpdate = () => {
    if (this.state.invalid && this.state.termsChecked && this.state.validEmail && this.state.validPhone && this.state.name.length > 0 && this.state.lastname.length > 0 && this.state.company.length > 0 && this.state.password.length > 0) {      
      this.setState({
        invalid: false
      })
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

  handlerPhone = (event) => {
    this.setState({ phone: event.target.value })
  }

  handlerCompany = (event) => {
    this.setState({ company: event.target.value })
  }

  handlerPassword = (event) => {
    this.setState({ password: event.target.value })
  }

  registerUser = (event) => {
    event.preventDefault();
    
    axios.post(API_URL + "/api/v1/register/user", {
      email: this.state.email,
      user_metadata: {},
      blocked: false,
      email_verified: false,
      app_metadata: {},
      given_name: this.state.name,
      family_name: this.state.lastname,
      name: this.state.name + " " + this.state.lastname,
      connection: "Username-Password-Authentication",
      password: this.state.password,
      verify_email: false
    }).then((res) => {
      if (res.data.email === this.state.email) {
        this.setState({redirect: true})
      }
      else {
        var warning;
        switch (res.data.statusCode) {
          case 400:
            warning = "Contraseña muy débil"
            this.setState({
              messagePassword: warning,
              warningPassword: " -warning"
            })
            break;
          case 409:
            warning = "Usuario ya existe en la base de datos";
            this.setState({
              messageEmail: warning,
              warningEmail: " -warning"
            })
            break;
          default:
            warning = "Hubo un error con tu registro";
            this.setState({
              messagePassword: warning,
              warningPassword: " -warning"
            })
        }
      }
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

  validatePhone = () => {
    if (!re_phone.test(this.state.phone)) {
      this.setState({ 
        warningPhone: " -warning",
        validPhone: false,
        invalid: true
      })
    }
    else {
      this.setState({ 
        warningPhone: "",
        validPhone: true
      })
    }
  }

  validatePassword = () => {
    this.setState({ warningPassword: "" });

    if (this.state.password.length <= 0) {
      this.setState({
        invalid: true
      })
    }
  }

  validateName = () => {
    if (this.state.name.length <= 0) {
      this.setState({
        invalid: true
      })
    }
  }

  validateLastName = () => {
    if (this.state.lastname.length <= 0) {
      this.setState({
        invalid: true
      })
    }
  }

  validateCompany = () => {
    if (this.state.company.length <= 0) {
      this.setState({
        invalid: true
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
    if (this.state.redirect) {
      return <Redirect to='/confirmation' />
    }
    return(
      <React.Fragment>
        <ContactTopBar/>
        <Navbarmenu {...this.props}/>
        <div className="container mt-90">
          <div className="row d-flex">
            <div className="col-12 mt-50">
              <a href="/landing" className="button -fabtn"><i class="fas fa-arrow-left"></i></a>
            </div>
          </div>

          <div className="row d-flex">
            <div className="col-12">
              <p className="title mt-30">REGISTRO</p>
            </div>
          </div>

          <form onSubmit={this.registerUser}>
            <div className="row d-flex">
              <div className="col-12 col-lg-6 mt-50">
                <InputForm inputColor="-secondary" warning="Datos no válidos" onChange={this.handlerName} type="text" label='Nombre*' onBlur={this.validateName} required/>
              </div>

              <div className="col-12 col-lg-6 mt-50">
                <InputForm inputColor="-secondary" warning="Datos no válidos" onChange={this.handlerLastName} type="text" label='Apellidos*' onBlur={this.validateLastName} required/>
              </div>

              <div className="col-12 col-lg-6 mt-50">
                <InputForm inputColor="-secondary" warning={this.state.messageEmail} onChange={this.handlerEmail} type="text" placeholder="ejemplo@dominio.com" label='Correo*' onBlur={this.validateEmail} warningMessage={this.state.warningEmail} required/>
              </div>

              <div className="col-12 col-lg-6 mt-50">
                <InputForm pattern="[0-9]*" inputColor="-secondary" warning="Número no válido" onChange={this.handlerPhone} type="tel" placeholder="(55) 555 55 555" label='Teléfono*' onBlur={this.validatePhone} warningMessage={this.state.warningPhone} required/>
              </div>

              <div className="col-12 col-lg-6 mt-50">
                <InputForm inputColor="-secondary" warning="Datos no válidos" onChange={this.handlerCompany} type="text" label='Empresa*' onBlur={this.validateCompany} required/>
              </div>

              <div className="col-12 col-lg-6 mt-50">
                <InputForm inputColor="-secondary" warning={this.state.messagePassword} onChange={this.handlerPassword} type="password" label='Contraseña*' onBlur={this.validatePassword} warningMessage={this.state.warningPassword} required/>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <input className="mt-50" type="checkbox" name="vehicle1" value="Bike" required onChange={this.validateTerms}/> He leido y estoy de acuerdo con los <a href="/terms">Términos y condiciones</a>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-4">
                {/* <button type="submit">hola</button> */}
                <ButtonSubmit title="Registrarme" customClass="mt-50" disabled={this.state.invalid}/>
              </div>
            </div>
          </form>

        </div>
      </React.Fragment>
    )
  }
}

export default Register