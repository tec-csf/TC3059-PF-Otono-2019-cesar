import React, { Component } from 'react'

class InputForm extends Component {

  render() {
    return(
      <div className={`group ${this.props.customClasses}`}>
        <input className={` ${this.props.inputColor} ${this.props.warningMessage}`} pattern={this.props.pattern} style={{ borderColor: this.props.borderColor, borderWidth: 2 }} type={this.props.type} placeholder={this.props.placeholder} onChange={this.props.onChange} value={this.props.value} onBlur={this.props.onBlur} required={this.props.required} maxLength={this.props.maxLength} />
        <label htmlFor="">{this.props.label}</label>
        <span className="warning-message">{this.props.warning}</span>
      </div>
    )
  }
}

export default InputForm