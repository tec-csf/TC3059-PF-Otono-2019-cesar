import React, { Component } from 'react'

class ContactTopBar extends Component {
  render() {
    return(
      <React.Fragment>
        <div class="contact-bar w-100 d-none d-lg-flex">
          <div class="contact-method ml-auto mr-10">
            <i class="fas fa-phone"></i>
            <a href="tel:+525550812070">+52 (55) 50 81 20 70 ext. 119 / 114</a>
          </div>
          <div class="contact-method">    
            <a class="wp-btn" href="https://wa.me/525555084620?text=Quiero más información sobre Riesgo cognitivo" target="blank"><i class="fab fa-whatsapp whatsapp-icon"></i> Contáctanos</a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ContactTopBar