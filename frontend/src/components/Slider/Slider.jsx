import React, { useState, useEffect } from 'react';
import Slider from 'react-input-slider';

function SliderComponent(props) {
  const [state, setSonState] = useState({ x: props.percentage});

  function onChange(x) {
    setSonState(state => ({ ...state, x }))
    props.setState({percentage: x, changed: true})
  }

  useEffect( () => {
    if (props.default) {
      setSonState(state => ({ ...state, x: props.percentage }))
    }
  });

  return (
    <div>
      <Slider
        styles={{
          track: {
            backgroundColor: '#606060'
          },
          active: {
            backgroundColor: '#0070D0'
          }         
        }}
        // axis="x"
        x={state.x}
        onChange={
          ({ x }) => onChange(x)
        }     
        marks
      />
    </div>
  );
}

export default SliderComponent