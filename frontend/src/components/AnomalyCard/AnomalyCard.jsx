import React, {Component} from 'react'
import {
  FaBell,
  FaExternalLinkAlt,
  FaCheckCircle } from 'react-icons/fa';
import { CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class Anomalycard extends Component {

  createListData = () => {
    let listData = [];
    for (var i=0; i < this.props.data.url.length; i++) {
      listData.push(
        <div className="note mt-20">
          <p className="date -alert">{this.props.data.url[i].date}</p>
          {/* <p className="evaluation -success">Positivo</p> */}
          <p className="evaluation -alert">Negativo</p>
          <div className="info-wrapper">
            <p className="info-text">{this.props.data.url[i].text}</p>
            <a href={this.props.data.url[i].url} target="_blank" className="info-link fa-btn"><FaExternalLinkAlt/></a>
          </div>
        </div>
      );
    }
    return listData;
  }

  render() {
    if (this.props.data.url === undefined || this.props.data.url.length <= 0) {
      return (
        <div className={`anomaly-card ${this.props.customClasses}`}>          
          <div className={`anomaly-type ${this.props.type}`}></div>
          <div className="anomaly-head">
            <p className="subtitle">{this.props.title}</p>
          </div>

          <div className="anomaly-body -empty">
            <p className="null">Sin resultados
              <FaCheckCircle/>
            </p>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={`anomaly-card ${this.props.customClasses}`}>
          <div className={`anomaly-type ${this.props.type}`}></div>
          <div className="anomaly-head">
            <p className="subtitle">{this.props.title}</p>
            <div className="anomaly-actions">
              <CircularProgressbar
                value={this.props.data.status}
                text={`${this.props.data.status}%`}
                styles={buildStyles({
                  textSize: '30',
                  pathColor: `rgba(98, 87, 250`,
                  textColor: '#0070D0',
                  trailColor: '#fff',
                  backgroundColor: '#0070D0',
                })}
              />
            </div>
          </div>
          <div className="anomaly-body">
            {this.createListData()}
          </div>
        </div>
      );
    }
  }
}

export default Anomalycard
