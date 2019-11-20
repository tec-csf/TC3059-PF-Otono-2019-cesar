import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import TableRow from './TableRow'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

class TableCard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      employees: [],
      organizations: [],
      redirect: false
    }
  }

  componentDidMount(){

    let user_id = jwtDecode(localStorage.getItem("id_token")).sub

    axios.post(API_URL + "/api/v1/get_all_employees", {
      user_id
    }).then((res) => {

      if (res.data !== 'empty'){
        this.setState({
          employees: res.data[0],
          organizations: res.data[1]
        })
      }
      else{
        this.setState({
          redirect:true
        })
      }
    });
  }

  render() {

    return (
      <React.Fragment>
      {this.state.redirect && <Redirect to="/user-profile"/>}
      <div className={`table-card ${this.props.customClasses}`}>
        <div className="table-head">
          <p className="title mb-0">Últimas personas físicas añadidas</p>
        </div>
        {
          this.state.employees.map(emp => {

            let fix_date = emp.date
            fix_date = fix_date.replace('GMT', '')
            fix_date = fix_date.split(',')[1]

            const complete_name = emp.name+' '+emp.lastName1+' '+emp.lastName2

            return (
              <TableRow name={complete_name} date={fix_date} info={emp} type={'fisica'}/>
            )
          })
        }        
      </div>
      <div className={`table-card ${this.props.customClasses}`}>
        <div className="table-head">
          <p className="title mb-0">Últimas personas morales añadidas</p>
        </div>
        {
          this.state.organizations.map(emp => {
            let fix_date = emp.date
            fix_date = fix_date.replace('GMT', '')
            fix_date = fix_date.split(',')[1]

            return (
              <TableRow name={emp.name} date={fix_date} info={emp} type={'moral'}/>
            )
          })
        }
      </div>
      </React.Fragment>
    );
  }
}

export default TableCard
