import React, {Component} from 'react'
import { Spinner } from 'reactstrap';
import Tono from '../../img/tono.png'

class AforeCoincidence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: 'https://ocrimagerecognition.blob.core.windows.net/demo/'
    }
  }
  
  render() {
    return(
      <React.Fragment>
        <div className="afore-coincidence">
          <div className="wrapper">
            <div className="img-wrapper">
              <p className="subtitle">INE</p>
              <img src={ this.state.url + this.props.params.afore.name_ine } alt=""/>
            </div>
            {this.props.params.afore.identity_verified && <div className="element-wrapper">
              <i className="fas fa-check-circle -succes"></i>              
            </div> }
            {this.props.params.afore.identity_verified === false && <div className="element-wrapper">
              <i className="fas fa-times-circle -error"></i>
              <p className="warning">La imagen del INE no coincide con la imagen del video, es necesario volver a cargar archivos</p>
            </div>}
            {(this.props.params.error === 'Documento no identificado' || this.props.params.error === 'Documento en mala posicion') && <div className="element-wrapper">
              <i className="fas fa-times-circle -error"></i>
              <p className="warning">{this.props.params.error}</p>
            </div>}
            <div className="img-wrapper">
              <p className="subtitle">Video</p>
              <img src={ this.state.url + this.props.params.afore.name_video } alt=""/>
            </div>
          </div>

          <div className="wrapper">
            <p className="mb-0"></p>
            {this.props.params.afore.name_verified && <div className="element-wrapper">
              <i className="fas fa-check-circle -succes"></i>
              <p>El nombre del video coincide con el INE.</p>
              </div>}
            {this.props.params.afore.name_verified === false && <div className="element-wrapper">
              <i className="fas fa-times-circle -error"></i>
              <p className="warning">El nombre del video no coincide con el INE.</p>
            </div>}
            <p className="mb-0"></p>
          </div>
          {/*this.props.params.show_spinner && <div className={"spinnermodal "}>
            <Spinner style={{ width: '2rem', height: '2rem' }} />{' '}
    </div>*/}
        </div>
        
      </React.Fragment>
    )
  }
}

export default AforeCoincidence