import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {
  FaExternalLinkAlt
} from 'react-icons/fa'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { Progress } from 'reactstrap';

const API_URL = process.env.REACT_APP_API_URL

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      perc: 0,
      store: 0,
      redirect:false
    }
  }
  

  componentDidMount(){
    
    let user_id = jwtDecode(localStorage.getItem("id_token")).sub
    let rfc = this.props.info.rfc
    let type = this.props.type

    const data = {
      user_id,
      rfc,
      type
    }

    axios({
      method:'POST',
      url: API_URL + '/api/v1/get_employee/search',
      data,
      config: {headers: {'Content-Type': 'application/json'}}
    }).then((res) => {
      this.setState({
        perc: res.data.percentage,
        score: res.data.score
      }, ()=>{
        if(res.data.percentage >= 100){
          clearInterval(this.myVar)
        }
      })
    });

    this.myVar = setInterval(()=>{
      axios({
        method:'POST',
        url: API_URL + '/api/v1/get_employee/search',
        data,
        config: {headers: {'Content-Type': 'application/json'}}
      }).then((res) => {
        this.setState({
          perc: res.data.percentage,
          score: res.data.score
        }, ()=>{
          if(res.data.percentage >= 100){
            clearInterval(this.myVar)
          }
        })
      });
    },2000);    
  }

  componentWillUnmount() {
    if (this.myVar) {
      clearInterval(this.myVar)
    }
  }

  render() {

    return (
      <div className="table-row">
        <div className="table-col">
          <p>{this.props.name}</p>
        </div>
        <div className="table-col">
          <p>{this.props.date}</p>
        </div>
        <div className="table-col">
          <p><b>{this.state.score}%</b></p>
        </div>
        <div className="table-col">
          {this.state.perc >= 100 &&

            <Link to={{
              pathname:`anomaly-detection/${this.props.info.rfc}/${this.props.type}`
            }}>
              <div className="icon-wrapper">
                <FaExternalLinkAlt/>
              </div>
            </Link>
          }
          {this.state.perc < 100 &&
          <React.Fragment>
            <p align="center"><b>{this.state.perc} %</b></p>
            <Progress value={this.state.perc}/>            
          </React.Fragment>
          }
        </div>
      </div>
    );  
  }
}

export default TableRow
