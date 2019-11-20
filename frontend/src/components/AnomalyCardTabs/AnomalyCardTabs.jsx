import React, { Component } from 'react'
import {
  FaBell,
  FaExternalLinkAlt,
  FaPlusCircle
} from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { ButtonText } from '../Button/Button'
import classnames from 'classnames';
import Radar from 'react-chartjs-2';
import CmModal from '../Modal/Modal';

class AnomalyCardTabs extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      newsTabs: [],
      newsContent: [],
      showModal: false
    };
  }

  _setState = (state) => {
    this.setState(state);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  togglemodal = () => {
    this.setState({ showModal: true })
  }

  componentDidUpdate = () => {
    if (this.props.newsTabs) {
      let listTabs = [];
      let listPanel = [];
      let listContent = [];
      if (this.props.data.url.length > 0) {
        for (var i = 0; i < this.props.data.url.length; i++) {
          let currentTab = (i + 1).toString()
          listTabs.push(
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === currentTab })}
                onClick={() => { this.toggle(currentTab); }}
              >
                {this.props.data.url[i].title}
              </NavLink>
            </NavItem>
          );
          listContent = [];
          for (var j = 0; j < this.props.data.url[i].data.length; j++) {
            if (this.props.data.url[i].data[j].sentiment === "positive") {
              listContent.push(
                <div className="note mt-20">
                  <p className="date -success">{this.props.data.url[i].data[j].date}</p>
                  <p className="evaluation -success">Positivo</p>
                  <div className="info-wrapper">
                    <p className="info-text">{this.props.data.url[i].data[j].title}</p>
                    <a href={this.props.data.url[i].data[j].url} target="_blank" className="info-link fa-btn"><FaExternalLinkAlt /></a>
                  </div>
                </div>
              );
            }
            else if (this.props.data.url[i].data[j].sentiment === "negative") {
              listContent.push(
                <div className="note mt-20">
                  <p className="date -alert">{this.props.data.url[i].data[j].date}</p>
                  <p className="evaluation -alert">Negativo</p>
                  <div className="info-wrapper">
                    <p className="info-text">{this.props.data.url[i].data[j].title}</p>
                    <a href={this.props.data.url[i].data[j].url} target="_blank" className="info-link fa-btn"><FaExternalLinkAlt /></a>
                  </div>
                </div>
              );
            }
            else {
              listContent.push(
                <div className="note mt-20">
                  <p className="date">{this.props.data.url[i].data[j].date}</p>
                  <p className="evaluation">Neutro</p>
                  <div className="info-wrapper">
                    <p className="info-text">{this.props.data.url[i].data[j].title}</p>
                    <a href={this.props.data.url[i].data[j].url} target="_blank" className="info-link fa-btn"><FaExternalLinkAlt /></a>
                  </div>
                </div>
              );
            }
          }
          listPanel.push(
            <TabPane tabId={currentTab}>
              <div className="note-wrapper">
                {listContent}
              </div>
              <div className="anomaly-chart mt-20">
                <Radar
                  width={100}
                  height={50}
                  options={{ maintainAspectRatio: false }}
                  data={{
                    labels: ['Positivo', 'Negativo', 'Neutro'],
                    datasets: [
                      {
                        label: 'Sentimientos',
                        backgroundColor: ['#10d39e', '#ff3b00', 'rgba(99,99,99,0.5)'],
                        // borderColor: ['rgba(99,255,132,1)', 'rgba(255,99,132,1)', 'rgba(99,99,99,1)'],
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                        data: this.props.data.sentiments_array[i]
                      }
                    ]
                  }}
                />
              </div>
            </TabPane>
          )
        }
      }

      this.setState({ newsTabs: listTabs })
      this.setState({ newsContent: listPanel })

      this.props.setState({ newsTabs: false })
    }
  }

  render() {
    return (
      <div className={`anomaly-card -h-auto ${this.props.customClasses}`}>
        <div className={`anomaly-type ${this.props.type}`}></div>
        <div className="anomaly-head">
          <p className="subtitle">{this.props.title}</p>
          <div className="anomaly-actions">
            <CircularProgressbar
              value={this.props.data.status.toFixed(1)}
              text={`${this.props.data.status.toFixed(1)}%`}
              styles={buildStyles({
                textSize: '30',
                pathColor: `rgba(98, 87, 250)`,
                textColor: '#0070D0',
                trailColor: '#fff',
                backgroundColor: '#0070D0',
              })}
            />
          </div>
        </div>

            
        <div className="anomaly-body">
          {this.props.title === 'TWITTER' &&
          <React.Fragment>
            {/* <div className="twitter-statistics">
              <div className="twitter-data">
                <p className="data-name">Tweets</p>
                <p className="data-number mb-0">4,200</p>
              </div>

              <div className="twitter-data">
                <p className="data-name">Seguidores</p>
                <p className="data-number mb-0">4,200</p>
              </div>

              <div className="twitter-data">
                <p className="data-name">Retweets</p>
                <p className="data-number mb-0">4,200</p>
              </div>
            </div> */}
            <ButtonText 
              customClass="my-30" 
              onClick={this.togglemodal} 
              title="Añadir cuenta de twitter"
              icon="fab fa-twitter"
            />
            </React.Fragment>
          }
          <div className="anomaly-card-tabs">
            <div className="anomaly-tabs-body">
              <Nav tabs>
                {this.state.newsTabs}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                {this.state.newsContent}
              </TabContent>
            </div>
          </div>
        </div>
        <CmModal
          rfc={this.props.rfc}
          type={this.props.type}
          modalType='twitter'
          modalTitle="Añadir cuenta de Twitter"
          show={this.state.showModal}
          setState={this._setState}
        />
      </div>
    )
  }
}

export default AnomalyCardTabs
