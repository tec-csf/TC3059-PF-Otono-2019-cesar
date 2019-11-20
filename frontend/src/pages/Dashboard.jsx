import React, { Component } from 'react'
import Navbarmenu from '../components/Navbarmenu/Navbarmenu'
import Sidenav from '../components/Sidenav/Sidenav'
import DocumentCard from '../components/DocumentCard/DocumentCard';
import DropdownSelect from '../components/DropdownSelect/DropdownSelect'
import axios from 'axios'
import CoincidenceLevel from '../components/CoincidenceLevel/CoincidenceLevel';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ButtonPrimary } from '../components/Button/Button'
import jwtDecode from 'jwt-decode'
import { Redirect } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

const API_URL = process.env.REACT_APP_API_URL

const dropdown_user_items = [
  {
    value: "fisica",
    text: "Persona física"
  },
  {
    value: "moral",
    text: "Persona moral"
  }
]

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.toggleModalErrorDocument = this.toggleModalErrorDocument.bind(this)
    this.state = {
      docUp1: false,
      docUp2: false,
      active: 0,
      replace: false,
      per_type: 'fisica',
      redirect: false,
      continue: "disabled",
      comp: true,
      counter: 0,
      change_per_type: true,
      comp_name: true, // Compare names
      name_color: '',
      comp_surname1: true, // Compare first surname
      surname1_color: '',
      comp_surname2: true, // Compare second surname
      surname2_color: '',
      comp_birth: true,   // Compare birthdate 
      birth_color: '',
      // Compare address
      comp_city: true, // Compare city
      city_color: '',
      comp_colony: true,  // Compare colony
      colony_color: '',
      comp_state: true,   // Compare state
      state_color: '',
      comp_street: true,  // Compare street
      street_color: '',
      comp_gender: true, // Compare gender
      gender_color: '',
      comp_curp: true,  // Compare curp
      curp_color: '',
      img_1: '',
      img_2: '',
      curp_1: '',
      curp_2: '',
      //  Divided Address
      city_1: '',
      city_2: '',
      colony_1: '',
      colony_2: '',
      state_1: '',
      state_2: '',
      street_1: '',
      street_2: '',
      gender_1: '',
      gender_2: '',
      name_1: '',
      first_surname_1: '',
      second_surname_1: '',
      name_2: '',
      first_surname_2: '',
      second_surname_2: '',
      clave_1: '',
      clave_2: '',
      confidence: 0,
      up_1: '',
      up_2: '',
      modal: false,
      modal_del: false,
      modal_up: false,
      modal_per_type: false,
      modal_pos: false,
      birthdate_1: '',
      birthdate_2: '',
      last_up: false,
      reset_input: false,
      last_moral_up: '',
      moral: {
        address: {
          city: '',
          colony: '',
          state: '',
          street: '',
          zip: '',
        },
        activities: '',
        business_name: '',
        cap_reg: '',
        last_update: {
          0: '',
          1: '',
          2: ''
        },
        first_op: {
          0: '',
          1: '',
          2: ''
        },
        rfc: '',
        status: '',
        tradename: ''
      },
      entities: []
    }
  }

  checkContinue = (user) => {
    if (user['name'] !== '' &&
      user['first_surname'] !== '' &&
      user['second_surname'] !== '' &&
      user['birthdate'] !== '' &&
      user['birthdate'] !== '--' &&
      user['curp'] !== '') 
    {
      this.setState({continue: ''})
    }
    else {
      this.setState({continue: 'disable'})
    }
  }

  _setState = (state) => {
    this.setState(state);
  }

  toggleModalErrorDocument() {
    this.setState({
      modal: !this.state.modal
    })
  }

  toggleModalDeleteDocument() {
    this.setState({
      modal_del: !this.state.modal_del
    })
  }

  toggleModalUpDateDocument() {
    this.setState({
      modal_up: !this.state.modal_up
    })
  }

  toggleModalErrorPosDoc(){
    this.setState({
      modal_pos: !this.state.modal_pos
    })
  }

  sendScraper = () => {

    let data

    if (this.state.per_type === 'fisica') {
      data = {
        name: this.state.name_1,
        lastName1: this.state.first_surname_1,
        lastName2: this.state.second_surname_1,
        type: "fisica",
        curp: this.state.curp_1,
        country: "Mexico",
        birthdate: this.state.birthdate_1,
        user_id: jwtDecode(localStorage.getItem("id_token")).sub,
        twitter: []
      }
    } else {
      data = {
        user_id: jwtDecode(localStorage.getItem("id_token")).sub,
        name: this.state.moral.business_name,
        type: 'moral',
        rfc: this.state.moral.rfc,
        country: 'Mexico',
        address: this.state.moral.address,
        addressStreet: this.state.moral.address.street,
        addressColony: this.state.moral.address.colony,
        addressMunicipality: '',
        addressDelegation: '',
        addressCity: this.state.moral.address.city,
        addressState: this.state.moral.address.state,
        addressEntity: '',
        addressCountry: 'Mexico',
        addressCP: this.state.moral.address.zip,
        addressPhone: '',
        addressEmail: '',
        exteriorNum: '',
        interiorNum: '',
        commercialTurn: this.state.moral.cap_reg,
        constitutionDate: this.state.moral.first_op,
        legalEmail: '',
        entities: this.state.entities
      }
    }

    axios.post(API_URL + "/api/v1/create/upload", {
      data
    }).then((res) => {
      this.props.Scrapper(data)

      this.setState({ redirect: true })
    });


  }

  compareImages() {
    if (localStorage.getItem("id_token")) {

      const options = {
        heders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          'name_img1': this.state.img_1,
          'name_img2': this.state.img_2
        }
      }

      axios.post(API_URL + "/api/v1/compare_faces/search", {
        data: options
      }).then((res) => {
        this.setState({
          confidence: res['data']['confidence']
        })
      });
    }
  }

  compareCurps() {

    let rfc_1 = this.state.curp_1
    let rfc_2 = this.state.curp_2

    if (this.state.curp_1 === "" || this.state.curp_2 === "") {
      return false
    }
    else if (this.state.curp_1 === this.state.curp_2) {
      return true
    }
    else if (rfc_1 === rfc_2) {
      return true
    } else {
      return false
    }
  }

  compareNames() {

    let full_name_1 = this.state.name_1.toUpperCase()
    let full_name_2 = this.state.name_2.toUpperCase()

    if (full_name_1 === "" || full_name_2 === "") {
      return false
    }
    else {
      return full_name_1 === full_name_2
    }
  }

  compareBirths() {
    if (this.state.birthdate_1 === "" || this.state.birthdate_2 === "") {
      return false
    }
    else {
      return this.state.birthdate_1 === this.state.birthdate_2
    }
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated()) {
      this.props.auth.login()
    }
  }

  componentDidUpdate() {

    if (this.state.comp_name) {
      let color = ''
      if (this.state.name_2 === '') { color = '' }
      else if (this.compareNames()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        name_color: color,
        comp_name: false
      })
    }
    if (this.state.comp_surname1) {
      let color = ''
      if (this.state.first_surname_2 === '') { color = '' }
      else if (this.state.first_surname_1.toUpperCase() === this.state.first_surname_2.toUpperCase()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        surname1_color: color,
        comp_surname1: false
      })
    }
    if (this.state.comp_surname2) {
      let color = ''
      if (this.state.second_surname_2 === '') { color = '' }
      else if (this.state.second_surname_1.toUpperCase() === this.state.second_surname_2.toUpperCase()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        surname2_color: color,
        comp_surname2: false
      })
    }
    if (this.state.comp_birth) {
      let color = ''
      if (this.state.birthdate_2 === '') { color = '' }
      else if (this.compareBirths()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        birth_color: color,
        comp_birth: false
      })
    }
    if (this.state.comp_city) {
      let color = ''
      if (this.state.city_2 === '') { color = '' }
      else if (this.state.city_1.toUpperCase() === this.state.city_2.toUpperCase()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        city_color: color,
        comp_city: false
      })
    }
    if (this.state.comp_colony) {
      let color = ''
      if (this.state.colony_2 === '') { color = '' }
      else if (this.state.colony_1.toUpperCase() === this.state.colony_2.toUpperCase()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        colony_color: color,
        comp_colony: false
      })
    }
    if (this.state.comp_state) {
      let color = ''
      if (this.state.state_2 === '') { color = '' }
      else if (this.state.state_1.toUpperCase() === this.state.state_2.toUpperCase()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        state_color: color,
        comp_state: false
      })
    }
    if (this.state.comp_street) {
      let color = ''
      if (this.state.street_2 === '') { color = '' }
      else if (this.state.street_1.toUpperCase() === this.state.street_2.toUpperCase()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        street_color: color,
        comp_street: false
      })
    }
    if (this.state.comp_gender) {
      let color = ''
      if (this.state.gender_2 === '') { color = '' }
      else if (this.state.gender_1 === this.state.gender_2) { color = 'green' }
      else { color = 'red' }
      this.setState({
        gender_color: color,
        comp_gender: false
      })
    }
    if (this.state.comp_curp) {
      let color = ''
      if (this.state.curp_2 === '') { color = '' }
      else if (this.compareCurps()) { color = 'green' }
      else { color = 'red' }
      this.setState({
        curp_color: color,
        comp_curp: false
      })
    }
  }

  componentWillUpdate() {
    if (this.state.per_type === 'fisica' && this.state.comp) {
      if (
        this.state.curp_1 !== '' &&
        this.state.name_1 !== '' &&
        this.state.first_surname_1 !== '' &&
        this.state.second_surname_1 !== '' &&
        this.state.birthdate_1 !== '' &&
        this.state.birthdate_1 !== '--'
      ) {
        if (this.state.name_color === 'red' ||
          this.state.surname1_color === 'red' ||
          this.state.surname2_color === 'red' ||
          this.state.birth_color === 'red' ||
          this.state.colony_color === 'red' ||
          this.state.city_color === 'red' ||
          this.state.state_color === 'red' ||
          this.state.street_color === 'red' ||
          this.state.gender_color === 'red' ||
          this.state.curp_color === 'red') {
          this.setState({
            continue: "disabled",
            comp: false,
            change_per_type: true
          })
        }
        else {
          this.setState({
            continue: "",
            comp: false,
            change_per_type: false
          })
        }
      } else {
        this.setState({
          continue: "disabled",
          comp: false,
          change_per_type: true
        })
      }
    }
  }

  onChange=(event)=>{

    this.setState({
      per_type: event
    })
  }

  replace = () => {

    let up_1 = this.state.up_1
    let up_2 = this.state.up_2

    if (this.state.active == 0) {
      up_1 = ''
    }
    else {
      up_2 = ''
    }

    this.setState({
      replace: true,
      modal_up: !this.state.modal_up,
      up_1,
      up_2
    })
  }

  render() {
    if (this.state.redirect) {
      return (
        <div>
          <Redirect to="/welcome" {...this.props} />
        </div>
      );
    }
    else {

      return (
        <div>
          <div>
            <Modal centered={true} isOpen={this.state.modal_pos} toggle={() => this.toggleModalErrorPosDoc()} className={this.props.className}>
              <ModalHeader toggle={() => this.toggleModalErrorPosDoc()}>Posición del arhivo incorrecta</ModalHeader>
              <ModalBody>
                Es posible que la <b>posición</b> de tu archivo no sea la correcta, favor de verificar.
              </ModalBody>
              <ModalFooter>
                <ButtonPrimary onClick={() => this.toggleModalErrorPosDoc()} title="Continuar"></ButtonPrimary>
              </ModalFooter>
            </Modal>
          </div>
          <div>
            <Modal centered={true} isOpen={this.state.modal} toggle={() => this.toggleModalErrorDocument()} className={this.props.className}>              
            <ModalHeader toggle={() => this.toggleModalErrorDocument()}>Archivo incorrecto</ModalHeader>
              <ModalBody>
                Solo puedes cargar: <b>IFE, INE o Pasaporte</b>, tu archivo debe de ser de dimenciones mayores a 120px x 120px y menores de 1200px x 1200px
              </ModalBody>
              <ModalFooter>
                <ButtonPrimary onClick={() => this.toggleModalErrorDocument()} title="Continuar"></ButtonPrimary>
              </ModalFooter>
            </Modal>
          </div>
          <div>
            <Modal centered={true} isOpen={this.state.modal_del} toggle={() => this.toggleModalDeleteDocument()} className={this.props.className}>
              <ModalHeader toggle={() => this.toggleModalDeleteDocument()}>Archivo incorrecto</ModalHeader>
              <ModalBody>
                Es necesario subir un tipo de documento <b>diferente</b> al anterior
              </ModalBody>
              <ModalFooter>
                <ButtonPrimary onClick={() => this.toggleModalDeleteDocument()} title="Continuar"></ButtonPrimary>
              </ModalFooter>
            </Modal>
          </div>
          <div>
            <Modal centered={true} isOpen={this.state.modal_up} toggle={() => this.toggleModalUpDateDocument()} className={this.props.className}>
              <ModalHeader toggle={() => this.toggleModalUpDateDocument()}>Archivo incorrecto</ModalHeader>
              <ModalBody>
                Ya hay un documento registrado, ¿Desea reemplazarlo?
              </ModalBody>
              <ModalFooter>
                <ButtonPrimary onClick={() => this.toggleModalUpDateDocument()} title="Cancelar"></ButtonPrimary>
                <ButtonPrimary onClick={() => this.replace()} title="Reemplazar"></ButtonPrimary>
              </ModalFooter>
            </Modal>
          </div>

          <Navbarmenu {...this.props}></Navbarmenu>
          <div className="container-fluid p-0">
            <Sidenav />
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h4 className="title my-30">Evaluación cognitiva (Persona {this.state.per_type}) a través de OCR</h4>
                </div>  
                <div className="col-6">
                  <DropdownSelect customClass="mb-30" styleSelect="mb-30 d-flex w-100" onChange={this.onChange} items={dropdown_user_items} selected="Persona física"/>
                </div>
              </div>

              <div className="row">
                {this.state.per_type === 'fisica' &&
                  <div className="col-12">
                    <div className="cm-card -dark mb-30">
                      <p className="mb-0">Para comenzar, sube un archivo válido (INE, IFE o pasaporte) debe de estar en uno de los siguiente formatos (.JPG, .JPEG, .PNG y .PDF)</p>
                    </div>
                  </div>
                }
                {this.state.per_type === 'moral' &&
                  <div className="col-12">
                    <div className="cm-card -dark mb-30">
                      <p className="mb-0">Deberás subir el RFC y el acta constitutiva de la empres para comenzar el análisis cognitivo </p>
                    </div>
                  </div>
                }
              </div>
              <div className="row">
                <div className="col-12 col-lg-6 mb-30">
                  <DocumentCard customClasses="-light" setState={this._setState} params={this.state} id={0} checkContinue={this.checkContinue}/>
                </div>
                <div className="col-12 col-lg-6">
                  <DocumentCard customClasses="-light" setState={this._setState} params={this.state} id={1} />
                </div>

              </div>
              <React.Fragment>
                <div className="row">
                  <div className="col-12">
                    <button className="button -primary mb-30" disabled={this.state.continue} onClick={this.sendScraper}>SIGUIENTE</button>
                  </div>
                </div>
              </React.Fragment>
            </div>
          </div>

          <div className="container-fluid px-0">
            <div className="row mx-0">
              <div className="col-12 px-0">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Dashboard
