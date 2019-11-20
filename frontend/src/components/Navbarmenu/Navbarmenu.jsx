import React, {Component} from 'react'
import { 
  FaUserCircle, 
  FaRegBell,
  FaSignOutAlt,
  FaCog,
  FaBullseye,
  FaBook } from 'react-icons/fa'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem  } from 'reactstrap';

import { ButtonSecondary } from '../Button/Button'
import { Redirect } from 'react-router-dom'

  // import Logo from '../../img/logo-r-c.svg'
import Logo from '../../img/logo-r-c.svg'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

class Navbarmenu extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      redirect: false,
      page: '',
      classPost: ''
    };
  }

  onClickIn = () => {
    this.props.auth.login()
  }

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated()) {
      this.setState({
        redirect: true,
        classPost: 'post-0'
      }, () => {
        this.renderRedirect()
      })
    }
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      axios.get(API_URL + "/api/v1/search/metadata", {
        params: {
          user_id: jwtDecode(localStorage.getItem("id_token")).sub
        }
      }).then((res) => {

        if (res.data === "empty") {
          this.setState({
            page: 'user'
          })
        }
        else {
          this.setState({
            page: 'welcome'
          })
        }
      });
    }
  }

  renderRedirectUser() {
    return <Redirect to='/user-profile' />
  }

  renderRedirectWelcome() {
    return <Redirect to='/Welcome' />
  }

  onClickOut = () => {
    this.props.auth.logout()
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar className={this.state.classPost} expand="md">
          {/* <NavbarBrand href="/"><img src={ Logo } alt=""/></NavbarBrand> */}
          <NavbarBrand href="/"><img src={Logo} alt=""/></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
              {this.props.auth.isAuthenticated() && 
                <Nav className="ml-auto" navbar>
                  <NavItem className="d-flex justify-content-center">
                    <a className="button -primary mr-20" href="/welcome">Inicio</a>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      <FaUserCircle />
                      Mi Cuenta
                    </DropdownToggle>
                    <DropdownMenu right>
                      {/* <a className="dropdown-item" href="/"><FaBullseye/>Cuenta Premium</a>
                      <a className="dropdown-item" href="/"><FaBook/>Mi perfil</a>
                      <a className="dropdown-item" href="/"><FaRegBell/>Notificaciones</a>                   */}
                      {/* <DropdwnItem divider /> */}
                      {/* <a className="dropdown-item" href="/" onClick={this.props.auth.logout}><FaSignOutAlt/>Cerrar sesión</a> */}
                      <a className="dropdown-item" href="/settings" ><FaCog />Ajustes</a>
                      <a className="dropdown-item" href="/" onClick={this.onClickOut}><FaSignOutAlt />Cerrar sesión</a>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              }
              {!this.props.auth.isAuthenticated() &&
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink href="#" onClick={this.onClickIn}>Iniciar sesión</NavLink>
                  </NavItem>
                  <NavItem className="d-flex justify-content-center">
                    <a className="button -primary" href="/register">Registrarme</a>
                  </NavItem>
                </Nav>
              }
              
              {/* <NavItem className="d-flex justify-content-center">
                <ButtonSecondary customClass="w-auto" title="Ver planes"/> 
              </NavItem> */}              
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navbarmenu