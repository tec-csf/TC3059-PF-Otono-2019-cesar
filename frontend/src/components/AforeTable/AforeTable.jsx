import React, { Component } from 'react'
import { Table } from 'reactstrap';
import InputForm from '../InputForm/InputForm'
import {
  FaTrash,
  FaAngleDown,
} from 'react-icons/fa'

class AforeTable extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return(
      <React.Fragment>      
        <Table>
          <thead>
            <tr>
              <th>
                <p>Nombre</p>
                <InputForm inputColor="-secondary" warning="Datos no válidos" type="text" placeholder={'Buscar'}/>          
              </th>
              <th> 
                <p>Afore origen</p>
                <div className="dropdown-wrapper">
                  <select className="dropdown-user w-100">
                  <option value="0">cualquiera</option>
                    <option value="1">Afore 1</option>
                    <option value="2">Afore 2</option>
                    <option value="3">Afore 3</option>
                    <option value="4">Afore 4</option>
                    <option value="5">Afore 5</option>
                  </select>
                  <button className="fa-btn dropdown-icon">
                    <FaAngleDown/>
                  </button>
                </div>
              </th>
              <th> 
                <p>Afore destino</p>
                <div className="dropdown-wrapper">
                  <select className="dropdown-user w-100">
                  <option value="0">cualquiera</option>
                    <option value="1">Afore 1</option>
                    <option value="2">Afore 2</option>
                    <option value="3">Afore 3</option>
                    <option value="4">Afore 4</option>
                    <option value="5">Afore 5</option>
                  </select>
                  <button className="fa-btn dropdown-icon">
                    <FaAngleDown/>
                  </button>
                </div>
              </th>                
            </tr>
          </thead>

          <tbody>
            <tr>
              <th scope="row">
                <a href="">Antonio madera</a>
              </th>                
              <td>Afore 1</td>
              <td>Afore 2</td>
              <td><button className="fa-btn -warning"><FaTrash/></button></td>
            </tr>

            <tr>
              <th scope="row">
                <a href="">Pablo Macías</a>
              </th>                
              <td>Afore 3</td>
              <td>Afore 1</td>
              <td><button className="fa-btn -warning"><FaTrash/></button></td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    )
  }
}

export default AforeTable