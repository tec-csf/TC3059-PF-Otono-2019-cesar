import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { 
  FaHome,
  FaUserPlus,
  FaExchangeAlt,
  FaCogs } from 'react-icons/fa'

class Sidenav extends Component {
  render () {
    return (
      <div className="sidenav-bar">
        <Link to="/welcome" className="iconbutton">
          <FaHome/>
          <p className="mb-0 d-none d-md-block">Análisis cognitivo</p>
        </Link>
        <Link to="/afore-dashboard" className="iconbutton">
          <FaExchangeAlt/>
          <p className="mb-0 d-none d-md-block">Cambio de Afore</p>
        </Link>
      </div>
    )
  }
}

export default Sidenav