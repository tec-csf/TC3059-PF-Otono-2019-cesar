import React from 'react'
import {
  FaTimes,
  FaExclamationTriangle,
  FaCheck } from 'react-icons/fa'
var classNames = require('classnames');

const NotificationError = (props) => (
  <div className={classNames('notification', props.show)}>
    <div className="notification-head -error">
      <FaExclamationTriangle></FaExclamationTriangle>
      <p className="notification-title">{props.title}</p>
    </div>
    <div className="notification-body">      
      <p>{props.description}</p>
      <span className="notification-highlight">{props.total}%</span>
    </div>
  </div>
)

const NotificationSucces = (props) => (
  <div className={classNames('notification', props.show)}>
    <div className="notification-head -succes">
      <FaCheck></FaCheck>
      <p className="notification-title">{props.title}</p>
      <button className="ml-auto fa-btn -white -nohover" onClick={props.setState.bind(this, { statusSuccess: '-hide' })}><FaTimes/></button>
    </div>
    <div className="notification-body">      
      <p>{props.description}</p>
    </div>
  </div>
)

export {
  NotificationError,
  NotificationSucces
} 