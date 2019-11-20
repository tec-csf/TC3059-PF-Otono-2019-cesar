import React from 'react';
import { Button, Spinner,Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import InputForm from '../../components/InputForm/InputForm'
import { ButtonPrimary } from '../../components/Button/Button'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const API_URL = process.env.REACT_APP_API_URL

class CmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      account: '', 
      spinner: 'd-none'
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.props.setState({showModal: false})
  }

  componentDidUpdate = () => {
    if (this.props.show && !this.state.modal) {
      this.toggle()
    }
  }

  handlerAccount = (event) =>{
    this.setState({
      account: event.target.value
    })
  }

  onClick = () =>{

    let url = API_URL + '/api/v1/social/upload'

    this.setState({
      spinner:''
    })
    axios({                                                         
      method:'POST',                                                    
      url,                                                           
      data: {
        twitter_account:[this.state.account],
        rfc: this.props.rfc,
        type: this.props.type,
        user_id: [jwtDecode(localStorage.getItem("id_token")).sub]
      },                                        
      config: {headers: {'Content-Type': 'multipart/form-data'}}    
    }).then((res) => {
      this.setState(prevState => ({
        modal: !prevState.modal, 
        spinner:'d-none'
      }));
      this.props.setState({showModal: false})
      window.location.reload()
    })
  }

  render() {
    switch(this.props.modalType) {
      case 'twitter':
        return (
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <div className={"spinnermodal "+ this.state.spinner}>
                  <Spinner style={{ width: '2rem', height: '2rem' }} />{' '}
                </div> 
              <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
              <ModalBody>
                   
                <InputForm 
                  inputColor="-secondary" 
                  customClasses="mt-50" 
                  warning="Cuenta no válida" 
                  type="text" 
                  label="Cuenta de twitter"
                  placeholder='ej: @nombreDeCuenta'
                  value={this.state.account}
                  onChange={this.handlerAccount}
                />
              </ModalBody>
              <ModalFooter>            
                <ButtonPrimary
                  onClick={this.onClick}
                  title='Añadir cuenta'                  
                />
              </ModalFooter>
            </Modal>
          </div>
        );

      default :
        return (
          <div>           
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            
              <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
              <ModalBody> 
                         
              </ModalBody>
              <ModalFooter>            
              </ModalFooter>
            </Modal>
          </div>
        );
    }
  }
}

export default CmModal;