import React, { Component } from 'react'

class PlanDescription extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.plan === 'básico') {
      return (
        <React.Fragment>
          <div className={"plan-description " + this.props.customClass}>
            <div className="price">
              <p>Precio</p>
              <p>$10.<sup>00</sup></p>
            </div>
            <div className="price">
              <p>Impuestos</p>
              <p>$0.<sup>00</sup></p>
            </div>
            <div className="price">
              <p> <b>TOTAL</b> </p>
              <p>$10.<sup>00</sup></p>
            </div>
  
            <ul className="mt-50">
              <li>Registra hasta 5 personas físicas</li>
              <li>Registra hasta 2 personas morales</li>
              <li>Monitoreo de cuentas de twitter</li>
              <li>Monitoreo de las principales fuentes de noticias (El universal, El financiero)</li>
            </ul>
          </div>
        </React.Fragment>
      )
    }
    else if (this.props.plan === 'intermedio')  {
      return (
        <React.Fragment>
          <div className={"plan-description " + this.props.customClass}>
            <div className="price">
              <p>Precio</p>
              <p>$50.<sup>00</sup></p>
            </div>
            <div className="price">
              <p>Impuestos</p>
              <p>$0.<sup>00</sup></p>
            </div>
            <div className="price">
              <p> <b>TOTAL</b> </p>
              <p>$50.<sup>00</sup></p>
            </div>

            <ul className="mt-50">
              <li>Registra hasta 15 personas físicas</li>
              <li>Registra hasta 7 personas morales</li>
              <li>Monitoreo de cuentas de twitter</li>
              <li>Monitoreo de las principales fuentes de noticias (El universal, El financiero)</li>
              <li>Monitoreo de SAT</li>
              <li>Monitoreo de Suprema Corte</li>
              <li>Monitoreo de Diario Oficial</li>
            </ul>
          </div>
        </React.Fragment>
      )
    }
    else {
      return (
        <React.Fragment>
          <div className={"plan-description " + this.props.customClass}>
            <div className="price">
              <p>Precio</p>
              <p>$250.<sup>00</sup></p>
            </div>
            <div className="price">
              <p>Impuestos</p>
              <p>$0.<sup>00</sup></p>
            </div>
            <div className="price">
              <p> <b>TOTAL</b> </p>
              <p>$250.<sup>00</sup></p>
            </div>

            <ul className="mt-50">
              <li>Registra hasta 115 personas físicas</li>
              <li>Registra hasta 57 personas morales</li>
              <li>Monitoreo de cuentas de twitter</li>
              <li>Monitoreo de las principales fuentes de noticias (El universal, El financiero)</li>
              <li>Monitoreo de SAT</li>
              <li>Monitoreo de Suprema Corte</li>
              <li>Monitoreo de Diario Oficial</li>
              <li>Monitoreo de ONU</li>
              <li>Monitoreo de OFAC</li>
              <li>Monitoreo de listas de Personas Políticamente Expuestas</li>
            </ul>
          </div>
        </React.Fragment>
      )
    }
  }
}

export default PlanDescription