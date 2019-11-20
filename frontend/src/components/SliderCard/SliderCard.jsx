import React, { Component } from 'react';
import SliderComponent from '../Slider/Slider';

// const SliderCard = (props) => (
class SliderCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
      default: false
    }
  }

  _setState = (state) => {
    this.setState(state);
    switch (this.props.title) {
      case 'Twitter':
        this.props.setState({ twitter: state.percentage });
        break;
      case 'Noticias':
        this.props.setState({ news: state.percentage });
        break;
      case 'SAT':
        this.props.setState({ sat: state.percentage });
        break;
      case 'Suprema Corte':
        this.props.setState({ court: state.percentage });
        break;
      case 'Diario Oficial':
        this.props.setState({ dof: state.percentage });
        break;
      case 'ONU':
        this.props.setState({ onu: state.percentage });
        break;
      case 'OFAC':
        this.props.setState({ ofac: state.percentage });
        break;
      case 'PEP':
        this.props.setState({ pep: state.percentage });
        break;
      default:
        console.log(this.props.title)
    }
  }

  componentDidUpdate = () => {
    if (this.props.default) {
      this.setState({ percentage: this.props.percentage });
      this.props.setState({ default: false })
      this.setState({ default: true })
    }
  }

  componentWillMount = () => {
    this.setState({ percentage: this.props.percentage });
  }

  render() {
    return (
      <div className={`slider-card ${this.props.customClass}`}>
        <div className="slider-head">
          <p className="mb-0 title">{this.props.title}</p>
          <p className="ml-auto mb-0 highlight"> {this.state.percentage}%</p>
        </div>
        <div className="slider-body">
          <SliderComponent percentage={this.state.percentage} setState={this._setState} default={this.state.default} />
        </div>
      </div>
    );
  }
}


export default SliderCard