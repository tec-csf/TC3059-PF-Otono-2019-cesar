import React, { Component } from 'react'

class ServicesCard extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <React.Fragment>
        <div className={"services-card " + this.props.customClass}>
          <i class={"" + this.props.icon}></i>
          <p className="text-center">{this.props.title}</p>
          <p className="plan"> {this.props.plan} </p>
        </div>
      </React.Fragment>
    )
  }
}

export default ServicesCard