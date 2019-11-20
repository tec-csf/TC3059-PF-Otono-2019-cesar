import React, {Component} from 'react'
import {
  FaCheckCircle,
  FaExclamationTriangle} from 'react-icons/fa'

class CoincidenceLevel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      names: false,
      curps: false,
      images: false,
      compr: false,
      birthdates: false
    }
  }

  checkForChanges(){
    let names = this.props.params.names_comp
    let curps = this.props.params.curps_comp
    let birthdates = this.props.params.birthdates_comp
    let images = this.props.params.confidence >= 0.5

    this.setState({
      names,
      curps,
      images,
      birthdates
    })

    if(this.props.params.names_comp && this.props.params.curps_comp && this.props.params.birthdates_comp && this.props.params.confidence >= 0.5)
    {
      this.props.setState({continue:true})
    } else {
      this.props.setState({continue:true})
    }
  }

  componentDidUpdate(){

    // if (this.props.params.comp_data){
    //   this.checkForChanges();
    //   this.props.setState({comp_data:false})
    // }
  }

  componentDidMount(){
    this.checkForChanges();
  }

  render () {
     return (
      <div className="coincidence-level">


        <div className="coincidenceblock">
          <p className="coincidencename">Nombre</p>
          {!this.state.names &&
          <React.Fragment>
            <p>Selecciona el dato correcto</p>
            <div className="radio-group mb-10">
              <input type="radio" name="doc" className="radiooption" />
              <div className="radiodatawrapper">
                <p className="m-0"><b>Doc 1</b></p>
                <p className="radiodata mb-0">{this.props.params.name_1 + " " + this.props.params.first_surname_1 + " " + this.props.params.second_surname_1}</p>
              </div>
            </div>
            <div className="radio-group">
              <input type="radio" name="doc" className="radiooption" />
              <div className="radiodatawrapper">
                <p className="m-0"><b>Doc 2</b></p>
                <p className="radiodata mb-0">{this.props.params.name_2 + " " + this.props.params.first_surname_2 + " " + this.props.params.second_surname_2}</p>
              </div>
            </div>
          </React.Fragment>
          }{this.state.names &&
            <p>{this.props.params.name_1 + " " + this.props.params.first_surname_1 + " " + this.props.params.second_surname_1}</p>
          }
        </div>

        {this.state.curps &&
        <div className="coincidenceblock">
          <div className="coincidenceicon -succes">
            <FaCheckCircle/>
          </div>
          <p className="coincidencename">RFC / CURP</p>
          <p>{this.props.params.curp_1}</p>
        </div>
        }
        {!this.state.curps &&
          <div className="coincidenceblock">
          <div className="coincidenceicon -error">
            <FaExclamationTriangle/>
          </div>
          <p className="coincidencename">RFC / CURP</p>
          <p>{this.props.params.curp_1}</p>
          <p>{this.props.params.curp_2}</p>
        </div>
        }
        {!this.state.images &&
        <div className="coincidenceblock">
          <div className="coincidenceicon -error">
            <FaExclamationTriangle/>
          </div>
          <p className="coincidencename">Fotografía</p>
          <p>Las fotografías no coinciden, por favor intenta cargarlas de nuevo o sube un archivo diferente</p>
        </div>
        }
        {this.state.images &&
          <div className="coincidenceblock">
          <div className="coincidenceicon -succes">
          <FaCheckCircle/>
          </div>
          <p className="coincidencename">Fotografía</p>
          <p>Las fotografías coinciden</p>
        </div>
        }

        <div className="coincidenceblock">
          <p className="coincidencename">Fecha de Nacimiento</p>
          {!this.state.names &&
          <React.Fragment>
            <p>Selecciona el dato correcto</p>
            <div className="radio-group mb-10">
              <input type="radio" name="doc" className="radiooption" />
              <div className="radiodatawrapper">
                <p className="m-0"><b>Doc 1</b></p>
                <p className="radiodata mb-0">{this.props.params.birthdate_1}</p>
              </div>
            </div>
            <div className="radio-group">
              <input type="radio" name="doc" className="radiooption" />
              <div className="radiodatawrapper">
                <p className="m-0"><b>Doc 2</b></p>
                <p className="radiodata mb-0">{this.props.birthdate_2}</p>
              </div>
            </div>
          </React.Fragment>
          }{this.state.names &&
            <p>{this.props.params.birthdate_1}</p>
          }
        </div>
      </div>
    )
  }
}

export default CoincidenceLevel;
