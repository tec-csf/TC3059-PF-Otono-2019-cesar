import React, { Component } from 'react'
import { Collapse } from 'reactstrap';
import InputForm from '../InputForm/InputForm'

class Checkbox extends Component {
  constructor(props) {
    super(props);    

    this.state = { 
      collapse: false,
      entities: [[],[],[]]
    };
  }

  toggle =() => {

    this.setState({ 
      collapse: !this.state.collapse 
    }, ()=>{
      let temp_val = this.props.value
      temp_val[2] = this.state.collapse  
      this.props.setState({
        entities: {
          [this.props.index]:temp_val
        }
      })
    });
  }

  updateDate = (event) => {
    let temp_val = this.props.value
    temp_val[1] = event.target.value
    temp_val[2] = this.state.collapse
 

    this.props.setState({
      entities: {
        [this.props.index]:temp_val
      }
    })
  }

  updateNames = (event) => {
    let temp_val = this.props.value
    temp_val[0][0] = event.target.value

    this.setState({
      entities: temp_val
    })

    this.props.setState({
      entities:{
        [this.props.index]: temp_val
      }
    })
  }

  updateLastName1 = (event) => {
    let temp_val = this.props.value
    temp_val[0][1] = event.target.value

    this.setState({
      entities: temp_val
    })

    this.props.setState({
      entities:{
        [this.props.index]: temp_val
      }
    })
  }

  updateLastName2 = (event) => {
    let temp_val = this.props.value
    temp_val[0][2] = event.target.value

    this.setState({
      entities: temp_val
    })

    this.props.setState({
      entities:{
        [this.props.index]: temp_val
      }
    })
  }

  componentDidMount = () => {
    this.setState({
      entities:this.props.value
    })
  }

  render() {
    return (
      <div className="input-collapse mb-30">        
        <label  className={`check-wrapper ${this.props.customClasses}`}>
          <input onClick={ this.toggle} type="checkbox" id={`${this.props.Id}`} value={` ${this.props.Value}`}/> 
          <InputForm inputColor="-secondary" warning="Datos no válidos" type="text" onChange={this.updateNames} value={this.state.entities[0][0]}/>
          <InputForm inputColor="-secondary" customClasses="mt-30" warning="Datos no válidos" type="text" onChange={this.updateLastName1} value={this.state.entities[0][1]}/>
          <InputForm inputColor="-secondary" customClasses="mt-30" warning="Datos no válidos" type="text" onChange={this.updateLastName2} value={this.state.entities[0][2]}/>
          <span className="checkmark"></span>
          <Collapse isOpen={this.state.collapse}>
            <InputForm inputColor="-secondary" onChange={this.updateDate} customClasses="mt-30" warning="Datos no válidos" type="date"/>
          </Collapse>
        </label>
      </div>
    )
  }
}

export default Checkbox