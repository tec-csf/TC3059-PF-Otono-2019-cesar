import React from 'react';
import { Progress } from 'reactstrap';

const ProgressBar = (props) => {

  var percent = props.num * 100
  percent = Math.round(percent * 100) /100

  return (
    <div>
      <Progress value={percent}/>
      <div className="title text-center mt-1r">{percent}%</div>
      <p className="text-center">De coincidencia</p>
    </div>
  )
}

export default ProgressBar