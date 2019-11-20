import React, {Component} from 'react'
import {
  FaUser,
  FaUsers
} from 'react-icons/fa'

class CounterCard extends Component {
  
  render() {
    return (
      <div className={`counter-card ${this.props.customClasses}`}>
        <div className="text-center icon-wrapper">
          {this.props.type === 'physical' &&
            <FaUser/>
          }
          {this.props.type === 'moral' &&
            <FaUsers/>
          }
        </div>
        <p className="count text-center">{this.props.profiles}</p>
        {this.props.type === 'physical' &&
          <p className="text-center">Perfiles de Personas Físicas</p>
        }
        {this.props.type === 'moral' &&
          <p className="text-center">Perfiles de Personas Morales</p>
        }
      </div>
    );
  }
}

export default CounterCard
