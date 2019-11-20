import React, {Component} from 'react'

class Step extends Component {
  render() {
    return (
      <div className="col-12 col-lg-6">
        <div className="steps my-30">
          <img className="stepsimage" src={this.props.image} alt=""></img>
          <div className="stepsinner">
            <p className="subtitle">{this.props.title}</p>
            <p>{this.props.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Step
