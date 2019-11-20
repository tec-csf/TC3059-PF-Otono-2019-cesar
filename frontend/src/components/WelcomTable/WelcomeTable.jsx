import React, {
  Component
} from 'react'
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom'
import InputForm from '../InputForm/InputForm'
import {
  FaTrash,
  FaAngleDown
} from 'react-icons/fa'
import Paginator from '../Paginator/Paginator';
import { TabContent, TabPane, Nav, NavItem, NavLink, Progress } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ButtonPrimary } from '../Button/Button'
import { FaExternalLinkAlt } from 'react-icons/fa'
import classnames from 'classnames'; import axios from 'axios'
import jwtDecode from 'jwt-decode'
import DropdownSelect from '../DropdownSelect/DropdownSelect'

const API_URL = process.env.REACT_APP_API_URL

const dropdown_percentages_items = [
  {
    value: "0",
    text: "Todos"
  },
  {
    value: "1",
    text: "0% - 20%"
  },
  {
    value: "2",
    text: "20% - 40%"
  },
  {
    value: "3",
    text: "40% - 60%"
  },
  {
    value: "4",
    text: "60% - 80%"
  },
  {
    value: "5",
    text: "80% - 100%"
  }
]

class WelcomeTable extends Component{
  constructor(props){
    super(props);

    this.state = {
      activeTab: '1',
      pagesEmployees: 0,
      pagesOrganizations: 0,
      currentPage: 1,
      all_employees: [[]],
      employees: [[]],
      organizations: [[]],
      modal: false,
      rfc_to_delete: '',
      from_date: '',
      to_date: '',
      filtered_date: true,
      percentage_filter: 0,
      filter_name: false,
      name_search: ""
    }
  }

  componentDidMount = () => {
    this.search_all(0);
  }

  componentWillUnmount = () => {
    if (this.myVar) {
      clearInterval(this.myVar)
    }
  }

  componentDidUpdate = () => {
    if (!this.state.filtered_date && this.state.from_date !== '' && this.state.to_date !== '') {
      
      this.setState( { filtered_date: true } )
      
      this.search_all(this.state.percentage_filter);
    }
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
  }

  _setState = (state) => {
    this.setState(state);
  }

  search_all = (percentageFilter) => {    
    let user_id = jwtDecode(localStorage.getItem("id_token")).sub
    let updateInfo = []
    let paginatedEmployees = []
    let employees = []
    let paginatedOrganizations = []
    let organizations = []

    axios.post(API_URL + "/api/v1/get_all_employees", {
      user_id,
      filter_percentages: percentageFilter,
      from_date: this.state.from_date,
      to_date: this.state.to_date
    }).then((res) => {
      for (var i = 0; i < res.data[0].length; i++) {
        if (i % 5 === 0) {
          if (i > 0) {
            paginatedEmployees.push(employees)
          }
          employees = []
        }
        employees.push(res.data[0][i])
      }

      if (employees.length > 0) {
        paginatedEmployees.push(employees)
      }

      for (var i = 0; i < res.data[1].length; i++) {
        if (i % 5 === 0) {
          if (i > 0) {
            paginatedOrganizations.push(organizations)
          }
          organizations = []
        }
        organizations.push(res.data[1][i])
      }

      if (organizations.length > 0) {
        paginatedOrganizations.push(organizations)
      }

      if (res.data !== 'empty') {
        this.setState({
          employees: paginatedEmployees,
          all_employees: paginatedEmployees,
          organizations: paginatedOrganizations,
          pagesEmployees: paginatedEmployees.length,
          pagesOrganizations: paginatedOrganizations.length,
          currentPage: 1
        }, () => {
          if (this.state.employees.length > 0) {
            this.state.employees[0].forEach(function (element) {
              if (element.percentage < 100) {
                updateInfo.push('true')
              } else {
                updateInfo.push('false')
              }
            })
          }
          if (this.state.organizations.length > 0) {
            this.state.organizations[0].forEach(function (element) {
              if (element.percentage < 100) {
                updateInfo.push('true')
              } else {
                updateInfo.push('false')
              }
            })
          }
          if (updateInfo.indexOf('true') === -1) {
            clearInterval(myVar)
          }
          console.log(this.state.filter_name);
          if (this.state.filter_name) {
            this.searchFilter()
          }
        })
      }
    });

    var myVar = setInterval(async () => {
      updateInfo = []
      paginatedEmployees = []
      employees = []
      paginatedOrganizations = []
      organizations = []

      axios.post(API_URL + "/api/v1/get_all_employees", {
        user_id,
        filter_percentages: percentageFilter,
        from_date: this.state.from_date,
        to_date: this.state.to_date
      }).then((res) => {
        for (var i = 0; i < res.data[0].length; i++) {
          if (i % 5 === 0) {
            if (i > 0) {
              paginatedEmployees.push(employees)
            }
            employees = []
          }
          employees.push(res.data[0][i])
        }

        if (employees.length > 0) {
          paginatedEmployees.push(employees)
        }

        for (var i = 0; i < res.data[1].length; i++) {
          if (i % 5 === 0) {
            if (i > 0) {
              paginatedOrganizations.push(organizations)
            }
            organizations = []
          }
          organizations.push(res.data[1][i])
        }

        if (organizations.length > 0) {
          paginatedOrganizations.push(organizations)
        }

        if (res.data !== 'empty') {
          this.setState({
            employees: paginatedEmployees,
            all_employees: paginatedEmployees,
            organizations: paginatedOrganizations,
            pagesEmployees: paginatedEmployees.length,
            pagesOrganizations: paginatedOrganizations.length
          }, () => {
            if (this.state.employees.length > 0) {
              this.state.employees[0].forEach(function (element) {
                if (element.percentage < 100) {
                  updateInfo.push('true')
                } else {
                  updateInfo.push('false')
                }
              })
            }
            if (this.state.organizations.length > 0) {
              this.state.organizations[0].forEach(function (element) {
                if (element.percentage < 100) {
                  updateInfo.push('true')
                } else {
                  updateInfo.push('false')
                }
              })
            }
            if (updateInfo.indexOf('true') === -1) {
              clearInterval(myVar)
            }
            console.log(this.state.filter_name);
            if (this.state.filter_name) {
              this.searchFilter()
            }
          })
        }
      })
    }, 5000)
  }

  handlePercentage = (event) => {
    this.setState({ percentage_filter: event });
    this.search_all(parseInt(event));
  }

  handleFromDate = (event) => {
    this.setState({
      from_date: event.target.value,
      filtered_date: false
    });
  }

  handleToDate = (event) => {
    this.setState({
      to_date: event.target.value,
      filtered_date: false
    });
  }

  deletePerson=()=>{
    let user_id = jwtDecode(localStorage.getItem("id_token")).sub
    let rfc = this.state.rfc_to_delete

    axios.post(API_URL + '/api/v1/search/delete', {
      rfc,
      user_id
    }).then((res) => {
      window.location.reload()
    })
  }

  toggleModalDeleteEmp=(rfc)=> {
    this.setState({
      modal: !this.state.modal,
      rfc_to_delete: rfc
    })
  }

  handleSearch = (ev) => {
    if (ev.target.value.length > 0) {
      this.setState({
        filter_name: true
      })
    }
    else {
      this.setState({
        filter_name: false
      })
    }

    var search_value = ev.target.value.toUpperCase();

    this.setState({
      name_search: search_value
    }, () => {
      this.searchFilter()
    });
  }

  searchFilter = () => {
    var search_value = this.state.name_search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    var filtered_employees = []

    for (var i=0; i<this.state.all_employees.length; i++) {
      for (var j = 0; j < this.state.all_employees[i].length; j++) {
        if (this.state.all_employees[i][j].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(search_value) || 
            this.state.all_employees[i][j].lastName1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(search_value) || 
            this.state.all_employees[i][j].lastName2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(search_value)) {
          filtered_employees.push(this.state.all_employees[i][j]);
        }
      }
    }

    var paginatedEmployees = []
    var employees = []

    for (var i = 0; i < filtered_employees.length; i++) {
      if (i % 5 === 0) {
        if (i > 0) {
          paginatedEmployees.push(employees)
        }
        employees = []
      }
      employees.push(filtered_employees[i])
    }

    if (employees.length > 0) {
      paginatedEmployees.push(employees)
    }
    
    let updateInfo = []

    this.setState({
      employees: paginatedEmployees,
      pagesEmployees: paginatedEmployees.length,
      currentPage: 1
    }, () => {
      if (this.state.employees.length > 0) {
        this.state.employees[0].forEach(function (element) {
          if (element.percentage < 100) {
            updateInfo.push('true')
          } else {
            updateInfo.push('false')
          }
        })
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal centered={true} isOpen={this.state.modal} toggle={() => this.toggleModalDeleteEmp()} className={this.props.className}>
            <ModalHeader toggle={() => this.toggleModalDeleteEmp()}>Eliminar Persona Física</ModalHeader>
            <ModalBody>
              ¿Está seguro de <b>Eliminar</b> a esta persona? no podrá recuperar la información después.
              </ModalBody>
            <ModalFooter>
              <ButtonPrimary onClick={() => this.toggleModalDeleteEmp()} title="Cancelar"></ButtonPrimary>
              <ButtonPrimary onClick={() => this.deletePerson()} title="Eliminar"></ButtonPrimary>
            </ModalFooter>
          </Modal>
        </div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Personas físicas
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Personas morales
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="1">
          <div className="cm-card -white -no-cursor">
            <Table>
              <thead>
                <tr>
                  <th>
                    <p>Nombre</p>
                    <InputForm inputColor="-secondary" warning="No se encntraron resultados" type="text" placeholder={'Buscar'} onChange={this.handleSearch}/>          
                  </th>
                  <th> 
                    <p>Fecha de alta</p>
                    <div className="row">
                      <InputForm customClasses="col-6" inputColor="-secondary" warning="Datos no válidos" type="date" placeholder={'de'} onChange={this.handleFromDate} />
                      <InputForm customClasses="col-6" inputColor="-secondary" warning="Datos no válidos" type="date" placeholder={'a'} onChange={this.handleToDate} />
                    </div>
                  </th>
                  <th> 
                    <p>Porcentaje de confiabilidad</p>
                    <DropdownSelect onChange={this.handlePercentage} items={dropdown_percentages_items} selected="Todos" />
                  </th>                
                </tr>
              </thead>
              <tbody>
                { this.state.employees.length > 0 &&
                  this.state.employees[this.state.currentPage - 1].map(emp => {
                  let fix_date = emp.date
                  fix_date = fix_date.replace('GMT', '')
                  fix_date = fix_date.split(',')[1]
                  const complete_name = emp.name+' '+emp.lastName1+' '+emp.lastName2

                  return (
                    <tr>
                      <th scope="row">
                        <a href={`anomaly-detection/${emp.rfc}/fisica`}>{complete_name}</a>
                      </th>                
                      <td>{fix_date}</td>
                      <td>{emp.score}%</td>
                      {emp.percentage >= 100 &&
                      <td>
                        <Link to={{
                          pathname:`anomaly-detection/${emp.rfc}/fisica`
                        }}>
                          <div className="icon-wrapper">
                            <FaExternalLinkAlt/>
                          </div>
                        </Link> 
                        </td>
                      }
                      {emp.percentage < 100 &&
                      <td>
                        <p align="center"><b>{emp.percentage} %</b></p>
                        <Progress value={emp.percentage}/>            
                      </td>
                      }
                      <td><button onClick={this.toggleModalDeleteEmp.bind(this, emp.rfc)} className="fa-btn -warning"><FaTrash/></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <Paginator pages={this.state.pagesEmployees} setState={this._setState} currentPage={this.state.currentPage}/>
          </div>        
        </TabPane>
        <TabPane tabId="2">
          <div className="cm-card -white -no-cursor">
            <Table>
              <thead>
                <tr>
                  <th>
                    <p>Nombre</p>
                    <InputForm inputColor="-secondary" warning="Datos no válidos" type="text" placeholder={'Buscar'}/>          
                  </th>
                  <th> 
                    <p>Fecha de alta</p>
                    <InputForm inputColor="-secondary" warning="Datos no válidos" type="date" placeholder={'Buscar'} onChange={this.handleDate}/>
                  </th>
                  <th> 
                    <p>Porcentaje de confiabilidad</p>
                    <div className="dropdown-wrapper">
                      <select className="dropdown-user w-100">
                      <option value="0">cualquiera</option>
                        <option value="1">0 - 20%</option>
                        <option value="2">20% - 40%</option>
                        <option value="3">40% - 60%</option>
                        <option value="4">60% - 80%</option>
                        <option value="5">80% - 100%</option>
                      </select>
                      <button className="fa-btn dropdown-icon">
                        <FaAngleDown/>
                      </button>
                    </div>
                  </th>                
                </tr>
              </thead>
              <tbody>
                { this.state.organizations.length > 0 &&
                  this.state.organizations[this.state.currentPage - 1].map(emp => {
                  let fix_date = emp.date
                  fix_date = fix_date.replace('GMT', '')
                  fix_date = fix_date.split(',')[1]
                  const complete_name = emp.name

                  return (
                    <tr>
                      <th scope="row">
                        <a href={`anomaly-detection/${emp.rfc}/moral`}>{complete_name}</a>
                      </th>
                      <td>{fix_date}</td>
                      <td>{emp.score}%</td>
                      {emp.percentage >= 100 &&
                        <td>
                          <Link to={{
                            pathname: `anomaly-detection/${emp.rfc}/moral`
                          }}>
                            <div className="icon-wrapper">
                              <FaExternalLinkAlt />
                            </div>
                          </Link>
                        </td>
                      }
                      {emp.percentage < 100 &&
                        <td>
                          <p align="center"><b>{emp.percentage} %</b></p>
                          <Progress value={emp.percentage} />
                        </td>
                      }
                      <td><button className="fa-btn -warning"><FaTrash /></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <Paginator pages={this.state.pagesEmployees} setState={this._setState} currentPage={this.state.currentPage}/>
          </div> 
        </TabPane>

      </TabContent>

    </React.Fragment>
  )}
  
}

export default WelcomeTable