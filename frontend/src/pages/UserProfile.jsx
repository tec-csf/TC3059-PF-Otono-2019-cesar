import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import {
  FaArrowLeft,
  FaUserAlt,
  FaReceipt } from 'react-icons/fa'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import InputForm from '../components/InputForm/InputForm'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'
import { ButtonPrimary } from '../components/Button/Button';
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      user_name: '', 
      user_lastname: '',
      email: '',
      phone: '',
      comp_name: '', 
      r_z: '',
      pers_type: '',
      RFC: '', 
      country: '', 
      city: '', 
      region: '', 
      street: '', 
      ex_num: '',
      int_num: '',
      post_code: '',
      redirect: false
    };
  }

  updateUserName = (event) => {
    this.setState({
      user_name: event.target.value
    })
  }
  updateUserLast = (event) => {
    this.setState({
      user_lastname: event.target.value
    })
  }
  updateMail = (event) => {
    this.setState({
      email: event.target.value
    })
  }
  updatePhone = (event) => {
    this.setState({
      phone: event.target.value
    })
  }
  updateCompany = (event) => {
    this.setState({
      comp_name: event.target.value
    })
  }
  updateRZ = (event) => {
    this.setState({
      r_z: event.target.value
    })
  }
  updatePersontype = (event) => {
    this.setState({
      pers_type: event.target.value
    })
  }
  updateRFC= (event) => {
    this.setState({
      RFC: event.target.value
    })
  }
  updateCountry = (event) => {
    this.setState({
      country: event.target.value
    })
  }
  updateCity = (event) => {
    this.setState({
      city: event.target.value
    })
  }
  updateRegion = (event) => {
    this.setState({
      region: event.target.value
    })
  }
  updateStreet = (event) => {
    this.setState({
      street: event.target.value
    })
  }
  updateExNum = (event) => {
    this.setState({
      ex_num: event.target.value
    })
  }
  updateIntNum = (event) => {
    this.setState({
      int_num: event.target.value
    })
  }
  updatePostCode = (event) => {
    this.setState({
      post_code: event.target.value
    })
  }

  SaveMetaData(){

    if (this.state.user_name === '' || 
    this.state.user_lastname === '' ||
    this.state.email === '' ||
    this.state.phone === '' ||
    this.state.comp_name === '' || 
    this.state.r_z === '' ||
    this.state.pers_type === '' ||
    this.state.RFC === '' || 
    this.state.country === '' || 
    this.state.city === '' ||
    this.state.region === '' || 
    this.state.street === '' ||
    this.state.ex_num === '' ||
    this.state.post_code === ''){

      alert("Faltan campos por llenar")

    } 
    else 
    {
      axios.post(API_URL + "/api/v1/change/metadata", {
      data: {
        user_name: this.state.user_name,
        user_lastname: this.state.user_lastname,
        email: this.state.email,
        phone: this.state.phone,
        comp_name: this.state.comp_name,
        r_z: this.state.r_z,
        pers_type: this.state.pers_type,
        RFC: this.state.RFC,
        country: this.state.country,
        city: this.state.city,
        region: this.state.region,
        street: this.state.street,
        ex_num: this.state.ex_num,
        int_num: this.state.int_num,
        post_code: this.state.post_code
      },
      user_id: jwtDecode(localStorage.getItem("id_token")).sub
      }).then((res) => {
        this.setState({
          redirect:true
        })
      });
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return(
      <div>
        {this.state.redirect && <Redirect to='/pay'/>}
        <Navbarmenu {...this.props}></Navbarmenu>
          <div className="container-fluid p-0">
            <Sidenav/>
            <div className="container">
              <div className="row mt-30">
                <div className="col-12 col-lg-6">
                  <a href="/" className="fa-btn"><FaArrowLeft/></a>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="title my-30">Datos del perfil</h4>                  
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-10">
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => { this.toggle('1'); }}
                        >
                        <FaUserAlt/>
                        <span className="ml-10">Datos de contacto</span> 
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => { this.toggle('2'); }}
                        >
                        <FaReceipt/>
                        <span className="ml-10">Facturación</span> 
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                      <div className="cm-card">
                        <form action="">                  
                          <Row>
                            <Col sm="12" md="6">                            
                              <InputForm customClasses="mt-30" value={this.state.user_name} onChange={this.updateUserName} warning="Datos no válidos" type="text" label="Nombre del usuario"/>
                            </Col>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-30" value={this.state.user_lastname} onChange={this.updateUserLast} warning="Datos no válidos" type="text" label="Apellidos"/>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.email} onChange={this.updateMail} warning="Datos no válidos" type="email" label="Correo electrónico"/>
                            </Col>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.phone} onChange={this.updatePhone} warning="Datos no válidos" type="number" label="Número telefónico"/>
                            </Col>
                          </Row>
                        </form>
                        <Row>
                          <div className="col-12">
                            <ButtonPrimary title="CONTINUAR" onClick={() => { this.toggle('2'); }} customClass="mt-30"/>
                          </div>
                        </Row>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className="cm-card">
                        <form action="">
                          <Row>  
                            <Col sm="12">                            
                              <InputForm customClasses="mt-30" value={this.state.comp_name} onChange={this.updateCompany} warning="Datos no válidos" type="text" label="Nombre de la compañía"/>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="12">
                              <InputForm customClasses="mt-50" value={this.state.r_z} onChange={this.updateRZ} warning="Datos no válidos" type="text" label="Razón social"/>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.pers_type} onChange={this.updatePersontype} warning="Datos no válidos" type="text" label="Tipo de persona"/>
                            </Col>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.RFC} onChange={this.updateRFC} warning="Datos no válidos" type="text" label="RFC"/>
                            </Col>
                          </Row>                        

                          <Row>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.country} onChange={this.updateCountry} warning="Datos no válidos" type="text" label="País"/>
                            </Col>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.city} onChange={this.updateCity} warning="Datos no válidos" type="text" label="Ciudad"/>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.region} onChange={this.updateRegion} warning="Datos no válidos" type="text" label="Provincia/Región"/>
                            </Col>
                            <Col sm="12" md="6">
                              <InputForm customClasses="mt-50" value={this.state.street} onChange={this.updateStreet} warning="Datos no válidos" type="text" label="Calle"/>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="12" md="4">
                              <InputForm customClasses="mt-50" value={this.state.ex_num} onChange={this.updateExNum} warning="Datos no válidos" type="number" label="Número exterior"/>
                            </Col>
                            <Col sm="12" md="4">
                              <InputForm customClasses="mt-50" value={this.state.int_num} onChange={this.updateIntNum} warning="Datos no válidos" type="text" label="Número interior"/>
                            </Col>
                            <Col sm="12" md="4">
                              <InputForm customClasses="mt-50" value={this.state.post_code} onChange={this.updatePostCode} warning="Datos no válidos" type="number" label="Código postal"/>
                            </Col>
                          </Row>
                        </form>
                        <Row>
                          <div className="col-12">
                            <ButtonPrimary title="GUARDAR" onClick={() => { this.SaveMetaData(); }} customClass="mt-30"/>
                          </div>
                        </Row>
                      </div>
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default UserProfile