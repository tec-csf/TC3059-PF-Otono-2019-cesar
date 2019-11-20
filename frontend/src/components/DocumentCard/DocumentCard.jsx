import React, { Component } from 'react'
import {
  FaCheckCircle,
  FaTrash,
  FaCommentsDollar
} from 'react-icons/fa'
import axios from 'axios'
import { Spinner, Modal } from 'reactstrap';
import Checkbox from './../Checkbox/Checkbox';
import InputForm from '../InputForm/InputForm';
import { ButtonOutline } from '../Button/Button'

const API_URL = process.env.REACT_APP_API_URL

const moralCopy = {
  addrres: '',
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
  tradename: '',
  entities: []
}
const checkedCopy = [false, false, false, false, false]

const options = [
  { value: 'H', label: 'H' },
  { value: 'M', label: 'M' },
]

class DocumentCard extends Component {

  constructor(props) {
    super(props)

    this.checkCard = this.checkCard.bind(this)

    this.inputRef = React.createRef();

    this.state = {
      image_event: '',
      checkEntities: true,
      image: '',
      image_open: false,
      spinner: 'd-none',
      doc_type: '',
      disabled: true,
      num_activ: '',
      doc_up: false,
      comp_id: 0,
      type_file: '',
      checked: [false, false, false, false, false],
      documentsList: [{
        image: '-ife',
        documentType: 'INE',
      }, {
        image: '-license',
        documentType: 'Licencia',
      }, {
        image: '-passport',
        documentType: 'Pasaporte'
      }, {
        image: '-acta',
        documentType: 'Acta',
      }, {
        image: '-rfc',
        documentType: 'RFC'
      }, {
        image: '-video',
        documentType: 'video'
      }],
      file: '',
      pdf: false,
      info: false,
      // Data for physical person
      user: {
        name: '',
        first_surname: '',
        second_surname: '',
        city: '',
        colony: '',
        state: '',
        street: '',
        gender: '',
        clave: '',
        curp: '',
        birthdate: ''
      },
      // Data for moral person
      moral: {
        addrres: {
          city: '',
          colony: '',
          state: '',
          street: '',
          zip: ''
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

  _setState = (state) => {
    this.setState(state);
  }

  componentDidMount() {
    this.setState({ comp_id: this.props.id })
  }

  componentDidUpdate() {
    if (this.props.params.replace && this.props.params.active === this.state.comp_id) {
      this.props.setState({ 
        replace: false,
        comp_name: true,
        comp_surname1: true,
        comp_surname2: true,
        comp_birth: true,
        comp_city: true,
        comp_colony: true,
        comp_state: true,
        comp_street: true,
        comp_gender: true,
        comp_clave: true,
        comp_curp: true, 
      })

      this.setState({
        doc_up: false,
        checked: checkedCopy,
        image: ''
      }, () => {
        this.loadFileToBase64(this.state.image_event)

      })
    }
  }

  // Obtener archivo de identificación
  loadFileToBase64 = (event) => {

    let file
    try {
      file = event.target.files[0];
    } catch {
      file = event
    }
    let pdf = file.type === 'application/pdf'

    this.setState({ image_event: file })


    if (file.size < 14400 && !pdf) {
      // alert('Por favor suba una imagen con dimensiones mayores a 120 x 120')
      this.props.setState({
        modal: !this.props.params.modal,
        active: this.state.comp_id
      })
    }
    else if (this.state.doc_up) {
      // alert('Por favor borre el documento antes de subir otro')

      this.props.setState({
        modal_up: !this.props.params.modal_up,
        active: this.state.comp_id
      })
    }
    else {
      this.reader = new FileReader();
      this.reader.readAsDataURL(file);
      this.reader.onloadend = () => {
        var image = new FormData()

        if (this.props.params.per_type === 'fisica') {
          image.append('image', file)
          image.append('pdf', pdf)
        }
        else if (this.props.params.per_type === 'afore') {
          if (file.name.endsWith('.mp4')) {
            image.append('video', file)
            this.setState({
              type_file: 'video'
            })
          }
          else {
            image.append('image', file)
            this.setState({
              type_file: 'image'
            })
          }
        }
        else {
          image.append('pdf', file)
        }
        if (this.props.params.per_type === 'afore') {
          this.setState({
            file: image,
            doc_up: true,
            pdf,
            image: this.reader.result
          }, () => {
            if (file.name.endsWith('.mp4')) {
              this.props.setState({
                video: file
              })
            }
            else {
              this.props.setState({
                image: file
              })
            }
          });
        }
        else {
          this.setState({
            file: image,
            doc_up: true,
            pdf,
            spinner: '',
            image: this.reader.result

          }, () => {
            this.uploadFile();
          });
        }
      }
    }
  }

  uploadFile = () => {

    if (localStorage.getItem("id_token")) {

      let url
      // let res

      if (this.props.params.per_type === 'fisica') {
        url = API_URL + '/api/v1/get_url/search'
      }
      else if (this.props.params.per_type === 'moral') {
        url = API_URL + '/api/v1/read_acts/search'
      }

      axios({
        method: 'POST',
        url,
        data: this.state.file,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }).then((res) => {
        this.setState({
          spinner: 'd-none',
          comp_name: true
        })

        if (this.props.params.per_type === 'fisica') {

          let type_img = res['data']['type_img']

          let data = res['data']['data_text']

          if (data === 'Documento no identificado') {
            this.inputRef.current.value = ""
            this.setState({
              doc_up: false
            }, () => {
              this.props.setState({
                modal: !this.props.params.modal
              })
            })
          }
          else if (data === 'Documento en mala posicion') {
            this.inputRef.current.value = ""
            this.setState({
              doc_up: false
            }, () => {
              this.props.setState({
                modal_pos: !this.props.params.modal_pos
              })
            })
          }
          else if (type_img === this.props.params.up_1 || type_img === this.props.params.up_2) {
            this.inputRef.current.value = ""
            this.deleteForm()
            this.deleteDoc()
            this.props.setState({
              modal_del: !this.props.params.modal_del
            })

          }
          else {
            const birthdate = data['birthdate']
            const address = data['address']

            // Check type of document
            var index
            if (res['data']['type_img'] === 'ine') {
              index = 0;
            }
            else if (res['data']['type_img'] === 'licencia') {
              index = 1;
            }
            else {
              index = 2;
            }

            // Set checked document
            const copyChecked = []
            copyChecked.concat(checkedCopy)
            copyChecked[index] = true;

            // Set user info
            this.setState({
              user: {
                name: data['name']['first_name'],
                first_surname: data['name']['first_surname'],
                second_surname: data['name']['second_surname'],
                birthdate: birthdate[0] + "-" + birthdate[1] + "-" + birthdate[2],
                gender: data['sex'],
                curp: data['curp'],
                city: address['city'],
                colony: address['colony'],
                state: address['state'],
                street: address['street'],
                clave: data['id_card']
              },
              checked: copyChecked,
              disabled: false,
              num_activ: '-active'
            }, () => {

              this.onClick()

              if (this.state.comp_id === 0) {
                this.props.checkContinue(this.state.user)
                this.props.setState({
                  img_1: res['data']['img_name'],
                  name_1: this.state.user.name,
                  first_surname_1: this.state.user.first_surname,
                  second_surname_1: this.state.user.second_surname,
                  birthdate_1: this.state.user.birthdate,
                  curp_1: this.state.user.curp,
                  up_1: type_img,
                  clave_1: this.state.user.clave,
                  gender_1: this.state.user.gender,
                  city_1: this.state.user.city,
                  colony_1: this.state.user.colony,
                  state_1: this.state.user.state,
                  street_1: this.state.user.street,
                  comp: true,
                  comp_name: true,
                  comp_surname1: true,
                  comp_surname2: true,
                  comp_birth: true,
                  comp_city: true,
                  comp_colony: true,
                  comp_state: true,
                  comp_street: true,
                  comp_gender: true,
                  comp_clave: true,
                  comp_curp: true
                })
              } else if (this.state.comp_id === 1) {
                this.props.setState({
                  img_2: res['data']['img_name'],
                  name_2: this.state.user.name,
                  first_surname_2: this.state.user.first_surname,
                  second_surname_2: this.state.user.second_surname,
                  birthdate_2: this.state.user.birthdate,
                  curp_2: this.state.user.curp,
                  up_2: type_img,
                  clave_2: this.state.user.clave,
                  gender_2: this.state.user.gender,
                  city_2: this.state.user.city,
                  colony_2: this.state.user.colony,
                  state_2: this.state.user.state,
                  street_2: this.state.user.street,
                  comp_name: true,
                  comp_surname1: true,
                  comp_surname2: true,
                  comp_birth: true,
                  comp_city: true,
                  comp_colony: true,
                  comp_state: true,
                  comp_street: true,
                  comp_gender: true,
                  comp_clave: true,
                  comp_curp: true,
                })
              }
            })
          }
        }
        else {

          let data = res['data']

          let doc_type = data['type']

          this.setState({
            doc_type
          })

          if (this.props.params.last_moral_up === doc_type) {
            alert('Hay que subir un archivo diferente la anterior')
            this.setState({
              doc_up: false
            })
          }
          else {
            this.props.setState({
              last_moral_up: doc_type
            })

            if (doc_type === 'acta') {

              const copyChecked = []
              copyChecked.concat(checkedCopy)
              copyChecked[3] = true;
              const data_length = data['entities'].length

              let entities_json = []

              for (let i = 0; i < data_length; i++) {
                let entity = [
                  data['entities'][i],
                  '',
                  false
                ]
                entities_json.push(entity)
              }
              this.setState({
                entities: entities_json,
                checked: copyChecked,
                disabled: false,
                num_activ: '-active'
              }, () => {
                this.onClick()
              })
            }
            else {

              const copyChecked = []
              copyChecked.concat(checkedCopy)
              copyChecked[4] = true;

              this.setState({
                moral: {
                  activities: data['activities'][0]['activity'],
                  address: {
                    city: data['address']['city'],
                    colony: data['address']['colony'],
                    state: data['address']['state'],
                    street: data['address']['street'],
                    zip: data['address']['zip']
                  },
                  business_name: data['business_name'],
                  cap_reg: data['capital_regime'],
                  last_update: data['last_date_of_change'],
                  rfc: data['rfc'],
                  first_op: data['start_date_of_operations'],
                  status: data['status'],
                  tradename: data['tradename']
                },
                checked: copyChecked,
                disabled: false,
                num_activ: '-active'
              }, () => {
                this.onClick()
                this.props.setState({
                  moral: {
                    activities: data['activities'][0]['activity'],
                    address: {
                      city: data['address']['city'],
                      colony: data['address']['colony'],
                      state: data['address']['state'],
                      street: data['address']['street'],
                      zip: data['address']['zip']
                    },
                    business_name: data['business_name'],
                    cap_reg: data['capital_regime'],
                    last_update: data['last_date_of_change'],
                    rfc: data['rfc'],
                    first_op: data['start_date_of_operations'],
                    status: data['status'],
                    tradename: data['tradename']
                  }
                })
              })
            }
          }

        }
      })
    } else {
      alert('Token error')
    }
  }

  checkCard(index) {
    const checked = this.state.checked.map((checkbox, i) => {
      if (i === index) {
        return !checkbox
      } else {
        return false
      }
    })
    this.setState({
      checked,
    })
  }

  onClick = () => {
    this.setState({
      info: true,
      spinner: 'd-none'
    });
  }

  saveData = () => {
    let entities_true = []

    this.state.entities.forEach(function (element) {
      if (element[2]) {
        entities_true.push(element)
      }
    })

    this.props.setState({
      entities: entities_true
    })

  }

  deleteDoc = () => {
    this.setState({
      doc_up: false,
      checked: checkedCopy,
      image: ''
    }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({
          up_1: ''
        })
      }
      else {
        this.props.setState({
          up_2: ''
        })
      }
    })

    if (this.props.params.per_type == 'afore') {
      if (this.state.comp_id == 1) {
        this.props.setState({
          video: '',
          error: '',
          afore: {
            identity_verified: '',
            name_verified: '',
            organization_destiny: '',
            organization_origin: '',
            name_ine: '',
            name_video: ''
          }
        })
      }
      else {
        this.props.setState({
          image: '',
          error: '',
          afore: {
            identity_verified: '',
            name_verified: '',
            organization_destiny: '',
            organization_origin: '',
            name_ine: '',
            name_video: ''
          }
        })
      }
    }
    this.inputRef.current.value = ""
    this.deleteForm()
  }

  deleteForm = () => {
    this.setState({
      user: { name: '', first_surname: '', second_surname: '', city: '', colony: '', state: '', street: '', gender: '', clave: '', curp: '', birthdate: '' },
      moral: moralCopy,
      disabled: true,
    }, () => {
      if (this.state.comp_id === 0 && this.props.params.per_type === 'fisica') {

        this.props.setState({
          comp: true,
          continue: 'disabled',
          img_1: '',
          up_1: '',
          curp_1: '',
          name_1: '',
          first_surname_1: '',
          second_surname_1: '',
          birthdate_1: '',
          gender_1: '',
          city_1: '',
          colony_1: '',
          state_1: '',
          street_1: '',
          comp_name: true,
          comp_surname1: true,
          comp_surname2: true,
          comp_birth: true,
          comp_city: true,
          comp_colony: true,
          comp_state: true,
          comp_street: true,
          comp_gender: true,
          comp_clave: true,
          comp_curp: true,
        })
      }
      else if (this.state.comp_id === 1 && this.props.params.per_type === 'fisica') {
        this.props.setState({
          comp: true,
          img_2: '',
          up_2: '',
          curp_2: '',
          name_2: '',
          first_surname_2: '',
          second_surname_2: '',
          birthdate_2: '',
          gender_2: '',
          city_2: '',
          colony_2: '',
          state_2: '',
          street_2: '',
          comp_name: true,
          comp_surname1: true,
          comp_surname2: true,
          comp_birth: true,
          comp_city: true,
          comp_colony: true,
          comp_state: true,
          comp_street: true,
          comp_gender: true,
          comp_clave: true,
          comp_curp: true,
        })
      } else {
        this.props.setState({
          last_moral_up: '',
        })
      }
    });
  }

  handlerName = (event) => {
    let temp_moral = this.state.moral
    temp_moral['business_name'] = event.target.value
    this.setState({ moral: temp_moral }, () => {
      this.props.setState({ moral: temp_moral })
    })
  }

  handlerCity = (event) => {
    let temp_moral = this.state.moral
    temp_moral['address']["city"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerColony = (event) => {
    let temp_moral = this.state.moral
    temp_moral['address']["colony"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerState = (event) => {
    let temp_moral = this.state.moral
    temp_moral['address']["state"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerStreet = (event) => {
    let temp_moral = this.state.moral
    temp_moral['address']["street"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerActivities = (event) => {
    let temp_moral = this.state.moral
    temp_moral["activities"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerRFC = (event) => {
    let temp_moral = this.state.moral
    temp_moral["rfc"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerStatus = (event) => {
    let temp_moral = this.state.moral
    temp_moral["status"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerTradename = (event) => {
    let temp_moral = this.state.moral
    temp_moral["tradename"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerCapReg = (event) => {
    let temp_moral = this.state.moral
    temp_moral["cap_reg"] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerDateRegDay = (event) => {
    let temp_moral = this.state.moral
    temp_moral["first_op"][0] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerDateRegMonth = (event) => {
    let temp_moral = this.state.moral
    temp_moral["first_op"][1] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerDateRegYear = (event) => {
    let temp_moral = this.state.moral
    temp_moral["first_op"][2] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerUpdRegDay = (event) => {
    let temp_moral = this.state.moral
    temp_moral["last_update"][0] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerUpdRegMonth = (event) => {
    let temp_moral = this.state.moral
    temp_moral["last_update"][1] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerUpdRegYear = (event) => {
    let temp_moral = this.state.moral
    temp_moral["last_update"][2] = event.target.value
    this.setState({ moral: temp_moral }, () => { this.props.setState({ moral: temp_moral }) })
  }

  handlerPerName = (event) => {
    let temp_user = this.state.user
    temp_user['name'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ name_1: this.state.user.name, comp_name: true, comp: true })
      } else {
        this.props.setState({ name_2: this.state.user.name, comp_name: true, comp: true })
      }
    })
  }

  handlerFisrSurname = (event) => {
    let temp_user = this.state.user
    temp_user['first_surname'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ first_surname_1: this.state.user.first_surname, comp_surname1: true, comp: true })
      }
      else {
        this.props.setState({ first_surname_2: this.state.user.first_surname, comp_surname1: true, comp: true })
      }
    })
  }

  handlerSecondSurname = (event) => {
    let temp_user = this.state.user
    temp_user['second_surname'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ second_surname_1: this.state.user.second_surname, comp_surname2: true, comp: true })
      }
      else {
        this.props.setState({ second_surname_2: this.state.user.second_surname, comp_surname2: true, comp: true })
      }
    })
  }

  handlerBirth = (event) => {
    let temp_user = this.state.user
    temp_user['birthdate'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ birthdate_1: this.state.user.birthdate, comp_birth: true, comp: true })
      }
      else {
        this.props.setState({ birthdate_2: this.state.user.birthdate, comp_birth: true, comp: true })
      }
    })
  }

  handlerPerCity = (event) => {
    let temp_user = this.state.user
    temp_user['city'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ city_1: this.state.user.city, comp_city: true, comp: true })
      }
      else {
        this.props.setState({ city_2: this.state.user.city, comp_city: true, comp: true })
      }
    })
  }

  handlerPerColony = (event) => {
    let temp_user = this.state.user
    temp_user['colony'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ colony_1: this.state.user.colony, comp_colony: true, comp: true })
      }
      else {
        this.props.setState({ colony_2: this.state.user.colony, comp_colony: true, comp: true })
      }
    })
  }
  handlerPerState = (event) => {
    let temp_user = this.state.user
    temp_user['state'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ state_1: this.state.user.state, comp_state: true, comp: true })
      }
      else {
        this.props.setState({ state_2: this.state.user.state, comp_state: true, comp: true })
      }
    })
  }
  handlerPerStreet = (event) => {
    let temp_user = this.state.user
    temp_user['street'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ street_1: this.state.user.street, comp_street: true, comp: true })
      }
      else {
        this.props.setState({ street_2: this.state.user.street, comp_street: true, comp: true })
      }
    })
  }

  handlerGender = (event) => {
    let temp_user = this.state.user
    temp_user['gender'] = event.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ gender_1: this.state.user.gender, comp_gender: true, comp: true })
      }
      else {
        this.props.setState({ gender_2: this.state.user.gender, comp_gender: true, comp: true })
      }
    })
  }

  handlerClave = (event) => {
    let temp_user = this.state.user
    temp_user['clave'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ clave_1: this.state.user.clave, comp_clave: true, comp: true })
      }
      else {
        this.props.setState({ clave_2: this.state.user.clave, comp_clave: true, comp: true })
      }
    })
  }

  handlerCURP = (event) => {
    let temp_user = this.state.user
    temp_user['curp'] = event.target.value
    this.setState({ user: temp_user }, () => {
      if (this.state.comp_id === 0) {
        this.props.setState({ curp_1: this.state.user.curp, comp_curp: true, comp: true })
      }
      else {
        this.props.setState({ curp_2: this.state.user.curp, comp_curp: true, comp: true })
      }
    })
  }

  toggle = () => {
    this.setState(prevState => ({
      image_open: !prevState.image_open
    }));
  }

  render() {
    const { user } = this.state
    const { moral } = this.state
    return (
      <div>
        <Modal isOpen={this.state.image_open} toggle={this.toggle}>
          <img src={this.state.image} height="100%" width="100%" onClick={this.toggle}></img>
        </Modal>
        <div className={`document-card ${this.props.customClasses}`}>
          <div className={"spinnermodal " + this.state.spinner}>
            <Spinner style={{ width: '2rem', height: '2rem' }} />{' '}
          </div>
          {this.state.image !== '' &&
          <div className="datawrapper">
            <button onClick={this.deleteDoc} className="fa-btn ml-auto">
              {this.props.params.per_type === 'afore' && this.state.comp_id == 0 && this.props.params.image != '' && <FaTrash />}
              {this.props.params.per_type === 'afore' && this.state.comp_id == 1 && this.props.params.video != '' && <FaTrash />}
              {this.props.params.per_type !== 'afore' && <FaTrash />}
            </button>
          </div>
          }
          {this.props.params.per_type === 'afore' && <p className="title">{this.state.comp_id == 0 ? 'INE' : 'Vídeo'}</p>}
          <p className="subtitle">Sube tu archivo a reconocer, puede ser {this.props.params.per_type === 'fisica' && <b> INE, IFE, Licencia o Pasaporte</b>}
            {this.props.params.per_type === 'moral' && <b> Acta Constitutiva o RFC</b>}
            {this.props.params.per_type === 'afore' && <b>{this.state.comp_id == 0 ? '.jpg, .jpeg o .png' : '.mp4'}</b>}</p>
          {this.props.params.per_type !== 'afore' && <input onChange={this.loadFileToBase64} ref={this.inputRef} type="file" accept=".jpg, .jpeg, .png, .pdf" className="select-file" />}
          {this.props.params.per_type === 'afore' && <input onChange={this.loadFileToBase64} ref={this.inputRef} type="file" accept={this.props.params.per_type === 'afore' && this.state.comp_id == 0 ? '.jpg, .jpeg, .png, .pdf' : '.mp4'} className="select-file" />}
          <form action="">
            <div className="select-document-form flex-column flex-md-row mt-30">
              {
                this.state.documentsList.map((type, index) => {
                  return (

                    <React.Fragment>
                      {this.state.checked[index] &&
                        <div key={`document-card-${index}-${this.state.comp_id}`} className={`documentwrapper ${this.state.checked[index] ? '-selected' : ''}`}>

                          <input checked={this.state.checked[index]} onChange={() => this.checkCard(index)} className="radio" type="checkbox" disabled />
                          <div className="checked">
                            <FaCheckCircle />
                          </div>

                          <div className={`documenttype ${type.image}`}></div>
                          <p className="text-center">{type.documentType}</p>
                        </div>
                      }
                    </React.Fragment>
                  )
                })
              }
              {!this.state.pdf &&
                <React.Fragment>
                  {this.state.doc_up &&
                    <div style={{ marginRight: "80px" }}>
                      <p><b>Abrir vista previa</b></p>
                      {this.state.type_file == 'video' ? <i className="fas fa-video fs-40"></i> : <img src={this.state.image} position="center" className="datawrapper flex-column" height="100px" onClick={this.toggle} />}
                    </div>
                  }
                </React.Fragment>
              }
            </div>
          </form>
        </div>


        {this.props.params.per_type != 'afore' && <div className="document-card -light -border">
          {this.props.params.per_type === 'fisica' &&
            <React.Fragment>
              <div className="datawrapper flex-column">
                <InputForm inputColor="-secondary" borderColor={this.props.params.name_color} label="Nombre(s)*" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerPerName} type="text" value={user.name} />
                <InputForm inputColor="-secondary" borderColor={this.props.params.surname1_color} label="Apellido Paterno*" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerFisrSurname} type="text" value={user.first_surname} />
                <InputForm inputColor="-secondary" borderColor={this.props.params.surname2_color} label="Apellido Materno*" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerSecondSurname} type="text" value={user.second_surname} />
              </div>
              <div className="datawrapper flex-column">
                <InputForm inputColor="-secondary" borderColor={this.props.params.birth_color} label="Nacimiento* DD-MM-AAAA" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerBirth} type="text" value={user.birthdate} />
              </div>
              <div className="datawrapper flex-column">
                <InputForm inputColor="-secondary" borderColor={this.props.params.city_color} label="Ciudad" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerPerCity} type="text" value={user.city} />
                <InputForm inputColor="-secondary" borderColor={this.props.params.colony_color} label="Colonia" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerPerColony} type="text" value={user.colony} />
                <InputForm inputColor="-secondary" borderColor={this.props.params.state_color} label="Estado" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerPerState} type="text" value={user.state} />
                <InputForm inputColor="-secondary" borderColor={this.props.params.street_color} label="Calle" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerPerStreet} type="text" value={user.street} />
              </div>
              <div className="datawrapper flex-column">
                {/* <Select
                  onChange={this.handlerGender}
                  options={options}
                >Género</Select> */}
                <InputForm inputColor="-secondary" borderColor={this.props.params.gender_color} label="Sexo" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerGender} type="text" value={user.gender} />
              </div>
              <div className="datawrapper flex-column">
                <InputForm inputColor="-secondary" borderColor={this.props.params.clave_color} label="No. identificación" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerClave} type="text" value={user.clave} />
              </div>
              <div className="datawrapper flex-column">
                <InputForm inputColor="-secondary" borderColor={this.props.params.curp_color} label="CURP*" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerCURP} type="text" value={user.curp} />
              </div>
            </React.Fragment>
          }
          {this.props.params.per_type === 'moral' &&
            <React.Fragment>
              {this.state.doc_type === 'acta' &&
                <React.Fragment>
                  <form action="">
                    {this.state.entities.map((entity, index) => {
                      return (
                        <Checkbox
                          onClick={() => { this.toggle() }}
                          setState={() => { this._setState() }}
                          index={index}
                          value={entity}
                        />
                      )
                    })
                    }
                  </form>
                  <div className="col-12 px-0">
                    <button className="button -outline" onClick={this.saveData}>GUARDAR</button>
                  </div>
                </React.Fragment>
              }
              {this.state.doc_type === 'rfc' &&
                <React.Fragment>
                  <div className="datawrapper flex-column">
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerName} type="text" label="Nombre" value={moral.business_name} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerCity} type="text" label="Ciudad" value={moral.address.city} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerColony} type="text" label="Colonia" value={moral.address.colony} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerState} type="text" label="Estado" value={moral.address.state} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerStreet} type="text" label="Calle" value={moral.address.street} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerActivities} type="text" label="Actividad" value={moral.activities} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerRFC} type="text" label="RFC" value={moral.rfc} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerStatus} type="text" label="Estado" value={moral.status} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerTradename} type="text" label="Nombre comercial" value={moral.tradename} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerCapReg} type="text" label="Regimen de Capital" value={moral.cap_reg} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerDateRegDay} type="number" label="Día" value={moral.first_op[0]} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerDateRegMonth} type="number" label="Mes" value={moral.first_op[1]} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerDateRegYear} type="number" label="Año" value={moral.first_op[2]} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerUpdRegDay} type="number" label="Día" value={moral.last_update[0]} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerUpdRegMonth} type="number" label="Mes" value={moral.last_update[1]} />
                    <InputForm inputColor="-secondary" customClasses="mt-50" warning="Datos no válidos" onChange={this.handlerUpdRegYear} type="number" label="Año" value={moral.last_update[2]} />
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <ButtonOutline title="GUARDAR" customClass="mt-30" />
                    </div>
                  </div>
                </React.Fragment>
              }
            </React.Fragment>
          }
        </div>}
      </div>
    );
  }
}

export default DocumentCard
